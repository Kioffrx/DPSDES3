import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  const handleLogout = async () => {
    try { await signOut(auth); } catch (e) { console.log(e); }
  };

  const inicial = user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?';

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <View style={styles.avatarContainer}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: theme.secondary }]}>
              <Text style={styles.avatarText}>{inicial}</Text>
            </View>
          )}
        </View>
        <Text style={styles.headerName}>{user?.displayName || 'Usuario'}</Text>
        <Text style={styles.headerEmail}>{user?.email}</Text>
      </View>

      {/* Apariencia */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>APARIENCIA</Text>
        <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowEmoji}>{isDark ? '🌙' : '☀️'}</Text>
            <View>
              <Text style={[styles.rowLabel, { color: theme.text }]}>Modo oscuro</Text>
              <Text style={[styles.rowDesc, { color: theme.subtext }]}>{isDark ? 'Tema oscuro activo' : 'Tema claro activo'}</Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Info cuenta */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>MI CUENTA</Text>

        <View style={[styles.infoRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={styles.rowEmoji}>👤</Text>
          <View>
            <Text style={[styles.rowDesc, { color: theme.subtext }]}>Nombre</Text>
            <Text style={[styles.rowLabel, { color: theme.text }]}>{user?.displayName || 'No definido'}</Text>
          </View>
        </View>

        <View style={[styles.infoRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={styles.rowEmoji}>✉️</Text>
          <View>
            <Text style={[styles.rowDesc, { color: theme.subtext }]}>Correo</Text>
            <Text style={[styles.rowLabel, { color: theme.text }]}>{user?.email}</Text>
          </View>
        </View>

        <View style={[styles.infoRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={styles.rowEmoji}>🔐</Text>
          <View>
            <Text style={[styles.rowDesc, { color: theme.subtext }]}>Proveedor</Text>
            <Text style={[styles.rowLabel, { color: theme.text }]}>
              {user?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'Correo y contraseña'}
            </Text>
          </View>
        </View>
      </View>

      {/* Cerrar sesión */}
      <View style={styles.section}>
        <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: theme.danger }]} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 32 },
  avatarContainer: { marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#fff' },
  avatarFallback: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  headerName: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  headerEmail: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowEmoji: { fontSize: 22, marginRight: 12 },
  rowLabel: { fontSize: 15, fontWeight: '600' },
  rowDesc: { fontSize: 12, marginTop: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  logoutBtn: { borderRadius: 14, padding: 16, alignItems: 'center' },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});