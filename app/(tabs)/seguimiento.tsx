import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import {
  calculateEWMA,
  calculateCUSUM,
  validateInput,
  chartConfig,
  chartColors,
  getStatusColor,
  formatNumber,
  type EWMAResult,
  type CUSUMResult
} from '../../utils/seguimientoCalculos';

const screenWidth = Dimensions.get('window').width;

export default function SeguimientoScreen() {
  // Estados para EWMA
  const [lambda, setLambda] = useState('0.2');
  const [ewmaData, setEwmaData] = useState('');
  const [ewmaResult, setEwmaResult] = useState<EWMAResult | null>(null);
  const [isCalculatingEWMA, setIsCalculatingEWMA] = useState(false);

  // Estados para CUSUM
  const [cusumData, setCusumData] = useState('');
  const [target, setTarget] = useState('');
  const [kValue, setKValue] = useState('0.5');
  const [cusumResult, setCusumResult] = useState<CUSUMResult | null>(null);
  const [isCalculatingCUSUM, setIsCalculatingCUSUM] = useState(false);

  const handleLambdaChange = useCallback((text: string) => {
    if (validateInput(text)) {
      setLambda(text);
    }
  }, []);

  const handleEWMACalculation = useCallback(async () => {
    try {
      setIsCalculatingEWMA(true);
      const result = calculateEWMA(ewmaData, lambda);
      if (result) {
        setEwmaResult(result);
      } else {
        Alert.alert(
          'Error',
          'Verifica que los datos estén en formato correcto (números separados por comas)'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al calcular EWMA');
    } finally {
      setIsCalculatingEWMA(false);
    }
  }, [ewmaData, lambda]);

  const handleCUSUMCalculation = useCallback(async () => {
    try {
      setIsCalculatingCUSUM(true);
      const result = calculateCUSUM(cusumData, target, kValue);
      if (result) {
        setCusumResult(result);
      } else {
        Alert.alert(
          'Error',
          'Verifica que los datos y parámetros estén en formato correcto'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al calcular CUSUM');
    } finally {
      setIsCalculatingCUSUM(false);
    }
  }, [cusumData, target, kValue]);

  const renderEWMAChart = useCallback(() => {
    if (!ewmaResult) return null;

    const { values, controlLimits, interpretation } = ewmaResult;
    const statusColor = getStatusColor(interpretation.status);

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Gráfico EWMA</Text>
          <View style={[styles.statusIndicator, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>
              {interpretation.status === 'stable' ? 'Estable' : 
               interpretation.status === 'warning' ? 'Precaución' : 'Fuera de Control'}
            </Text>
          </View>
        </View>

        <LineChart
          data={{
            labels: Array(values.length).fill(''),
            datasets: [
              {
                data: values,
                color: () => chartColors.blue,
                strokeWidth: 2
              },
              {
                data: Array(values.length).fill(controlLimits.ucl),
                color: () => chartColors.red,
                withDots: false
              },
              {
                data: Array(values.length).fill(controlLimits.lcl),
                color: () => chartColors.red,
                withDots: false
              },
              {
                data: Array(values.length).fill(controlLimits.mean),
                color: () => chartColors.green,
                withDots: false,
                strokeDasharray: [5, 5]
              }
            ]
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            ...chartConfig,
            propsForBackgroundLines: {
              strokeDasharray: ''
            },
            propsForLabels: {
              fontSize: 12
            }
          }}
          bezier
          style={styles.chart}
        />

        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Resultados:</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Límite Superior (UCL):</Text>
            <Text style={styles.resultValue}>{formatNumber(controlLimits.ucl)}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Media:</Text>
            <Text style={styles.resultValue}>{formatNumber(controlLimits.mean)}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Límite Inferior (LCL):</Text>
            <Text style={styles.resultValue}>{formatNumber(controlLimits.lcl)}</Text>
          </View>
        </View>

        <View style={styles.interpretationContainer}>
          <Text style={styles.interpretationTitle}>Interpretación:</Text>
          <Text style={styles.interpretationText}>
            • Puntos fuera de control: {interpretation.points}{'\n'}
            • Tendencia: {interpretation.trend}{'\n'}
            • Estado: {
              interpretation.status === 'stable' ? 'Proceso Estable' :
              interpretation.status === 'warning' ? 'Proceso en Alerta' :
              'Proceso Fuera de Control'
            }
          </Text>
        </View>
      </View>
    );
  }, [ewmaResult]);

  const renderCUSUMChart = useCallback(() => {
    if (!cusumResult) return null;

    const { positiveSum, negativeSum, controlLimit, target, interpretation } = cusumResult;
    const statusColor = getStatusColor(interpretation.status);

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Gráfico CUSUM</Text>
          <View style={[styles.statusIndicator, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>
              {interpretation.status === 'stable' ? 'Estable' : 
               interpretation.status === 'warning' ? 'Precaución' : 'Fuera de Control'}
            </Text>
          </View>
        </View>

        <LineChart
          data={{
            labels: Array(positiveSum.length).fill(''),
            datasets: [
              {
                data: positiveSum,
                color: () => chartColors.green,
                strokeWidth: 2
              },
              {
                data: negativeSum.map(v => -v),
                color: () => chartColors.orange,
                strokeWidth: 2
              },
              {
                data: Array(positiveSum.length).fill(controlLimit),
                color: () => chartColors.red,
                withDots: false
              },
              {
                data: Array(positiveSum.length).fill(-controlLimit),
                color: () => chartColors.red,
                withDots: false
              }
            ]
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            ...chartConfig,
            propsForBackgroundLines: {
              strokeDasharray: ''
            }
          }}
          bezier
          style={styles.chart}
        />

        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Resultados:</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Límite de Decisión (h):</Text>
            <Text style={styles.resultValue}>±{formatNumber(controlLimit)}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Valor Objetivo:</Text>
            <Text style={styles.resultValue}>{formatNumber(target)}</Text>
          </View>
        </View>

        <View style={styles.interpretationContainer}>
          <Text style={styles.interpretationTitle}>Interpretación:</Text>
          <Text style={styles.interpretationText}>
            • Señales sobre el objetivo: {interpretation.aboveTarget}{'\n'}
            • Señales bajo el objetivo: {interpretation.belowTarget}{'\n'}
            • Estado: {
              interpretation.status === 'stable' ? 'Proceso Estable' :
              interpretation.status === 'warning' ? 'Proceso en Alerta' :
              'Proceso Fuera de Control'
            }
          </Text>
        </View>
      </View>
    );
  }, [cusumResult]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionContainer}>
        
        {/* Sección EWMA */}
        <View style={styles.calculatorContainer}>
          <Text style={styles.calculatorTitle}>Calculadora EWMA</Text>
          <Text style={styles.description}>
            El gráfico EWMA permite detectar pequeños cambios en el proceso, 
            dando más peso a las observaciones recientes.
          </Text>

          <Text style={styles.label}>Lambda (entre 0 y 1):</Text>
          <TextInput
            style={styles.input}
            value={lambda}
            onChangeText={handleLambdaChange}
            keyboardType="numeric"
            placeholder="Ejemplo: 0.2"
          />

          <Text style={styles.label}>Datos (separados por comas):</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={ewmaData}
            onChangeText={setEwmaData}
            placeholder="Ejemplo: 10,12,11,13,12"
            multiline
          />

          <TouchableOpacity 
            style={styles.button}
            onPress={handleEWMACalculation}
            disabled={isCalculatingEWMA}
          >
            {isCalculatingEWMA ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Calcular EWMA</Text>
            )}
          </TouchableOpacity>

          {renderEWMAChart()}
        </View>

        {/* Sección CUSUM */}
        <View style={styles.calculatorContainer}>
          <Text style={styles.calculatorTitle}>Calculadora CUSUM</Text>
          <Text style={styles.description}>
            El gráfico CUSUM detecta pequeños cambios persistentes acumulando
            las desviaciones respecto al valor objetivo.
          </Text>

          <Text style={styles.label}>Valor Objetivo:</Text>
          <TextInput
            style={styles.input}
            value={target}
            onChangeText={setTarget}
            keyboardType="numeric"
            placeholder="Ejemplo: 100"
          />

          <Text style={styles.label}>Valor K (sensibilidad):</Text>
          <TextInput
            style={styles.input}
            value={kValue}
            onChangeText={setKValue}
            keyboardType="numeric"
            placeholder="Ejemplo: 0.5"
          />

          <Text style={styles.label}>Datos (separados por comas):</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={cusumData}
            onChangeText={setCusumData}
            placeholder="Ejemplo: 98,102,97,101,99"
            multiline
          />

          <TouchableOpacity 
            style={styles.button}
            onPress={handleCUSUMCalculation}
            disabled={isCalculatingCUSUM}
          >
            {isCalculatingCUSUM ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Calcular CUSUM</Text>
            )}
          </TouchableOpacity>

          {renderCUSUMChart()}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  calculatorContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calculatorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  resultContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  resultLabel: {
    fontSize: 15,
    color: '#555',
  },
  resultValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  interpretationContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  interpretationTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  interpretationText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  }
});