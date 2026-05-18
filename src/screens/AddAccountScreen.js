import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar,
} from "react-native";

import { auth } from "../config/firebase";

import { createAccount } from "../service/accountService";

export default function AddAccountScreen({ navigation }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const handleSave = async () => {
    if (!name || !type) {
      Alert.alert(
        "Campos requeridos",
        "Completa todos los campos"
      );

      return;
    }

    try {
      await createAccount(
        auth.currentUser.uid,
        {
          name,
          type,
        }
      );

      Alert.alert(
        "Éxito",
        "Cuenta creada correctamente"
      );

      navigation.goBack();

    } catch (error) {

      Alert.alert(
        "Error",
        error.message
      );
    }
  };

  return (
    <View style={styles.container}>

      <StatusBar
        barStyle="light-content"
        backgroundColor="#10b981"
      />

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.headerTitle}>
          Nueva Cuenta
        </Text>

        <Text style={styles.headerSubtitle}>
          Agrega una nueva cuenta bancaria
        </Text>

      </View>

      {/* FORMULARIO */}

      <View style={styles.formCard}>

        <Text style={styles.label}>
          Nombre de cuenta
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Ej. Cuenta Principal"
          placeholderTextColor="#94a3b8"
          style={styles.input}
        />

        <Text style={styles.label}>
          Tipo de cuenta
        </Text>

        <TextInput
          value={type}
          onChangeText={setType}
          placeholder="Ej. Ahorros o Crédito"
          placeholderTextColor="#94a3b8"
          style={styles.input}
        />

        {/* BOTÓN */}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
        >

          <Text style={styles.buttonText}>
            Guardar Cuenta
          </Text>

        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  header: {
    backgroundColor: "#10b981",

    paddingTop: 65,
    paddingBottom: 35,
    paddingHorizontal: 24,

    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginTop: 6,
  },

  formCard: {
    backgroundColor: "#fdfdfd",

    marginHorizontal: 18,
    marginTop: -15,

    padding: 20,

    borderRadius: 18,

    borderWidth: 1,
    borderColor: "#e2e8f0",

    elevation: 3,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#ffffff",

    borderWidth: 1,
    borderColor: "#cbd5e1",

    borderRadius: 10,

    paddingHorizontal: 14,
    paddingVertical: 13,

    fontSize: 15,
    color: "#334155",

    marginBottom: 18,
  },

  button: {
    backgroundColor: "#10b981",

    paddingVertical: 15,

    borderRadius: 10,

    alignItems: "center",

    marginTop: 10,

    elevation: 2,

    shadowColor: "#10b981",
    shadowOpacity: 0.2,
    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});