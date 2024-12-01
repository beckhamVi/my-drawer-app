// utils/SixSigmaCalculations.ts

interface ProcessCapabilityResult {
  cp: number;
  cpk: number;
}

interface ControlLimitsResult {
  ucl: number;
  lcl: number;
}

interface NormalityTestResult {
  statistic: number;
  isNormal: boolean;
}

export const calculateProcessCapability = (
  usl: number,
  lsl: number,
  mean: number,
  stdDev: number
): ProcessCapabilityResult => {
  try {
    if (stdDev === 0) {
      throw new Error("La desviación estándar no puede ser cero");
    }
    
    const cp = (usl - lsl) / (6 * stdDev);
    const cpu = (usl - mean) / (3 * stdDev);
    const cpl = (mean - lsl) / (3 * stdDev);
    const cpk = Math.min(cpu, cpl);
    
    return { cp, cpk };
  } catch (error) {
    console.error("Error en calculateProcessCapability:", error);
    return { cp: 0, cpk: 0 };
  }
};

export const calculateControlLimits = (
  mean: number,
  stdDev: number
): ControlLimitsResult => {
  try {
    const ucl = mean + 3 * stdDev;
    const lcl = mean - 3 * stdDev;
    
    return { ucl, lcl };
  } catch (error) {
    console.error("Error en calculateControlLimits:", error);
    return { ucl: 0, lcl: 0 };
  }
};

export const calculateNormalityTest = (data: number[]): NormalityTestResult => {
  try {
    if (data.length < 2) {
      throw new Error("Se necesitan al menos 2 datos para el test de normalidad");
    }

    const mean = data.reduce((a, b) => a + b) / data.length;
    const stdDev = Math.sqrt(
      data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (data.length - 1)
    );

    // Implementación simplificada del test Anderson-Darling
    const sortedData = [...data].sort((a, b) => a - b);
    let sum = 0;
    
    for (let i = 0; i < data.length; i++) {
      const z = (sortedData[i] - mean) / stdDev;
      const cdf = 0.5 * (1 + Math.erf(z / Math.sqrt(2)));
      sum += (2 * i + 1) * (Math.log(cdf) + Math.log(1 - sortedData[data.length - 1 - i]));
    }
    
    const statistic = -data.length - sum / data.length;
    
    return {
      statistic,
      isNormal: statistic < 0.752 // valor crítico para α=0.05
    };
  } catch (error) {
    console.error("Error en calculateNormalityTest:", error);
    return { statistic: 0, isNormal: false };
  }
};