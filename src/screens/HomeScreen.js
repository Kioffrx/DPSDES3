import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen() {
  const { theme, isDark, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Bienvenido</Text>
      <Text style={[styles.subtitle, { color: theme.subtext }]}>App de Finanzas</Text>

      <TouchableOpacity style={[styles.themeButton, { borderColor: theme.border }]} onPress={toggleTheme}>
        <Text style={[styles.themeButtonText, { color: theme.text }]}>
          {isDark ? 'Modo claro' : 'Modo oscuro'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.danger }]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 48 },
  themeButton: { borderWidth: 1, borderRadius: 8, padding: 12, paddingHorizontal: 24, marginBottom: 16 },
  themeButtonText: { fontSize: 15 },
  button: { borderRadius: 8, padding: 16, paddingHorizontal: 32 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
