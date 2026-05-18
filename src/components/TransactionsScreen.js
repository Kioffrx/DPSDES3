import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, Button } from 'react-native';
import { agregarTransaccion, obtenerTransacciones, eliminarTransaccion } from '../service/transactionService';

// Importamos nuestros "ingredientes" independientes
import FormularioTransaccion from '../components/FormularioTransaccion';
import FiltrosTransaccion from '../components/FiltrosTransaccion';

export default function TransactionsScreen() {
  const [transacciones, setTransacciones] = useState([]);
  const [filtrosActuales, setFiltrosActuales] = useState({});

  // Función para traer los datos de Firestore
  const cargarTransacciones = async (filtros = {}) => {
    try {
      const datos = await obtenerTransacciones(filtros);
      setTransacciones(datos);
    } catch (error) {
      Alert.alert("Error", "No se pudieron obtener las transacciones desde la base de datos."); 
    }
  };

  // Se ejecuta la primera vez que se abre la pantalla
  useEffect(() => {
    cargarTransacciones();
  }, []);

  // Acción cuando el formulario independiente ("la carne") nos manda los datos validados
  const manejarAgregarTransaccion = async (nuevaTransaccion) => {
    try {
      await agregarTransaccion(
        nuevaTransaccion.monto,
        nuevaTransaccion.tipo,
        nuevaTransaccion.categoria,
        nuevaTransaccion.cuenta,
        nuevaTransaccion.fecha,
        nuevaTransaccion.descripcion
      );
      Alert.alert("Éxito", "Transacción registrada en Firestore."); 
      cargarTransacciones(filtrosActuales); // Recargamos la lista con el filtro activo
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la transacción."); 
    }
  };

  // Acción cuando el componente de filtros ("el queso") cambia
  const manejarCambioFiltro = (nuevoFiltro) => {
    setFiltrosActuales(nuevoFiltro);
    cargarTransacciones(nuevoFiltro); // Le pedimos a Firestore solo los datos filtrados 
  };

  // Alerta nativa de confirmación para eliminar (Requisito estricto de la Persona 1) [cite: 19]
  const confirmarBorrado = (id) => {
    Alert.alert(
      "Confirmar",
      "¿De verdad querés eliminar esta transacción?",
      [
        { text: "Cancelar", style: "cancel" },
            {
          text: "Sí, eliminar", 
          style: "destructive", 
          onPress: async () => {
            try {
              await eliminarTransaccion(id);
              cargarTransacciones(filtrosActuales); // Refrescamos
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar."); 
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gestión de Finanzas</Text> [cite: 6]
      
      {/* 1. Insertamos el Formulario independiente */}
      <FormularioTransaccion onGuardar={manejarAgregarTransaccion} />
      
      {/* 2. Insertamos los Filtros independientes */}
      <FiltrosTransaccion onCambiarFiltro={manejarCambioFiltro} />

      {/* 3. Renderizamos la lista principal */}
      <FlatList
        data={transacciones}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <Text style={{ fontWeight: 'bold' }}>{item.descripcion} - ${item.monto}</Text> 
            <Text style={{ color: 'gray' }}>{item.categoria} | {item.cuenta} | {item.fecha}</Text> 
            <Button title="Eliminar" color="red" onPress={() => confirmarBorrado(item.id)} /> [cite: 19]
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  tarjeta: { padding: 12, backgroundColor: '#f1f1f1', borderRadius: 6, marginBottom: 10 }
});