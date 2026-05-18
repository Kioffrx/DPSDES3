import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar,
} from "react-native";
import { auth } from "../config/firebase";
import { getAccountsWithBalance } from "../service/accountService";
import { useTheme } from "../context/ThemeContext";

export default function AccountsScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const [accounts, setAccounts] = useState([]);

  const loadAccounts = async () => {
    const data = await getAccountsWithBalance(auth.currentUser.uid);
    setAccounts(data);
  };

  useEffect(() => { loadAccounts(); }, []);

  const getCardTheme = (type) => {
    const t = type?.toLowerCase();
    if (t === "crédito" || t === "credito") {
      return { accentColor: "#ef4444", stripColor: "#ef4444", iconBg: isDark ? "#2d1a1a" : "#fee2e2", badgeBg: isDark ? "#2d1a1a" : "#fee2e2" };
    }
    if (t === "ahorros") {
      return { accentColor: "#10b981", stripColor: "#10b981", iconBg: isDark ? "#0d2b1f" : "#d1fae5", badgeBg: isDark ? "#0d2b1f" : "#d1fae5" };
    }
    return { accentColor: theme.primary, stripColor: theme.primary, iconBg: theme.cardAlt, badgeBg: theme.cardAlt };
  };

  const renderAccount = ({ item }) => {
    const cardTheme = getCardTheme(item.type);
    return (
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={[styles.cardStrip, { backgroundColor: cardTheme.stripColor }]} />
        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <View style={[styles.cardIcon, { backgroundColor: cardTheme.iconBg }]} />
            <Text style={[styles.accountName, { color: theme.text }]}>{item.name}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: cardTheme.badgeBg }]}>
            <Text style={[styles.badgeText, { color: cardTheme.accentColor }]}>{item.type}</Text>
          </View>
        </View>

        <Text style={[styles.balanceLabel, { color: theme.subtext }]}>SALDO DISPONIBLE</Text>
        <Text style={[styles.balance, { color: cardTheme.accentColor }]}>
          ${Number(item.balance).toLocaleString("es-SV", { minimumFractionDigits: 2 })}
        </Text>

        <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
          <Text style={[styles.actionText, { color: cardTheme.accentColor }]}>Ver movimientos →</Text>
          <Text style={[styles.updateTime, { color: theme.subtext }]}>Act. hoy</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#10b981" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoArea}>
            <View style={styles.logoDot} />
            <Text style={styles.logoText}>Mi Banco</Text>
          </View>
        </View>
        <Text style={styles.greeting}>Bienvenido de vuelta</Text>
        <Text style={styles.title}>Mis cuentas</Text>
        <Text style={styles.sectionLabel}>RESUMEN</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddAccount")}
        >
          <Text style={styles.addButtonText}>+ Agregar nueva cuenta</Text>
        </TouchableOpacity>

        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: theme.text }]}>Resumen de cuentas</Text>
          <View style={[styles.countBadge, { backgroundColor: theme.cardAlt }]}>
            <Text style={[styles.countText, { color: theme.subtext }]}>{accounts.length} cuentas</Text>
          </View>
        </View>

        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          renderItem={renderAccount}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🏦</Text>
              <Text style={[styles.emptyText, { color: theme.subtext }]}>No tienes cuentas aún</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { backgroundColor: "#10b981", paddingTop: 52, paddingBottom: 30, paddingHorizontal: 20 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  logoArea: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoDot: { width: 32, height: 32, backgroundColor: "#ffffff", borderRadius: 8 },
  logoText: { color: "#ffffff", fontSize: 14, fontWeight: "700", letterSpacing: 0.3 },
  greeting: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
  title: { color: "#ffffff", fontSize: 22, fontWeight: "800", marginTop: 3 },
  sectionLabel: { color: "rgba(255,255,255,0.7)", fontSize: 10, letterSpacing: 1.5, marginTop: 16 },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  addButton: { backgroundColor: "#10b981", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 12, marginBottom: 20, elevation: 3 },
  addButtonText: { color: "#ffffff", fontSize: 14, fontWeight: "700" },
  listHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  listTitle: { fontSize: 15, fontWeight: "700" },
  countBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  countText: { fontSize: 11, fontWeight: "600" },
  card: { borderRadius: 16, padding: 18, marginBottom: 14, borderWidth: 1, overflow: "hidden", elevation: 2 },
  cardStrip: { position: "absolute", top: 0, left: 0, right: 0, height: 4 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16, marginTop: 4 },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  cardIcon: { width: 38, height: 38, borderRadius: 10 },
  accountName: { fontSize: 15, fontWeight: "700" },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.3 },
  balanceLabel: { fontSize: 11, letterSpacing: 0.5 },
  balance: { fontSize: 28, fontWeight: "800", marginTop: 4, letterSpacing: -0.5 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 12, borderTopWidth: 1 },
  actionText: { fontSize: 11, fontWeight: "700" },
  updateTime: { fontSize: 10 },
  emptyContainer: { alignItems: "center", marginTop: 48 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16 },
});