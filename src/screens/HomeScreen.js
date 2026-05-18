import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { agregarTransaccion, obtenerTransacciones, eliminarTransaccion } from '../service/transactionService';
import FormularioTransaccion from '../components/FormularioTransaccion';
import FiltrosTransaccion from '../components/FiltrosTransaccion';
import { registrarParaNotificaciones, enviarAlertaPresupuesto } from '../utils/notifications';

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
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

  const cargarTransacciones = async (filtros = {}) => {
    try {
      const datos = await obtenerTransacciones(filtros);
      setTransacciones(datos);
    } catch (error) {
      Alert.alert("Error", "No se pudieron recuperar los movimientos.");
    }
  };

  useEffect(() => { cargarTransacciones(); }, []);

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
      Alert.alert("Error", "No se pudo guardar en la base de datos.");
    }
  };

  const manejarCambioFiltro = (nuevoFiltro) => {
    setFiltrosActuales(nuevoFiltro);
    cargarTransacciones(nuevoFiltro);
  };

  const confirmarBorrado = (id) => {
    Alert.alert(
      "Eliminar movimiento",
      "¿Estás seguro de que deseas borrar este registro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, eliminar", style: "destructive",
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

  const nombre = user?.displayName?.split(' ')[0] || 'Estudiante';
  const totalIngresos = transacciones.filter(t => t.tipo === 'ingreso').reduce((s, t) => s + t.monto, 0);
  const totalGastos = transacciones.filter(t => t.tipo === 'gasto').reduce((s, t) => s + t.monto, 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={transacciones}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={(
          <View style={styles.headerSection}>
            {/* Saludo */}
            <View style={styles.topBar}>
              <View>
                <Text style={[styles.greeting, { color: theme.subtext }]}>Hola 👋</Text>
                <Text style={[styles.title, { color: theme.text }]}>{nombre}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.badgeText, { color: theme.primary }]}>
                  {new Date().toLocaleString('es', { month: 'long' })}
                </Text>
              </View>
            </View>

            {/* Card balance */}
            <View style={[styles.balanceCard, { backgroundColor: theme.primary }]}>
              <Text style={styles.balanceLabel}>BALANCE DISPONIBLE</Text>
              <Text style={styles.balanceMonto}>${balance.toFixed(2)}</Text>
              <Text style={styles.balanceSub}>
                {balance >= 0 ? '¡Vas bien! 💪' : '¡Cuidado con los gastos! ⚠️'}
              </Text>
            </View>

            {/* Stats rápidas */}
            <View style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={styles.statEmoji}>📥</Text>
                <Text style={[styles.statLabel, { color: theme.subtext }]}>Ingresos</Text>
                <Text style={[styles.statValor, { color: '#10b981' }]}>${totalIngresos.toFixed(2)}</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={styles.statEmoji}>📤</Text>
                <Text style={[styles.statLabel, { color: theme.subtext }]}>Gastos</Text>
                <Text style={[styles.statValor, { color: '#ef4444' }]}>${totalGastos.toFixed(2)}</Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>➕ Nuevo movimiento</Text>
            <FormularioTransaccion onGuardar={manejarAgregarTransaccion} />

            <Text style={[styles.sectionTitle, { color: theme.text }]}>🔍 Filtrar</Text>
            <FiltrosTransaccion onCambiarFiltro={manejarCambioFiltro} />

            <Text style={[styles.sectionTitle, { color: theme.text }]}>📋 Historial</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={[styles.itemCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.itemDot, { backgroundColor: item.tipo === 'gasto' ? '#ef4444' : '#10b981' }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemDesc, { color: theme.text }]}>{item.descripcion}</Text>
              <Text style={[styles.itemSub, { color: theme.subtext }]}>
                {item.cuenta} {item.tipo === 'gasto' && `• ${item.categoria}`}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.itemMonto, { color: item.tipo === 'gasto' ? '#ef4444' : '#10b981' }]}>
                {item.tipo === 'gasto' ? '-' : '+'}${item.monto.toFixed(2)}
              </Text>
              <TouchableOpacity
                style={[styles.deleteBtn, { backgroundColor: isDark ? '#2d1a1a' : '#fee2e2' }]}
                onPress={() => confirmarBorrado(item.id)}
              >
                <Text style={{ color: '#ef4444', fontSize: 12, fontWeight: '600' }}>Borrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>💸</Text>
            <Text style={[styles.emptyText, { color: theme.subtext }]}>No hay movimientos aún</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 16, paddingBottom: 32 },
  headerSection: { width: '100%' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 48, marginBottom: 20 },
  greeting: { fontSize: 14, fontWeight: '500' },
  title: { fontSize: 26, fontWeight: 'bold' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
  balanceCard: { borderRadius: 20, padding: 24, marginBottom: 16, elevation: 4 },
  balanceLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  balanceMonto: { color: '#fff', fontSize: 42, fontWeight: 'bold', marginVertical: 4 },
  balanceSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, borderRadius: 14, padding: 14, borderWidth: 1, alignItems: 'center' },
  statEmoji: { fontSize: 22, marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  statValor: { fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 10, marginTop: 8 },
  itemCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, marginBottom: 8, borderWidth: 1, gap: 10 },
  itemDot: { width: 10, height: 10, borderRadius: 5 },
  itemDesc: { fontSize: 15, fontWeight: '600' },
  itemSub: { fontSize: 12, marginTop: 2 },
  itemMonto: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  deleteBtn: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  emptyContainer: { alignItems: 'center', marginTop: 48 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16 },
});