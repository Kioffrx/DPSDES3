import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useTheme } from '../context/ThemeContext';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const { signInWithGoogle, request } = useGoogleAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Ingresa un email válido');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Error', 'No existe una cuenta con ese email');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Contraseña incorrecta');
      } else if (error.code === 'auth/invalid-credential') {
        Alert.alert('Error', 'Email o contraseña incorrectos');
      } else {
        Alert.alert('Error', 'Ocurrió un error, intenta de nuevo');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Finanzas App</Text>
      <Text style={[styles.subtitle, { color: theme.subtext }]}>Inicia sesión</Text>

      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.card }]}
        placeholder="Email"
        placeholderTextColor={theme.subtext}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.card }]}
        placeholder="Contraseña"
        placeholderTextColor={theme.subtext}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleLogin} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Iniciar sesión</Text>
        }
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={[styles.line, { backgroundColor: theme.border }]} />
        <Text style={[styles.dividerText, { color: theme.subtext }]}>o</Text>
        <View style={[styles.line, { backgroundColor: theme.border }]} />
      </View>

      <TouchableOpacity
        style={[styles.googleButton, { borderColor: theme.border, backgroundColor: theme.card }]}
        onPress={signInWithGoogle}
        disabled={!request}
      >
        <Text style={[styles.googleText, { color: theme.text }]}>Continuar con Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={[styles.link, { color: theme.primary }]}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 32 },
  input: { borderWidth: 1, borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 16 },
  button: { borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  line: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 12, fontSize: 14 },
  googleButton: { borderWidth: 1, borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 24 },
  googleText: { fontSize: 16, fontWeight: '500' },
  link: { textAlign: 'center', fontSize: 14 }
});