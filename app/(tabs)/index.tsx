// El código completo quedaría así:

import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

// Screen imports
import ConceptosScreen from './conceptos';
import ProcesoScreen from './proceso';
import AnalisisScreen from './analisis';
import ValidacionScreen from './validacion';
import DocumentacionScreen from './documentacion';
import SeguimientoScreen from './seguimiento';
import SixSigmaLevelsScreen from './sixSigmaLevels';

const Drawer = createDrawerNavigator();

export default function TabOneScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.tint,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.background,
        headerTitleStyle: {
          fontWeight: '600',
        },
        drawerStyle: {
          backgroundColor: colors.background,
          paddingTop: 20,
        },
        drawerActiveBackgroundColor: colors.background,
        drawerActiveTintColor: colors.tint,
        drawerInactiveTintColor: colors.text,
      }}
    >
      <Drawer.Screen 
        name="Conceptos" 
        component={ConceptosScreen}
        options={{
          title: 'Conceptos Fundamentales',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="library-books" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="NivelesSixSigma" 
        component={SixSigmaLevelsScreen}
        options={{
          title: 'Niveles Six Sigma',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="trending-up" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Proceso" 
        component={ProcesoScreen}
        options={{
          title: 'Proceso de Identificación',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="search" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Analisis" 
        component={AnalisisScreen}
        options={{
          title: 'Análisis Estadístico',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="analytics" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Validacion" 
        component={ValidacionScreen}
        options={{
          title: 'Validación del Problema',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="check-circle" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Documentacion" 
        component={DocumentacionScreen}
        options={{
          title: 'Documentación Estructurada',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="description" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Seguimiento" 
        component={SeguimientoScreen}
        options={{
          title: 'Seguimiento y Control',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="track-changes" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}