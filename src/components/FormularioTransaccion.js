// src/components/FormularioTransaccion.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth } from '../config/firebase';
import { getAccounts } from '../service/accountService';
import { useTheme } from '../context/ThemeContext';

export default function FormularioTransaccion({ onGuardar }) {
  const { theme, isDark } = useTheme();

  const [tipo, setTipo] = useState('ingreso');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('Desayuno');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const listaMovimientos = [
    'Desayuno', 'Almuerzo', 'Cena',
    'HBO', 'Netflix',
    'Gasolina', 'Luz', 'Agua', 'Internet',
    'Transporte público', 'Transporte privado', 'Otro'
  ];

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await getAccounts(auth.currentUser.uid);
        setAccounts(data);
        if (data.length > 0) setSelectedAccount(data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    loadAccounts();
  }, []);

  const manejarEnvio = () => {
    const montoNumerico = parseFloat(monto);
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      Alert.alert('Monto inválido', 'Por favor ingresa un número positivo.');
      return;
    }
    if (!selectedAccount) {
      Alert.alert('Cuenta requerida', 'Debes seleccionar una cuenta.');
      return;
    }

    const montoFinal = Math.round(montoNumerico * 100) / 100;
    const descripcionFinal =
      descripcion.trim() === ''
        ? tipo === 'ingreso'
          ? `Ingreso a ${selectedAccount.name}`
          : categoria
        : descripcion.trim();

    onGuardar({
      monto: montoFinal,
      tipo,
      categoria: tipo === 'ingreso' ? 'Ingreso' : categoria,
      cuenta: selectedAccount.name,
      accountId: selectedAccount.id,
      fecha: new Date().toISOString(),
      descripcion: descripcionFinal,
    });

    setMonto('');
    setDescripcion('');
  };

  // Colores dinámicos según tema
  const cardBg = theme.card;
  const cardBorder = theme.border;
  const labelColor = theme.subtext;
  const inputBg = isDark ? theme.cardAlt : '#fff';
  const inputBorder = theme.border;
  const inputText = theme.text;
  const pickerColor = theme.text;

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>

      {/* Tabs ingreso / gasto */}
      <View style={[styles.tabsContainer, { backgroundColor: isDark ? theme.cardAlt : '#e2e8f0' }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            tipo === 'ingreso'
              ? { backgroundColor: '#10b981' }
              : { backgroundColor: 'transparent' }
          ]}
          onPress={() => setTipo('ingreso')}
        >
          <Text style={[
            styles.tabTexto,
            { color: tipo === 'ingreso' ? '#fff' : theme.subtext }
          ]}>
            Registrar Ingreso
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            tipo === 'gasto'
              ? { backgroundColor: '#ef4444' }
              : { backgroundColor: 'transparent' }
          ]}
          onPress={() => setTipo('gasto')}
        >
          <Text style={[
            styles.tabTexto,
            { color: tipo === 'gasto' ? '#fff' : theme.subtext }
          ]}>
            Transacción de Salida
          </Text>
        </TouchableOpacity>
      </View>

      {/* Monto */}
      <Text style={[styles.label, { color: labelColor }]}>Monto ($)</Text>
      <TextInput
        style={[styles.input, { backgroundColor: inputBg, borderColor: inputBorder, color: inputText }]}
        placeholder="0.00"
        placeholderTextColor={theme.subtext}
        keyboardType="numeric"
        value={monto}
        onChangeText={(text) => setMonto(text.replace(/[-]/g, ''))}
      />

      {/* Categoría (solo gastos) */}
      {tipo === 'gasto' && (
        <>
          <Text style={[styles.label, { color: labelColor }]}>Selecciona el Movimiento</Text>
          <View style={[styles.pickerContainer, { backgroundColor: inputBg, borderColor: inputBorder }]}>
            <Picker
              selectedValue={categoria}
              onValueChange={(v) => setCategoria(v)}
              style={{ color: pickerColor }}
              dropdownIconColor={theme.subtext}
            >
              {listaMovimientos.map((mov, i) => (
                <Picker.Item
                  key={i}
                  label={mov}
                  value={mov}
                  color={isDark ? '#e2e8f0' : '#1a1a2e'}
                />
              ))}
            </Picker>
          </View>
        </>
      )}

      {/* Selector de cuenta */}
      <Text style={[styles.label, { color: labelColor }]}>Selecciona la Cuenta</Text>
      <View style={[styles.pickerContainer, { backgroundColor: inputBg, borderColor: inputBorder }]}>
        <Picker
          selectedValue={selectedAccount?.id}
          onValueChange={(value) => {
            const account = accounts.find(acc => acc.id === value);
            setSelectedAccount(account);
          }}
          style={{ color: pickerColor }}
          dropdownIconColor={theme.subtext}
        >
          {accounts.map(account => (
            <Picker.Item
              key={account.id}
              label={`${account.name} (${account.type})`}
              value={account.id}
              color={isDark ? '#e2e8f0' : '#1a1a2e'}
            />
          ))}
        </Picker>
      </View>

      {/* Descripción */}
      <Text style={[styles.label, { color: labelColor }]}>Descripción (Opcional)</Text>
      <TextInput
        style={[styles.input, { backgroundColor: inputBg, borderColor: inputBorder, color: inputText }]}
        placeholder="ej. Abono de quincena o pago de servicio"
        placeholderTextColor={theme.subtext}
        value={descripcion}
        onChangeText={setDescripcion}
      />

      {/* Botón */}
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
  card: {
    padding: 15,
    borderRadius: 14,
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    padding: 3,
    gap: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabTexto: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  btnAccion: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  btnTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
