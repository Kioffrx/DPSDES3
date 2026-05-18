import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { agregarTransaccion, obtenerTransacciones, eliminarTransaccion } from '../service/transactionService';
import FormularioTransaccion from '../components/FormularioTransaccion';
import FiltrosTransaccion from '../components/FiltrosTransaccion';
import { registrarParaNotificaciones, enviarAlertaPresupuesto } from '../utils/notifications';

export default function HomeScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const [transacciones, setTransacciones] = useState([]);
  const [filtrosActuales, setFiltrosActuales] = useState({});
  const [balance, setBalance] = useState(0.00);

  useEffect(() => { registrarParaNotificaciones(); }, []);

  useEffect(() => {
    let total = 0;
    transacciones.forEach(t => {
      if (t.tipo === 'ingreso') total += t.monto;
      else total -= t.monto;
    });
    setBalance(total);
    if (transacciones.length > 0) {
      if (total < 0.00) enviarAlertaPresupuesto('DEFICIT');
      else if (total < 150.00) enviarAlertaPresupuesto('BAJO');
    }
  }, [transacciones]);

  const handleLogout = async () => {
    try { await signOut(auth); } catch (e) { console.log(e); }
  };

  const cargarTransacciones = async (filtros = {}) => {
    try {
      const datos = await obtenerTransacciones(filtros);
      setTransacciones(datos);
    } catch (error) {
      Alert.alert("Error de Firestore", "No se pudieron recuperar los movimientos.");
    }
  };

  useEffect(() => { cargarTransacciones(); }, []);

  /*const manejarAgregarTransaccion = async (nueva) => {
    try {
      await agregarTransaccion(nueva.monto, nueva.tipo, nueva.categoria, nueva.cuenta, nueva.fecha, nueva.descripcion);
      cargarTransacciones(filtrosActuales);
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar en la base de datos.");
    }
  };*/

  const manejarAgregarTransaccion = async (nueva) => {

  try {

    await agregarTransaccion(

      nueva.monto,

      nueva.tipo,

      nueva.categoria,

      nueva.cuenta,

      nueva.accountId,

      nueva.fecha,

      nueva.descripcion
    );

    cargarTransacciones(filtrosActuales);

  } catch (error) {

    Alert.alert(
      "Error",
      "No se pudo guardar en la base de datos."
    );
  }
};

  const manejarCambioFiltro = (nuevoFiltro) => {
    setFiltrosActuales(nuevoFiltro);
    cargarTransacciones(nuevoFiltro);
  };

  const confirmarBorrado = (id) => {
    Alert.alert(
      "Eliminar movimiento",
      "¿Estás seguro de que deseas borrar permanentemente este registro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await eliminarTransaccion(id);
              cargarTransacciones(filtrosActuales);
            } catch (e) {
              Alert.alert("Error", "No se pudo eliminar.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={transacciones}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={(
          <View style={styles.headerSection}>
            <Text style={[styles.title, { color: theme.text }]}>Mi Billetera</Text>

            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>DINERO DISPONIBLE</Text>
              <Text style={styles.balanceMonto}>${balance.toFixed(2)}</Text>
            </View>

            {/* Botón Dashboard */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#4f46e5', marginBottom: 10 }]}
              onPress={() => navigation.navigate('Dashboard')}
            >
              <Text style={styles.buttonText}>Ver Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.themeButton, { borderColor: '#2563eb' }]} onPress={toggleTheme}>
              <Text style={[styles.themeButtonText, { color: '#2563eb' }]}>
                {isDark ? 'Modo claro' : 'Modo oscuro'}
              </Text>
            </TouchableOpacity>

            {/* Botón Cuentas */}
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: '#003B70',
                  marginBottom: 10
                }
              ]}
              onPress={() => navigation.navigate('Accounts')}
            >
              <Text style={styles.buttonText}>
                Ver Mis Cuentas
              </Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>Gestionar Movimiento</Text>
            <FormularioTransaccion onGuardar={manejarAgregarTransaccion} />

            <Text style={[styles.sectionTitle, { color: theme.text }]}>Filtrar Movimientos</Text>
            <FiltrosTransaccion onCambiarFiltro={manejarCambioFiltro} />

            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 10 }]}>Historial de Operaciones</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={[styles.itemCard, { backgroundColor: isDark ? '#1e1b4b' : '#f8fafc', borderColor: theme.border }]}>
            <View>
              <Text style={[styles.itemDesc, { color: theme.text }]}>{item.descripcion}</Text>
              <Text style={[styles.itemSub, { color: theme.subtext }]}>{item.cuenta} {item.tipo === 'gasto' && `• ${item.categoria}`}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.itemMonto, { color: item.tipo === 'gasto' ? '#ef4444' : '#10b981' }]}>
                {item.tipo === 'gasto' ? '-' : '+'}${item.monto.toFixed(2)}
              </Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => confirmarBorrado(item.id)}>
                <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 13 }}>Borrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={(
          <View style={styles.footerSection}>
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.danger }]} onPress={handleLogout}>
              <Text style={styles.buttonText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20 },
  headerSection: { alignItems: 'center', width: '100%' },
  footerSection: { alignItems: 'center', marginTop: 32, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15 },
  balanceCard: { backgroundColor: '#2563eb', width: '100%', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 15, elevation: 3 },
  balanceLabel: { color: '#bfdbfe', fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  balanceMonto: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 10, marginTop: 15 },
  themeButton: { borderWidth: 1, borderRadius: 8, padding: 10, paddingHorizontal: 20, marginBottom: 16 },
  themeButtonText: { fontSize: 14, fontWeight: '600' },
  button: { borderRadius: 8, padding: 16, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  itemCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 1 },
  itemDesc: { fontSize: 16, fontWeight: '600' },
  itemSub: { fontSize: 13, marginTop: 2 },
  itemMonto: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  deleteButton: { backgroundColor: '#fee2e2', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, marginTop: 4 }
});