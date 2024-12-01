import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { calculateSixSigmaMetrics, getSigmaInterpretation } from '../../utils/sixSigma';

export default function SixSigmaLevelsScreen() {
  const [defects, setDefects] = useState('');
  const [units, setUnits] = useState('');
  const [opportunities, setOpportunities] = useState('');
  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    if (!defects || !units || !opportunities) return;

    const metrics = calculateSixSigmaMetrics(
      parseFloat(defects),
      parseFloat(units),
      parseFloat(opportunities)
    );

    if (metrics) {
      setResults(metrics);
    }
  };

  const renderSigmaBar = (level: number) => {
    if (!results) return null;
    
    const currentSigma = parseFloat(results.sigmaLevel);
    const width = Math.min((currentSigma / 6) * 100, 100);
    const backgroundColor = currentSigma >= level ? '#2563EB' : '#BFDBFE';
    
    return (
      <View key={`sigma-${level}`} style={styles.levelContainer}>
        <View style={[styles.levelBar, { backgroundColor, width: `${width}%` }]}>
          <Text style={styles.levelText}>{level}σ</Text>
        </View>
        <View style={styles.metricsContainer}>
          <Text style={styles.metric}>
            {level === Math.floor(currentSigma) ? 'Nivel Actual' : ''}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calculadora Six Sigma</Text>
        <Text style={styles.headerSubtitle}>
          Calcula el nivel sigma de tu proceso
        </Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Datos del Proceso</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Número de Defectos</Text>
          <TextInput
            style={styles.input}
            value={defects}
            onChangeText={setDefects}
            keyboardType="numeric"
            placeholder="Ingrese número de defectos"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Número de Unidades</Text>
          <TextInput
            style={styles.input}
            value={units}
            onChangeText={setUnits}
            keyboardType="numeric"
            placeholder="Ingrese número de unidades"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Oportunidades por Unidad</Text>
          <TextInput
            style={styles.input}
            value={opportunities}
            onChangeText={setOpportunities}
            keyboardType="numeric"
            placeholder="Ingrese oportunidades por unidad"
          />
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
          <Text style={styles.calculateButtonText}>Calcular</Text>
        </TouchableOpacity>
      </View>

      {results && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Resultados</Text>
          
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>DPMO (Defectos por Millón):</Text>
            <Text style={styles.resultValue}>{results.dpmo}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Nivel Sigma:</Text>
            <Text style={styles.resultValue}>{results.sigmaLevel}σ</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Rendimiento del Proceso:</Text>
            <Text style={styles.resultValue}>{results.processYield}%</Text>
          </View>

          <View style={styles.graphContainer}>
            {[6, 5, 4, 3, 2].map(renderSigmaBar)}
          </View>

          <View style={styles.interpretationBox}>
            <Text style={styles.interpretationTitle}>Interpretación:</Text>
            <Text style={styles.interpretationText}>
              {getSigmaInterpretation(parseFloat(results.sigmaLevel))}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// ... estilos se mantienen igual ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#2563EB',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E5E9F5',
    textAlign: 'center',
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  calculateButton: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#F1F5F9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  graphContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  levelContainer: {
    marginBottom: 10,
  },
  levelBar: {
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  levelText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  metric: {
    fontSize: 12,
    color: '#4B5563',
    fontStyle: 'italic',
  },
  interpretationBox: {
    backgroundColor: '#F1F5F9',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  interpretationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  interpretationText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});