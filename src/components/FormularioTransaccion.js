import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function FormularioTransaccion({ onGuardar }) {
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('Comida'); // Valor por defecto
  const [cuenta, setCuenta] = useState('Efectivo');     // Valor por defecto
  const [tipo, setTipo] = useState('gasto');             // 'gasto' o 'ingreso' 

  const manejarEnvio = () => {
    // Validaciones básicas requeridas por la rúbrica [cite: 51]
    if (!monto || isNaN(monto) || parseFloat(monto) <= 0) {
      Alert.alert("Error de validación", "Por favor ingresá un monto válido mayor a 0."); 
      return;
    }
    if (!descripcion.trim()) {
      Alert.alert("Error de validación", "La descripción no puede estar vacía.");
      return;
    }

    // Le pasamos los datos limpios al "pan" (la pantalla principal) para que los guarde
    onGuardar({
      monto: parseFloat(monto),
      tipo,
      categoria,
      cuenta,
      fecha: new Date().toISOString().split('T')[0], // Fecha de hoy YYYY-MM-DD 
      descripcion
    });

    // Limpiamos el formulario
    setMonto('');
    setDescripcion('');
  };

  return (
    <View style={styles.form}>
      <TextInput 
        placeholder="Monto ($)"
        keyboardType="numeric" // Teclado numérico obligatorio por UI/UX [cite: 51]
        value={monto}
        onChangeText={setMonto}
        style={styles.input}
      />
      <TextInput 
        placeholder="Descripción (ej. Almuerzo)" 
        value={descripcion}
        onChangeText={setDescripcion}
        style={styles.input}
      />
      {/* Nota: Aquí podés meter luego selectores/pickers para cuenta y categoría */}
      <Button title="Guardar Transacción" onPress={manejarEnvio} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { padding: 15, backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 15 },
  input: { backgroundColor: '#fff', padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: '#ddd' }
});