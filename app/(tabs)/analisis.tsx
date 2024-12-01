// screens/analisis.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart
} from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const DEFAULT_USL = "12";
const DEFAULT_LSL = "8";
const SUGGESTED_VALUE = "10.0";

interface AnalysisResult {
  mean: number;
  stdDev: number;
  ucl: number;
  lcl: number;
  cp?: number;
  cpk?: number;
}

const chartColors = {
  blue: 'rgb(54, 162, 235)',
  green: 'rgb(75, 192, 192)',
  purple: 'rgb(153, 102, 255)',
  orange: 'rgb(255, 159, 64)',
  red: 'rgb(255, 99, 132)',
  yellow: 'rgb(255, 205, 86)'
};

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

function getCapabilityInterpretation(value: number): string {
  if (value >= 1.33) return "Proceso capaz";
  if (value >= 1.00) return "Proceso marginalmente capaz";
  return "Proceso no capaz";
}

function getCpkInterpretation(cp: number, cpk: number): string {
  const diff = cp - cpk;
  if (diff < 0.1) return "Proceso bien centrado";
  if (diff < 0.2) return "Proceso ligeramente descentrado";
  return "Proceso significativamente descentrado";
}

export default function AnalisisScreen() {
  const [currentValue, setCurrentValue] = useState(SUGGESTED_VALUE);
  const [lastEnteredValue, setLastEnteredValue] = useState("");
  const [measurements, setMeasurements] = useState<number[]>([]);
  const [usl, setUSL] = useState(DEFAULT_USL);
  const [lsl, setLSL] = useState(DEFAULT_LSL);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isFirstEntry, setIsFirstEntry] = useState(true);

  const addMeasurement = () => {
    const value = parseFloat(currentValue);
    if (isNaN(value)) {
      Alert.alert('Error', 'Por favor ingrese un número válido');
      return;
    }
    
    const newMeasurements = [...measurements, value];
    setMeasurements(newMeasurements);
    
    if (isFirstEntry) {
      setLastEnteredValue(currentValue);
      setIsFirstEntry(false);
      setCurrentValue(currentValue);
    } else {
      setCurrentValue(lastEnteredValue);
    }
    
    calculateStats(newMeasurements);
  };

  const calculateStats = (data: number[]) => {
    if (data.length < 2) return;

    try {
      const mean = data.reduce((a, b) => a + b) / data.length;
      const stdDev = Math.sqrt(
        data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / 
        (data.length - 1)
      );

      const ucl = mean + 3 * stdDev;
      const lcl = mean - 3 * stdDev;

      const uslValue = parseFloat(usl);
      const lslValue = parseFloat(lsl);
      
      const cp = (uslValue - lslValue) / (6 * stdDev);
      const cpu = (uslValue - mean) / (3 * stdDev);
      const cpl = (mean - lslValue) / (3 * stdDev);
      const cpk = Math.min(cpu, cpl);

      setResults({ mean, stdDev, ucl, lcl, cp, cpk });
    } catch (error) {
      Alert.alert('Error', 'Error en los cálculos');
    }
  };

  const renderControlChart = () => {
    if (!measurements.length || !results) return null;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Gráfico de Control</Text>
        <LineChart
          data={{
            labels: measurements.map(() => ''),
            datasets: [
              {
                data: measurements,
                color: () => chartColors.blue
              },
              {
                data: new Array(measurements.length).fill(results.mean),
                color: () => chartColors.green,
                withDots: false
              },
              {
                data: new Array(measurements.length).fill(results.ucl),
                color: () => chartColors.red,
                withDots: false
              },
              {
                data: new Array(measurements.length).fill(results.lcl),
                color: () => chartColors.red,
                withDots: false
              }
            ]
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
        <Text style={styles.explanationText}>
          Análisis del gráfico de control:{"\n"}
          • Media: {results.mean.toFixed(2)}{"\n"}
          • UCL: {results.ucl.toFixed(2)}{"\n"}
          • LCL: {results.lcl.toFixed(2)}{"\n"}
          • Puntos fuera de control: {
            measurements.filter(m => m > results.ucl || m < results.lcl).length
          }
        </Text>
      </View>
    );
  };

  const renderHistogram = () => {
    if (!measurements.length) return null;

    const numBins = 7;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);
    const binSize = (max - min) / numBins;
    
    const bins = Array(numBins).fill(0);
    measurements.forEach(m => {
      const binIndex = Math.min(
        Math.floor((m - min) / binSize),
        numBins - 1
      );
      bins[binIndex]++;
    });

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Histograma</Text>
        <BarChart
          data={{
            labels: bins.map((_, i) => 
              (min + i * binSize).toFixed(1)
            ),
            datasets: [{ data: bins }]
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: () => chartColors.purple
          }}
          style={styles.chart}
        />
        <Text style={styles.explanationText}>
          Análisis de distribución:{"\n"}
          • Rango: {min.toFixed(2)} - {max.toFixed(2)}{"\n"}
          • Frecuencia máxima: {Math.max(...bins)}{"\n"}
          • Ancho de clase: {binSize.toFixed(2)}
        </Text>
      </View>
    );
  };

  const renderCapabilityChart = () => {
    if (!measurements.length || !results?.cp || !results?.cpk) return null;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Gráfico de Capacidad</Text>
        <BarChart
          data={{
            labels: ['LSL', 'Media', 'USL'],
            datasets: [{
              data: [parseFloat(lsl), results.mean, parseFloat(usl)]
            }]
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: () => chartColors.green
          }}
          style={styles.chart}
        />
        <Text style={styles.explanationText}>
          Análisis de capacidad:{"\n"}
          • LSL: {lsl}{"\n"}
          • Media: {results.mean.toFixed(2)}{"\n"}
          • USL: {usl}{"\n"}
          • Cp: {results.cp.toFixed(2)} - {getCapabilityInterpretation(results.cp)}{"\n"}
          • Cpk: {results.cpk.toFixed(2)} - {getCapabilityInterpretation(results.cpk)}
        </Text>
      </View>
    );
  };

  const renderRunChart = () => {
    if (!measurements.length) return null;

    const movingAverage = measurements.map((_, index) => {
      const start = Math.max(0, index - 2);
      const subset = measurements.slice(start, index + 1);
      return subset.reduce((a, b) => a + b, 0) / subset.length;
    });

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Gráfico de Tendencia</Text>
        <LineChart
          data={{
            labels: measurements.map((_, i) => `${i+1}`),
            datasets: [
              {
                data: measurements,
                color: () => chartColors.orange
              },
              {
                data: movingAverage,
                color: () => chartColors.green,
                withDots: false
              }
            ]
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
        <Text style={styles.explanationText}>
          Análisis de tendencia:{"\n"}
          • Total de mediciones: {measurements.length}{"\n"}
          • Media móvil actual: {movingAverage[movingAverage.length - 1].toFixed(2)}
        </Text>
      </View>
    );
  };

  const renderRangeChart = () => {
    if (measurements.length < 2) return null;

    const ranges = measurements.slice(1).map((value, index) => 
      Math.abs(value - measurements[index])
    );

    const avgRange = ranges.reduce((a, b) => a + b, 0) / ranges.length;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Gráfico de Rangos</Text>
        <LineChart
          data={{
            labels: ranges.map(() => ''),
            datasets: [
              {
                data: ranges,
                color: () => chartColors.red
              },
              {
                data: new Array(ranges.length).fill(avgRange),
                color: () => chartColors.green,
                withDots: false
              }
            ]
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
        <Text style={styles.explanationText}>
          Análisis de rangos:{"\n"}
          • Rango promedio: {avgRange.toFixed(2)}{"\n"}
          • Rango máximo: {Math.max(...ranges).toFixed(2)}{"\n"}
          • Rango mínimo: {Math.min(...ranges).toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nueva medición:</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={currentValue}
            onChangeText={setCurrentValue}
            keyboardType="numeric"
            placeholder="Ingrese valor"
          />
          <TouchableOpacity
            style={[styles.button, { marginLeft: 10 }]}
            onPress={addMeasurement}
          >
            <Text style={styles.buttonText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Límite Superior (USL):</Text>
        <TextInput
          style={styles.input}
          value={usl}
          onChangeText={setUSL}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Límite Inferior (LSL):</Text>
        <TextInput
          style={styles.input}
          value={lsl}
          onChangeText={setLSL}
          keyboardType="numeric"
        />
      </View>

      {measurements.length > 0 && (
        <>
          <View style={styles.dataContainer}>
            <Text style={styles.subtitle}>Mediciones:</Text>
            <Text style={styles.dataText}>
              {measurements.join(', ')}
            </Text>
          </View>

          {results && (
            <View style={styles.resultsContainer}>
              <Text style={styles.subtitle}>Resultados:</Text>
              <Text style={styles.resultText}>Media: {results.mean.toFixed(2)}</Text>
              <Text style={styles.resultText}>
                Desviación Estándar: {results.stdDev.toFixed(2)}
              </Text>
              {results.cp && results.cpk && (
                <>
                  <Text style={styles.resultText}>
                    Cp: {results.cp.toFixed(2)} - {getCapabilityInterpretation(results.cp)}
                  </Text>
                  <Text style={styles.resultText}>
                    Cpk: {results.cpk.toFixed(2)} - {getCapabilityInterpretation(results.cpk)}
                  </Text>
                  <Text style={styles.resultText}>
                    Centrado: {getCpkInterpretation(results.cp, results.cpk)}
                  </Text>
                </>
              )}
            </View>
          )}

          {renderControlChart()}
          {renderHistogram()}
          {renderCapabilityChart()}
          {renderRunChart()}
          {renderRangeChart()}
        </>
      )}

      <TouchableOpacity
        style={[styles.button, styles.resetButton]}
        onPress={() => {
          setMeasurements([]);
          setCurrentValue(SUGGESTED_VALUE);
          setResults(null);
          setIsFirstEntry(true);
          setLastEnteredValue("");
        }}
      >
        <Text style={styles.buttonText}>Reiniciar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    margin: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultsContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 10,
  },
  dataText: {
    fontSize: 16,
    color: '#666',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  explanationText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    lineHeight: 20,
  }
});