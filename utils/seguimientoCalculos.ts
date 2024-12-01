
export interface EWMAResult {
  values: number[];
  controlLimits: {
    ucl: number;
    lcl: number;
    mean: number;
  };
  interpretation: {
    status: 'stable' | 'warning' | 'outOfControl';
    points: number;
    trend: string;
  };
}

export interface CUSUMResult {
  positiveSum: number[];
  negativeSum: number[];
  controlLimit: number;
  target: number;
  interpretation: {
    status: 'stable' | 'warning' | 'outOfControl';
    aboveTarget: number;
    belowTarget: number;
  };
}

export const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  useShadowColorFromDataset: false
};

export const chartColors = {
  blue: 'rgb(54, 162, 235)',
  red: 'rgb(255, 99, 132)',
  green: 'rgb(75, 192, 192)',
  purple: 'rgb(153, 102, 255)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)'
};

export function stringToNumberArray(data: string): number[] {
  return data.split(',')
    .map(num => num.trim())
    .filter(num => num !== '')
    .map(num => {
      const parsed = parseFloat(num);
      if (isNaN(parsed)) {
        throw new Error('Datos inválidos');
      }
      return parsed;
    });
}

export function calculateEWMA(data: string, lambda: string): EWMAResult | null {
  try {
    const values = stringToNumberArray(data);
    const l = parseFloat(lambda);

    if (isNaN(l) || l <= 0 || l > 1) {
      throw new Error('Lambda debe estar entre 0 y 1');
    }

    const ewma = [];
    let current = values[0];
    
    // Calcular EWMA
    for (let i = 0; i < values.length; i++) {
      current = l * values[i] + (1 - l) * (current || values[i]);
      ewma.push(current);
    }

    // Calcular estadísticas
    const mean = values.reduce((a, b) => a + b) / values.length;
    const std = Math.sqrt(
      values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
    );
    const factor = Math.sqrt((l / (2 - l)) * (1 - Math.pow(1 - l, 2 * values.length)));
    
    const ucl = mean + 3 * std * factor;
    const lcl = mean - 3 * std * factor;

    // Analizar resultados
    const outOfControlPoints = ewma.filter(v => v > ucl || v < lcl).length;
    const trend = analyzeTrend(ewma);
    const status = getProcessStatus(outOfControlPoints, ewma.length);

    return {
      values: ewma,
      controlLimits: { ucl, lcl, mean },
      interpretation: {
        status,
        points: outOfControlPoints,
        trend
      }
    };
  } catch (error) {
    console.error('Error en cálculo EWMA:', error);
    return null;
  }
}

export function calculateCUSUM(data: string, target: string, kValue: string): CUSUMResult | null {
  try {
    const values = stringToNumberArray(data);
    const targetValue = parseFloat(target);
    const k = parseFloat(kValue);

    if (isNaN(targetValue) || isNaN(k)) {
      throw new Error('Valores inválidos para CUSUM');
    }

    const positiveSum = [];
    const negativeSum = [];
    let cPos = 0;
    let cNeg = 0;

    // Calcular CUSUM
    for (let i = 0; i < values.length; i++) {
      cPos = Math.max(0, values[i] - (targetValue + k) + (cPos || 0));
      cNeg = Math.max(0, (targetValue - k) - values[i] + (cNeg || 0));
      positiveSum.push(cPos);
      negativeSum.push(cNeg);
    }

    // Calcular límite de decisión h
    const std = Math.sqrt(
      values.reduce((a, b) => a + Math.pow(b - targetValue, 2), 0) / values.length
    );
    const h = 4 * std;

    // Analizar resultados
    const aboveTarget = positiveSum.filter(v => v > h).length;
    const belowTarget = negativeSum.filter(v => v > h).length;
    const status = getProcessStatus(aboveTarget + belowTarget, values.length);

    return {
      positiveSum,
      negativeSum,
      controlLimit: h,
      target: targetValue,
      interpretation: {
        status,
        aboveTarget,
        belowTarget
      }
    };
  } catch (error) {
    console.error('Error en cálculo CUSUM:', error);
    return null;
  }
}

function analyzeTrend(values: number[]): string {
  if (values.length < 2) return 'Insuficientes datos';
  
  let increasing = 0;
  let decreasing = 0;

  for (let i = 1; i < values.length; i++) {
    if (values[i] > values[i-1]) increasing++;
    if (values[i] < values[i-1]) decreasing++;
  }

  const total = values.length - 1;
  if (increasing / total > 0.7) return 'Tendencia ascendente';
  if (decreasing / total > 0.7) return 'Tendencia descendente';
  return 'Sin tendencia clara';
}

function getProcessStatus(outOfControl: number, total: number): 'stable' | 'warning' | 'outOfControl' {
  const ratio = outOfControl / total;
  if (ratio > 0.1) return 'outOfControl';
  if (ratio > 0.05) return 'warning';
  return 'stable';
}

export function validateInput(value: string): boolean {
  return /^-?\d*\.?\d*$/.test(value.trim());
}

export function getStatusColor(status: 'stable' | 'warning' | 'outOfControl'): string {
  switch (status) {
    case 'stable': return chartColors.green;
    case 'warning': return chartColors.yellow;
    case 'outOfControl': return chartColors.red;
    default: return chartColors.blue;
  }
}

export function formatNumber(value: number): string {
  return value.toFixed(2);
}