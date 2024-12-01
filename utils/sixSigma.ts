
export const calculateSixSigmaMetrics = (defects: number, units: number, opportunities: number) => {
    try {
      // Calcular DPMO
      const dpmo = (defects / (units * opportunities)) * 1000000;
  
      // Calcular nivel sigma usando logaritmo natural (Math.log en JS)
      // Fórmula ajustada para JavaScript
      const sigma = 0.8406 + Math.sqrt(29.37 - 2.221 * Math.log(dpmo));
  
      // Calcular rendimiento
      const processYield = (1 - (dpmo / 1000000)) * 100;
  
      return {
        dpmo: dpmo.toFixed(1),
        sigmaLevel: sigma.toFixed(2),
        processYield: processYield.toFixed(3)
      };
    } catch (error) {
      console.error('Error en cálculos Six Sigma:', error);
      return null;
    }
  };
  
  // Función para obtener la interpretación basada en el nivel sigma
  export const getSigmaInterpretation = (sigmaLevel: number): string => {
    if (sigmaLevel >= 6) return "Nivel de clase mundial. Prácticamente cero defectos.";
    if (sigmaLevel >= 5) return "Proceso de alta calidad, muy pocos defectos.";
    if (sigmaLevel >= 4) return "Proceso controlado y competitivo.";
    if (sigmaLevel >= 3) return "Nivel mínimo aceptable para la mayoría de procesos.";
    return "Proceso con alta variabilidad, requiere mejoras significativas.";
  };