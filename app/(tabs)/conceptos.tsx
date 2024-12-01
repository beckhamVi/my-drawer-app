import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function AnalisisScreen() {
  return (
    <ScrollView style={styles.container}>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>1. Estadística Descriptiva Básica</Text>
        
        <View style={styles.subsectionContainer}>
          <Text style={styles.subsectionTitle}>Medidas de Tendencia Central</Text>
          <View style={styles.contentBox}>
            <Text style={styles.description}>
              • Media Aritmética: Promedio de todos los valores{'\n'}
              • Media Ponderada: Promedio considerando el peso de cada valor
            </Text>
          </View>
        </View>

        <View style={styles.subsectionContainer}>
          <Text style={styles.subsectionTitle}>Medidas de Dispersión</Text>
          <View style={styles.contentBox}>
            <Text style={styles.description}>
              • Desviación Estándar: Mide la variabilidad de los datos{'\n'}
              • Coeficiente de Variación: Relación entre desviación estándar y media
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>2. Análisis de Capacidad de Proceso</Text>
        
        <View style={styles.subsectionContainer}>
          <Text style={styles.subsectionTitle}>Índices de Capacidad</Text>
          <View style={styles.contentBox}>
            <Text style={styles.description}>
              • Cp (Capacidad Potencial): Evalúa el potencial del proceso{'\n'}
              • Cpk (Capacidad Real): Considera la centralidad del proceso
            </Text>
          </View>
          
          <View style={styles.interpretationContainer}>
            <Text style={styles.interpretationTitle}>Interpretación:</Text>
            <View style={styles.interpretationBox}>
              <Text style={styles.interpretationText}>Cp menor a 1.0: Proceso Incapaz</Text>
              <Text style={styles.interpretationText}>Cp entre 1.0 y 1.33: Proceso Marginal</Text>
              <Text style={styles.interpretationText}>Cp mayor a 1.33: Proceso Capaz</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>3. Control Estadístico del Proceso</Text>
        
        <View style={styles.subsectionContainer}>
          <Text style={styles.subsectionTitle}>Gráficos de Control</Text>
          <View style={styles.contentBox}>
            <Text style={styles.description}>
              • Límites de Control Estadístico{'\n'}
              • Reglas de Western Electric para identificar variaciones
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>4. Herramientas de Análisis</Text>
        
        <View style={styles.subsectionContainer}>
          <Text style={styles.subsectionTitle}>Análisis de Causas</Text>
          <View style={styles.contentBox}>
            <Text style={styles.description}>
              • Diagrama de Pareto: Priorización de problemas{'\n'}
              • Diagrama de Ishikawa: Análisis de causas raíz
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

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
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E5E9F5',
    lineHeight: 22,
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
  subsectionContainer: {
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 10,
  },
  contentBox: {
    backgroundColor: '#F1F5F9',
    padding: 15,
    borderRadius: 10,
  },
  description: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  interpretationContainer: {
    marginTop: 15,
  },
  interpretationTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 8,
  },
  interpretationBox: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 10,
  },
  interpretationText: {
    fontSize: 15,
    color: '#1E40AF',
    marginBottom: 6,
  }
});