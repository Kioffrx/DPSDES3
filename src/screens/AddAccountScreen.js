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
import { useTheme } from "../context/ThemeContext";

export default function AddAccountScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const handleSave = async () => {
    if (!name || !type) {
      Alert.alert("Campos requeridos", "Completa todos los campos");
      return;
    }

    try {
      await createAccount(auth.currentUser.uid, { name, type });
      Alert.alert("Éxito", "Cuenta creada correctamente");
      // Corregido: navigate en lugar de goBack()
      navigation.navigate("AccountsList");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#10b981" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("AccountsList")}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Cuenta</Text>
        <Text style={styles.headerSubtitle}>Agrega una nueva cuenta bancaria</Text>
      </View>

      {/* Formulario */}
      <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>

        <Text style={[styles.label, { color: theme.subtext }]}>Nombre de cuenta</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Ej. Cuenta Principal"
          placeholderTextColor={theme.subtext}
          style={[styles.input, {
            backgroundColor: isDark ? theme.cardAlt : "#fff",
            borderColor: theme.border,
            color: theme.text,
          }]}
        />

        <Text style={[styles.label, { color: theme.subtext }]}>Tipo de cuenta</Text>
        <TextInput
          value={type}
          onChangeText={setType}
          placeholder="Ej. Ahorros o Crédito"
          placeholderTextColor={theme.subtext}
          style={[styles.input, {
            backgroundColor: isDark ? theme.cardAlt : "#fff",
            borderColor: theme.border,
            color: theme.text,
          }]}
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Guardar Cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: "#10b981",
    paddingTop: 55,
    paddingBottom: 35,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backBtn: { marginBottom: 12 },
  backText: { color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: "600" },
  headerTitle: { color: "#ffffff", fontSize: 28, fontWeight: "800" },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 6 },
  formCard: {
    marginHorizontal: 18,
    marginTop: -15,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    elevation: 3,
  },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    marginBottom: 18,
  },
  button: {
    backgroundColor: "#10b981",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
  },
  buttonText: { color: "#ffffff", fontSize: 15, fontWeight: "700" },
});