// src/components/FormularioTransaccion.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function FormularioTransaccion({ onGuardar }) {
  const [tipo, setTipo] = useState('ingreso'); // 'ingreso' o 'gasto'
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('Desayuno');
  const [cuenta, setCuenta] = useState('Efectivo'); // 'Efectivo' o 'Banco'
  const [banco, setBanco] = useState('BAC');

  const listaMovimientos = [
    'Desayuno', 'Almuerzo', 'Cena', 'HBO', 'Netflix', 
    'Gasolina', 'Luz', 'Agua', 'Internet', 
    'Transporte público', 'Transporte privado', 'Otro'
  ];

  const listaBancos = ['BAC', 'FedeCredito', 'BancoAgricola', 'BancoCuscatlan'];

  const manejarEnvio = () => {
    const montoNumerico = parseFloat(monto);
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      Alert.alert("Monto inválido", "Por favor ingresa un número positivo.");
      return;
    }

    const montoFinal = Math.round(montoNumerico * 100) / 100;
    const descripcionFinal = descripcion.trim() === '' 
      ? (tipo === 'ingreso' ? `Ingreso a ${cuenta}` : categoria) 
      : descripcion.trim();

    // Estructura de la cuenta final para guardar en Firestore
    const cuentaFinal = cuenta === 'Efectivo' ? 'Efectivo' : `Tarjeta (${banco})`;

    onGuardar({
      monto: montoFinal,
      tipo: tipo,
      categoria: tipo === 'ingreso' ? 'Ingreso' : categoria,
      cuenta: cuentaFinal,
      fecha: new Date().toISOString(),
      descripcion: descripcionFinal
    });

    setMonto('');
    setDescripcion('');
    setCuenta('Efectivo');
  };

  return (
    <View style={styles.card}>
      {/* Selector de Tipo de Operación estilo pestañas */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, tipo === 'ingreso' ? styles.tabIngreso : styles.tabInactivo]} 
          onPress={() => setTipo('ingreso')}
        >
          <Text style={styles.tabTexto}>Registrar Ingreso</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, tipo === 'gasto' ? styles.tabGasto : styles.tabInactivo]} 
          onPress={() => setTipo('gasto')}
        >
          <Text style={styles.tabTexto}>Transacción de Salida</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Monto ($)</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="numeric"
        value={monto}
        onChangeText={(text) => setMonto(text.replace(/[-]/g, ''))}
      />

      {/* Si es salida, muestra categorías de gastos */}
      {tipo === 'gasto' && (
        <>
          <Text style={styles.label}>Selecciona el Movimiento</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={categoria} onValueChange={(v) => setCategoria(v)}>
              {listaMovimientos.map((mov, i) => (
                <Picker.Item key={i} label={mov} value={mov} />
              ))}
            </Picker>
          </View>
        </>
      )}

      <Text style={styles.label}>Método de Fondo</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={cuenta} onValueChange={(v) => setCuenta(v)}>
          <Picker.Item label="Efectivo" value="Efectivo" />
          <Picker.Item label={tipo === 'ingreso' ? "Cuenta de Banco" : "Tarjeta"} value="Banco" />
        </Picker>
      </View>

      {/* Renderizado condicional de los 4 Bancos de El Salvador */}
      {cuenta === 'Banco' && (
        <>
          <Text style={styles.label}>Selecciona el Banco</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={banco} onValueChange={(v) => setBanco(v)}>
              {listaBancos.map((b, i) => (
                <Picker.Item key={i} label={b} value={b} />
              ))}
            </Picker>
          </View>
        </>
      )}

      <Text style={styles.label}>Descripción (Opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="ej. Abono de quincena o pago de servicio"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TouchableOpacity 
        style={[styles.btnAccion, { backgroundColor: tipo === 'ingreso' ? '#10b981' : '#ef4444' }]} 
        onPress={manejarEnvio}
      >
        <Text style={styles.btnTexto}>
          {tipo === 'ingreso' ? 'COMPLETAR INGRESO' : 'GUARDAR TRANSACCIÓN'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fdfdfd', padding: 15, borderRadius: 10, width: '100%', marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  tabsContainer: { flexDirection: 'row', marginBottom: 15, borderRadius: 8, overflow: 'hidden' },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabIngreso: { backgroundColor: '#10b981' },
  tabGasto: { backgroundColor: '#ef4444' },
  tabInactivo: { backgroundColor: '#cbd5e1' },
  tabTexto: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, marginBottom: 12, backgroundColor: '#fff' },
  pickerContainer: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, marginBottom: 12, backgroundColor: '#fff', overflow: 'hidden' },
  btnAccion: { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  btnTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});