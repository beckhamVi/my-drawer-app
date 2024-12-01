import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function ProcesoIdentificacionScreen() {
  return (
    <ScrollView style={styles.container}>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>1. Conceptos Fundamentales</Text>
        
        <View style={styles.subsectionContainer}>
          <Text style={styles.subsectionTitle}>¿Qué es un Problema en Six Sigma?</Text>
          <View style={styles.contentBox}>
            <Text style={styles.description}>
              Un problema en Six Sigma se identifica como una brecha entre:{'\n'}
              • Estado actual del proceso{'\n'}
              • Estado deseado del proceso{'\n\n'}
              Criterios de identificación:{'\n'}
              • Mensurable: Debe poder medirse objetivamente{'\n'}
              • Recurrente: No es un evento único{'\n'}
              • Impacto significativo: Afecta KPIs importantes{'\n'}
              • Proceso definido: Tiene entradas y salidas claras
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>2. Fuentes de Identificación</Text>
        
        <View style={styles.subsectionContainer}>
          <Text style={styles.subsectionTitle}>VOC (Voice of Customer)</Text>
          <View style={styles.contentBox}>
            <Text style={styles.description}>
              Técnicas de recolección:{'\n'}
              1. Encuestas estructuradas:{'\n'}
              • Formato estandarizado{'\n'}
              • Preguntas específicas{'\n'}
              
              2. Entrevistas detalladas:{'\n'}
              • Preguntas abiertas{'\n'}
              • Escalas Likert{'\n'}
              • Análisis de sentimiento{'\n'}
              
              3. Focus Groups:{'\n'}
              • 8-12 participantes{'\n'}
              • Duración: 60-90 minutos{'\n'}
              • Moderador especializado
            </Text>
          </View>
        </View>

        <View style={styles.subsectionContainer}>
          <Text style={styles.subsectionTitle}>CTQ (Critical to Quality)</Text>
          <View style={styles.contentBox}>
            <Text style={styles.description}>
              Proceso de cascada:{'\n'}
              1. Necesidades del cliente{'\n'}
              2. Drivers del negocio{'\n'}
              3. Requerimientos críticos{'\n'}
              4. Especificaciones medibles{'\n'}
              5. Indicadores de rendimiento
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>3. Herramientas de Identificación Inicial</Text>
        
        <View style={styles.subsectionContainer}>
          <Text style={styles.subsectionTitle}>Gemba Walk</Text>
          <View style={styles.contentBox}>
            <Text style={styles.description}>
              Elementos clave:{'\n'}
              • Observación directa del proceso{'\n'}
              • Documentación en tiempo real{'\n'}
              • Interacción con operadores{'\n\n'}
              Formato de registro:{'\n'}
              • Hora: Momento de la observación{'\n'}
              • Observación: Detalle de lo visto{'\n'}
              • Anomalía: Desviación detectada{'\n'}
              • Impacto: Efecto en el proceso
            </Text>
          </View>
        </View>

        <View style={styles.subsectionContainer}>
          <Text style={styles.subsectionTitle}>Diagrama SIPOC</Text>
          <View style={styles.contentBox}>
            <Text style={styles.description}>
              Componentes:{'\n'}
              • Suppliers: Proveedores del proceso{'\n'}
              • Inputs: Entradas necesarias{'\n'}
              • Process: Actividades principales{'\n'}
              • Outputs: Resultados del proceso{'\n'}
              • Customers: Receptores del output{'\n\n'}
              Beneficios:{'\n'}
              • Vista de alto nivel del proceso{'\n'}
              • Identificación de interfaces críticas{'\n'}
              • Base para análisis detallado
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>4. Elementos de un Problema</Text>
        
        <View style={styles.subsectionContainer}>
          <Text style={styles.subsectionTitle}>Estructura 5W2H</Text>
          <View style={styles.contentBox}>
            <Text style={styles.description}>
              • What: Descripción específica{'\n'}
              • Where: Ubicación física{'\n'}
              • When: Momento de ocurrencia{'\n'}
              • Who: Personas involucradas{'\n'}
              • Why: Razón del problema{'\n'}
              • How: Método de detección{'\n'}
              • How Much: Impacto cuantificado
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
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E5E9F5',
    lineHeight: 22,
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
  }
});