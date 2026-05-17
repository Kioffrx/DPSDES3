
import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';

export default function FiltrosTransaccion({ onCambiarFiltro }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Filtrar por Categoría:</Text> 
      <View style={styles.row}>
        <Button title="Todos" onPress={() => onCambiarFiltro({ categoria: null })} />
        <Button title="Comida" onPress={() => onCambiarFiltro({ categoria: 'Comida' })} /> 
        <Button title="Transporte" onPress={() => onCambiarFiltro({ categoria: 'Transporte' })} /> 
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, marginBottom: 10 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-around' }
});