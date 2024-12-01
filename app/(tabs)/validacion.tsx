import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  Alert
} from 'react-native';

export default function ProblemasValidacionCalculadora() {
  // 1. Calculadora R&R (Repetibilidad y Reproducibilidad)
  const [rrCalculadora, setRRCalculadora] = useState({
    variacionEquipo: '',
    variacionOperador: '',
    resultado: null
  });

  const calcularRR = () => {
    const variacionEquipo = parseFloat(rrCalculadora.variacionEquipo);
    const variacionOperador = parseFloat(rrCalculadora.variacionOperador);

    if (isNaN(variacionEquipo) || isNaN(variacionOperador)) {
      Alert.alert('Error', 'Por favor, ingrese valores numéricos válidos');
      return;
    }

    const totalRR = Math.sqrt(
      Math.pow(variacionEquipo, 2) + 
      Math.pow(variacionOperador, 2)
    );

    let interpretacion = '';
    let estado = '';

    if (totalRR < 10) {
      interpretacion = 'Sistema de medición altamente confiable';
      estado = 'EXCELENTE';
    } else if (totalRR >= 10 && totalRR <= 30) {
      interpretacion = 'Sistema de medición requiere atención y posible mejora';
      estado = 'MARGINAL';
    } else {
      interpretacion = 'Sistema de medición no es aceptable, requiere rediseño';
      estado = 'INACEPTABLE';
    }

    setRRCalculadora(prev => ({
      ...prev,
      resultado: {
        porcentaje: totalRR.toFixed(2),
        interpretacion,
        estado
      }
    }));
  };

  // 2. Calculadora de Prueba t
  const [pruebaT, setPruebaT] = useState({
    mediaObservada: '',
    mediaEsperada: '',
    desviacionEstandar: '',
    tamañoMuestra: '',
    resultado: null
  });

  const calcularPruebaT = () => {
    const { 
      mediaObservada, 
      mediaEsperada, 
      desviacionEstandar, 
      tamañoMuestra 
    } = pruebaT;

    const mediaObs = parseFloat(mediaObservada);
    const mediaEsp = parseFloat(mediaEsperada);
    const desviacion = parseFloat(desviacionEstandar);
    const tamaño = parseFloat(tamañoMuestra);

    if (isNaN(mediaObs) || isNaN(mediaEsp) || isNaN(desviacion) || isNaN(tamaño)) {
      Alert.alert('Error', 'Por favor, ingrese valores numéricos válidos');
      return;
    }

    const valorT = (mediaObs - mediaEsp) / (desviacion / Math.sqrt(tamaño));

    let interpretacion = '';
    let significancia = '';

    if (Math.abs(valorT) > 1.96) {
      interpretacion = 'Diferencia estadísticamente significativa';
      significancia = 'Significativo (p < 0.05)';
    } else {
      interpretacion = 'No hay suficiente evidencia para rechazar la hipótesis nula';
      significancia = 'No Significativo (p >= 0.05)';
    }

    setPruebaT(prev => ({
      ...prev,
      resultado: {
        valorT: valorT.toFixed(2),
        interpretacion,
        significancia
      }
    }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Calculadora R&R */}
      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>Análisis R&R (Repetibilidad y Reproducibilidad)</Text>
        
        <Text style={styles.descripcion}>
          R&R significa: Repetibilidad (variación del equipo) y Reproducibilidad (variación del operador)
          
          Objetivo: Evaluar la precisión y consistencia del sistema de medición
          
          Interpretación:
          - &lt; 10%: Sistema EXCELENTE
          - 10-30%: Requiere ATENCIÓN
          - &gt; 30%: Sistema INACEPTABLE
        </Text>

        <View style={styles.inputContainer}>
          <Text>Variación del Equipo (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={rrCalculadora.variacionEquipo}
            onChangeText={(text) => setRRCalculadora(prev => ({...prev, variacionEquipo: text}))}
            placeholder="Ej: 2.5"
          />
          
          <Text>Variación del Operador (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={rrCalculadora.variacionOperador}
            onChangeText={(text) => setRRCalculadora(prev => ({...prev, variacionOperador: text}))}
            placeholder="Ej: 3.2"
          />
          
          <TouchableOpacity 
            style={styles.botonCalcular}
            onPress={calcularRR}
          >
            <Text style={styles.botonTexto}>Calcular R&R</Text>
          </TouchableOpacity>

          {rrCalculadora.resultado && (
            <View style={styles.resultadoContainer}>
              <Text style={styles.resultadoTitulo}>Resultado R&R</Text>
              <Text>Porcentaje Total: {rrCalculadora.resultado.porcentaje}%</Text>
              <Text>Estado: {rrCalculadora.resultado.estado}</Text>
              <Text style={styles.interpretacion}>
                {rrCalculadora.resultado.interpretacion}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Calculadora Prueba t */}
      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>Prueba t de Hipótesis</Text>
        
        <Text style={styles.descripcion}>
          Prueba t: Herramienta estadística para determinar si existe diferencia significativa
          
          Componentes:
          - Media Observada: Valor real medido
          - Media Esperada: Valor teórico o de referencia
          - Nivel de Significancia: Generalmente 0.05 (95% de confianza)

          Interpretación:
          - Valor t > 1.96: Diferencia SIGNIFICATIVA
          - Valor t ≤ 1.96: No hay evidencia suficiente
        </Text>

        <View style={styles.inputContainer}>
          <Text>Media Observada</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={pruebaT.mediaObservada}
            onChangeText={(text) => setPruebaT(prev => ({...prev, mediaObservada: text}))}
            placeholder="Ej: 100.5"
          />
          
          <Text>Media Esperada</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={pruebaT.mediaEsperada}
            onChangeText={(text) => setPruebaT(prev => ({...prev, mediaEsperada: text}))}
            placeholder="Ej: 95.0"
          />
          
          <Text>Desviación Estándar</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={pruebaT.desviacionEstandar}
            onChangeText={(text) => setPruebaT(prev => ({...prev, desviacionEstandar: text}))}
            placeholder="Ej: 5.2"
          />
          
          <Text>Tamaño de Muestra</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={pruebaT.tamañoMuestra}
            onChangeText={(text) => setPruebaT(prev => ({...prev, tamañoMuestra: text}))}
            placeholder="Ej: 30"
          />
          
          <TouchableOpacity 
            style={styles.botonCalcular}
            onPress={calcularPruebaT}
          >
            <Text style={styles.botonTexto}>Calcular Prueba t</Text>
          </TouchableOpacity>

          {pruebaT.resultado && (
            <View style={styles.resultadoContainer}>
              <Text style={styles.resultadoTitulo}>Resultado Prueba t</Text>
              <Text>Valor t: {pruebaT.resultado.valorT}</Text>
              <Text>Significancia: {pruebaT.resultado.significancia}</Text>
              <Text style={styles.interpretacion}>
                {pruebaT.resultado.interpretacion}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4'
  },
  seccion: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  descripcion: {
    color: '#666',
    marginBottom: 15,
    lineHeight: 20
  },
  inputContainer: {
    padding: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5
  },
  botonCalcular: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center'
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold'
  },
  resultadoContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5
  },
  resultadoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  interpretacion: {
    fontStyle: 'italic',
    color: '#333',
    marginTop: 5
  }
});