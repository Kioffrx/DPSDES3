import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function FiltrosTransaccion({ onCambiarFiltro }) {
  const [filtroSeleccionado, setFiltroSeleccionado] = useState('TODOS');

  // La lista completa para poder buscar movimientos específicos en tu Firestore
  const categorias = [
    'TODOS', 'Desayuno', 'Almuerzo', 'Cena', 'HBO', 'Netflix', 
    'Gasolina', 'Luz', 'Agua', 'Internet', 
    'Transporte público', 'Transporte privado', 'Otro'
  ];

  const seleccionarFiltro = (cat) => {
    setFiltroSeleccionado(cat);
    if (cat === 'TODOS') {
      onCambiarFiltro({}); // Filtro vacío = trae todo de Firestore
    } else {
      onCambiarFiltro({ categoria: cat }); // Le pide a Firestore solo esa categoría específica
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filtrar por categoría:</Text>
      
      {/* Scroll horizontal para que entren todas las opciones de manera elegante */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {categorias.map((cat, index) => {
          const esActivo = filtroSeleccionado === cat;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.chip, esActivo ? styles.chipActivo : styles.chipInactivo]}
              onPress={() => seleccionarFiltro(cat)}
            >
              <Text style={[styles.chipTexto, esActivo ? styles.textoActivo : styles.textoInactivo]}>
                {cat.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', marginBottom: 15 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  scroll: { flexDirection: 'row' },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 8, borderWidth: 1 },
  chipActivo: { backgroundColor: '#ef4444', borderColor: '#ef4444' }, // Rojo a juego con tu botón
  chipInactivo: { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' },
  chipTexto: { fontSize: 13, fontWeight: '600' },
  textoActivo: { color: '#fff' },
  textoInactivo: { color: '#64748b' }
});