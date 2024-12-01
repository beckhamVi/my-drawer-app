
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const chartColors = {
  blue: 'rgb(54, 162, 235)',
  green: 'rgb(75, 192, 192)',
  purple: 'rgb(153, 102, 255)',
  orange: 'rgb(255, 159, 64)',
  red: 'rgb(255, 99, 132)',
  yellow: 'rgb(255, 205, 86)'
};

export default function DocumentacionScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={[styles.sectionContainer, { borderLeftWidth: 5, borderLeftColor: chartColors.blue }]}>
        <Text style={[styles.sectionTitle, { color: chartColors.blue }]}>1. Project Charter Detallado</Text>
        <View style={styles.cardContent}>
          <Text style={styles.subtitle}>Elementos Esenciales:</Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>• Descripción del problema</Text>
            <Text style={styles.bulletPoint}>• Objetivos medibles</Text>
            <Text style={styles.bulletPoint}>• Alcance del proyecto</Text>
            <Text style={styles.bulletPoint}>• Equipo y roles</Text>
            <Text style={styles.bulletPoint}>• Cronograma inicial</Text>
          </View>

          <Text style={[styles.subtitle, styles.topSpacing]}>Definición SMART:</Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>• Específico</Text>
            <Text style={styles.bulletPoint}>• Medible</Text>
            <Text style={styles.bulletPoint}>• Alcanzable</Text>
            <Text style={styles.bulletPoint}>• Relevante</Text>
            <Text style={styles.bulletPoint}>• Temporal</Text>
          </View>
        </View>
      </View>

      <View style={[styles.sectionContainer, { borderLeftWidth: 5, borderLeftColor: chartColors.purple }]}>
        <Text style={[styles.sectionTitle, { color: chartColors.purple }]}>2. Plan de Recolección de Datos</Text>
        <View style={styles.cardContent}>
          <Text style={styles.subtitle}>Variables de estratificación:</Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>• Tiempo</Text>
            <Text style={styles.bulletPoint}>• Lugar</Text>
            <Text style={styles.bulletPoint}>• Tipo</Text>
            <Text style={styles.bulletPoint}>• Síntoma</Text>
          </View>

          <Text style={[styles.subtitle, styles.topSpacing]}>Plan de Muestreo:</Text>
          <View style={styles.formula}>
            <Text style={styles.formulaText}>n = (Z²pq)/E²</Text>
            <Text style={styles.formulaText}>f = N/n</Text>
          </View>
        </View>
      </View>

      <View style={[styles.sectionContainer, { borderLeftWidth: 5, borderLeftColor: chartColors.green }]}>
        <Text style={[styles.sectionTitle, { color: chartColors.green }]}>3. Matriz de Validación</Text>
        <View style={styles.cardContent}>
          <Text style={styles.subtitle}>Criterios de Evaluación:</Text>
          <View style={styles.criteriaContainer}>
            <View style={styles.criteriaRow}>
              <Text style={styles.criteriaTitle}>Medible (0.3):</Text>
              <Text style={styles.criteriaDetail}>Subjetivo (1) → Objetivo (5)</Text>
            </View>
            <View style={styles.criteriaRow}>
              <Text style={styles.criteriaTitle}>Accionable (0.3):</Text>
              <Text style={styles.criteriaDetail}>Difícil (1) → Fácil (5)</Text>
            </View>
            <View style={styles.criteriaRow}>
              <Text style={styles.criteriaTitle}>Relevante (0.4):</Text>
              <Text style={styles.criteriaDetail}>Bajo (1) → Alto (5)</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.sectionContainer, { borderLeftWidth: 5, borderLeftColor: chartColors.orange }]}>
        <Text style={[styles.sectionTitle, { color: chartColors.orange }]}>4. Control Documental</Text>
        <View style={styles.cardContent}>
          <Text style={styles.subtitle}>Proceso de documentación:</Text>
          <View style={styles.processSteps}>
            {['Documento', 'Revisión', 'Aprobación', 'Distribución', 'Actualización'].map((step, index) => (
              <View key={index} style={styles.stepContainer}>
                <View style={[styles.stepNumber, { backgroundColor: chartColors.orange }]}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
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
  cardContent: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  bulletPoints: {
    paddingLeft: 10,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    lineHeight: 24,
  },
  topSpacing: {
    marginTop: 20,
  },
  formula: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  formulaText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 5,
  },
  criteriaContainer: {
    marginTop: 10,
  },
  criteriaRow: {
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
  },
  criteriaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 5,
  },
  criteriaDetail: {
    fontSize: 15,
    color: '#666',
  },
  processSteps: {
    marginTop: 15,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepText: {
    fontSize: 16,
    color: '#555',
  }
});