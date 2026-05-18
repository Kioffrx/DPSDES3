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


export default function FormularioTransaccion({ onGuardar }) {

  // 'ingreso' o 'gasto'
  const [tipo, setTipo] = useState('ingreso');

  const [monto, setMonto] = useState('');

  const [descripcion, setDescripcion] = useState('');

  const [categoria, setCategoria] = useState('Desayuno');

  // NUEVOS ESTADOS PARA CUENTAS REALES DESDE FIREBASE
  const [accounts, setAccounts] = useState([]);

  const [selectedAccount, setSelectedAccount] = useState(null);


  const listaMovimientos = [
    'Desayuno',
    'Almuerzo',
    'Cena',
    'HBO',
    'Netflix',
    'Gasolina',
    'Luz',
    'Agua',
    'Internet',
    'Transporte público',
    'Transporte privado',
    'Otro'
  ];


  // CARGAR CUENTAS DESDE FIREBASE
  useEffect(() => {

    const loadAccounts = async () => {

      try {

        const data = await getAccounts(
          auth.currentUser.uid
        );

        setAccounts(data);

        // Seleccionar primera cuenta automáticamente
        if (data.length > 0) {

          setSelectedAccount(data[0]);

        }

      } catch (error) {

        console.log(error);

      }
    };

    loadAccounts();

  }, []);


  const manejarEnvio = () => {

    const montoNumerico = parseFloat(monto);

    if (isNaN(montoNumerico) || montoNumerico <= 0) {

      Alert.alert(
        "Monto inválido",
        "Por favor ingresa un número positivo."
      );

      return;
    }

    // Validación para asegurar cuenta seleccionada
    if (!selectedAccount) {

      Alert.alert(
        "Cuenta requerida",
        "Debes seleccionar una cuenta."
      );

      return;
    }

    const montoFinal =
      Math.round(montoNumerico * 100) / 100;

    const descripcionFinal =
      descripcion.trim() === ''
        ? (
            tipo === 'ingreso'
              ? `Ingreso a ${selectedAccount.name}`
              : categoria
          )
        : descripcion.trim();

    // Estructura final para guardar en Firestore
    onGuardar({

      monto: montoFinal,

      tipo: tipo,

      categoria:
        tipo === 'ingreso'
          ? 'Ingreso'
          : categoria,

      // Nombre visible de la cuenta
      cuenta: selectedAccount.name,

      // ID real de Firebase para calcular saldos correctamente
      accountId: selectedAccount.id,

      fecha: new Date().toISOString(),

      descripcion: descripcionFinal

    });


    // LIMPIAR CAMPOS
    setMonto('');

    setDescripcion('');
  };


  return (

    <View style={styles.card}>

      {/* Selector de Tipo de Operación estilo pestañas */}

      <View style={styles.tabsContainer}>

        <TouchableOpacity
          style={[
            styles.tab,
            tipo === 'ingreso'
              ? styles.tabIngreso
              : styles.tabInactivo
          ]}
          onPress={() => setTipo('ingreso')}
        >

          <Text style={styles.tabTexto}>
            Registrar Ingreso
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            tipo === 'gasto'
              ? styles.tabGasto
              : styles.tabInactivo
          ]}
          onPress={() => setTipo('gasto')}
        >

          <Text style={styles.tabTexto}>
            Transacción de Salida
          </Text>

        </TouchableOpacity>

      </View>


      {/* MONTO */}

      <Text style={styles.label}>
        Monto ($)
      </Text>

      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="numeric"
        value={monto}
        onChangeText={(text) =>
          setMonto(text.replace(/[-]/g, ''))
        }
      />


      {/* Si es salida, muestra categorías de gastos */}

      {tipo === 'gasto' && (

        <>

          <Text style={styles.label}>
            Selecciona el Movimiento
          </Text>

          <View style={styles.pickerContainer}>

            <Picker
              selectedValue={categoria}
              onValueChange={(v) => setCategoria(v)}
            >

              {listaMovimientos.map((mov, i) => (

                <Picker.Item
                  key={i}
                  label={mov}
                  value={mov}
                />

              ))}

            </Picker>

          </View>

        </>

      )}


      {/* Selector de cuentas reales obtenidas desde Firebase */}

      <Text style={styles.label}>
        Selecciona la Cuenta
      </Text>

      <View style={styles.pickerContainer}>

        <Picker
          selectedValue={selectedAccount?.id}
          onValueChange={(value) => {

            const account = accounts.find(
              acc => acc.id === value
            );

            setSelectedAccount(account);
          }}
        >

          {accounts.map(account => (

            <Picker.Item
              key={account.id}
              label={`${account.name} (${account.type})`}
              value={account.id}
            />

          ))}

        </Picker>

      </View>


      {/* DESCRIPCIÓN OPCIONAL */}

      <Text style={styles.label}>
        Descripción (Opcional)
      </Text>

      <TextInput
        style={styles.input}
        placeholder="ej. Abono de quincena o pago de servicio"
        value={descripcion}
        onChangeText={setDescripcion}
      />


      {/* BOTÓN PRINCIPAL */}

      <TouchableOpacity
        style={[
          styles.btnAccion,
          {
            backgroundColor:
              tipo === 'ingreso'
                ? '#10b981'
                : '#ef4444'
          }
        ]}
        onPress={manejarEnvio}
      >

        <Text style={styles.btnTexto}>

          {tipo === 'ingreso'
            ? 'COMPLETAR INGRESO'
            : 'GUARDAR TRANSACCIÓN'}

        </Text>

      </TouchableOpacity>

    </View>
  );
}


const styles = StyleSheet.create({

  card: {
    backgroundColor: '#fdfdfd',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },

  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden'
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center'
  },

  tabIngreso: {
    backgroundColor: '#10b981'
  },

  tabGasto: {
    backgroundColor: '#ef4444'
  },

  tabInactivo: {
    backgroundColor: '#cbd5e1'
  },

  tabTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 5
  },

  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff'
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    overflow: 'hidden'
  },

  btnAccion: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5
  },

  btnTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15
  }

});