import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { suscribirTransaccionesMes, suscribirCuentas } from '../service/dashboardService';

const screenWidth = Dimensions.get('window').width;

const COLORES = ['#4f46e5','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#84cc16'];

export default function DashboardScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [transacciones, setTransacciones] = useState([]);
  const [cuentas, setCuentas] = useState([]);

  useEffect(() => {
    if (!user) return;
    const unsubTx = suscribirTransaccionesMes(user.uid, setTransacciones);
    const unsubCuentas = suscribirCuentas(user.uid, setCuentas);
    return () => { unsubTx(); unsubCuentas(); };
  }, [user]);

  // Calcular totales
  const totalIngresos = transacciones
    .filter(t => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + (t.monto || 0), 0);

  const totalGastos = transacciones
    .filter(t => t.tipo === 'gasto')
    .reduce((sum, t) => sum + (t.monto || 0), 0);

  const saldoNeto = totalIngresos - totalGastos;

  // Gastos por categoría
  const gastosPorCategoria = transacciones
    .filter(t => t.tipo === 'gasto')
    .reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + (t.monto || 0);
      return acc;
    }, {});

  const categorias = Object.entries(gastosPorCategoria).map(([nombre, monto], i) => ({
    name: nombre,
    monto,
    porcentaje: totalGastos > 0 ? ((monto / totalGastos) * 100).toFixed(1) : 0,
    color: COLORES[i % COLORES.length],
    legendFontColor: theme.text,
    legendFontSize: 13,
  }));

  // Saldo por cuenta
  const saldoPorCuenta = cuentas.map(cuenta => {
    const ingresos = transacciones
      .filter(t => t.cuenta === cuenta.nombre && t.tipo === 'ingreso')
      .reduce((sum, t) => sum + (t.monto || 0), 0);
    const gastos = transacciones
      .filter(t => t.cuenta === cuenta.nombre && t.tipo === 'gasto')
      .reduce((sum, t) => sum + (t.monto || 0), 0);
    return { ...cuenta, saldo: ingresos - gastos };
  });

  const fmt = (n) => `$${n.toFixed(2)}`;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.titulo, { color: theme.text }]}>Dashboard</Text>

      {/* Balance del mes */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitulo, { color: theme.text }]}>Balance del mes</Text>
        <View style={styles.balanceRow}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Ingresos</Text>
            <Text style={[styles.balanceValor, { color: '#10b981' }]}>{fmt(totalIngresos)}</Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Gastos</Text>
            <Text style={[styles.balanceValor, { color: '#ef4444' }]}>{fmt(totalGastos)}</Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Neto</Text>
            <Text style={[styles.balanceValor, { color: saldoNeto >= 0 ? '#4f46e5' : '#ef4444' }]}>
              {fmt(saldoNeto)}
            </Text>
          </View>
        </View>
      </View>

      {/* Gráfica de torta */}
      {categorias.length > 0 && (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitulo, { color: theme.text }]}>Gastos por categoría</Text>
          <PieChart
            data={categorias}
            width={screenWidth - 48}
            height={200}
            chartConfig={{ color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})` }}
            accessor="monto"
            backgroundColor="transparent"
            paddingLeft="16"
            absolute={false}
          />
          {categorias.map((cat, i) => (
            <View key={i} style={styles.categoriaRow}>
              <View style={[styles.categoriaDot, { backgroundColor: cat.color }]} />
              <Text style={[styles.categoriaNombre, { color: theme.text }]}>{cat.name}</Text>
              <Text style={[styles.categoriaPct, { color: theme.subtext }]}>{cat.porcentaje}%</Text>
              <Text style={[styles.categoriaMonto, { color: theme.text }]}>{fmt(cat.monto)}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Saldo por cuenta */}
      {saldoPorCuenta.length > 0 && (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitulo, { color: theme.text }]}>Saldo por cuenta</Text>
          {saldoPorCuenta.map((cuenta, i) => (
            <View key={i} style={styles.cuentaRow}>
              <Text style={[styles.cuentaNombre, { color: theme.text }]}>{cuenta.nombre}</Text>
              <Text style={[styles.cuentaSaldo, { color: cuenta.saldo >= 0 ? '#10b981' : '#ef4444' }]}>
                {fmt(cuenta.saldo)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {transacciones.length === 0 && (
        <Text style={[styles.vacio, { color: theme.subtext }]}>
          No hay transacciones este mes aún.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titulo: { fontSize: 26, fontWeight: 'bold', marginBottom: 16, marginTop: 48 },
  card: { borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  cardTitulo: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  balanceItem: { alignItems: 'center' },
  balanceLabel: { fontSize: 12, color: '#9ca3af', marginBottom: 4 },
  balanceValor: { fontSize: 18, fontWeight: 'bold' },
  categoriaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  categoriaDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  categoriaNombre: { flex: 1, fontSize: 14 },
  categoriaPct: { fontSize: 13, marginRight: 8 },
  categoriaMonto: { fontSize: 14, fontWeight: '600' },
  cuentaRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb' },
  cuentaNombre: { fontSize: 15 },
  cuentaSaldo: { fontSize: 15, fontWeight: '600' },
  vacio: { textAlign: 'center', marginTop: 32, fontSize: 15 },
});