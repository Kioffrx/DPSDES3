// src/utils/notifications.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuración básica del comportamiento de la notificación
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Función para solicitar permisos al iniciar la app
export async function registrarParaNotificaciones() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.getPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}

// Función para lanzar las alertas de presupuesto
export async function enviarAlertaPresupuesto(tipo) {
  if (tipo === 'BAJO') {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚠️ Alerta de fondo",
        body: "Tu dinero disponible es menor a $150.00. ¡Cuida tus gastos!",
      },
      trigger: null, // Envío inmediato
    });
  } else if (tipo === 'DEFICIT') {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🚨 Sin fondo",
        body: "Tu presupuesto está por debajo de $0.00. Presentas un déficit financiero.",
      },
      trigger: null,
    });
  }
}