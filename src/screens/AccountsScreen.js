import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";

import { auth } from "../config/firebase";
import { getAccountsWithBalance } from "../service/accountService";

export default function AccountsScreen({ navigation }) {
  const [accounts, setAccounts] = useState([]);

  const loadAccounts = async () => {
    const data = await getAccountsWithBalance(
      auth.currentUser.uid
    );

    setAccounts(data);
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const getCardTheme = (type) => {
    const t = type?.toLowerCase();

    if (t === "crédito" || t === "credito") {
      return {
        accentColor: "#ef4444",
        stripColor: "#ef4444",
        iconBg: "#fee2e2",
        badgeBg: "#fee2e2",
      };
    }

    if (t === "ahorros") {
      return {
        accentColor: "#10b981",
        stripColor: "#10b981",
        iconBg: "#d1fae5",
        badgeBg: "#d1fae5",
      };
    }

    return {
      accentColor: "#475569",
      stripColor: "#64748b",
      iconBg: "#f1f5f9",
      badgeBg: "#f1f5f9",
    };
  };

  const renderAccount = ({ item }) => {
    const theme = getCardTheme(item.type);

    return (
      <View style={styles.card}>
        {/* Franja superior */}
        <View
          style={[
            styles.cardStrip,
            { backgroundColor: theme.stripColor },
          ]}
        />

        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <View
              style={[
                styles.cardIcon,
                { backgroundColor: theme.iconBg },
              ]}
            />

            <View>
              <Text style={styles.accountName}>
                {item.name}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.badge,
              { backgroundColor: theme.badgeBg },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: theme.accentColor },
              ]}
            >
              {item.type}
            </Text>
          </View>
        </View>

        <Text style={styles.balanceLabel}>
          Saldo disponible
        </Text>

        <Text
          style={[
            styles.balance,
            { color: theme.accentColor },
          ]}
        >
          $
          {Number(item.balance).toLocaleString(
            "es-SV",
            {
              minimumFractionDigits: 2,
            }
          )}
        </Text>

        <View style={styles.cardFooter}>
          <Text
            style={[
              styles.actionText,
              { color: theme.accentColor },
            ]}
          >
            Ver movimientos →
          </Text>

          <Text style={styles.updateTime}>
            Act. hoy
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#10b981"
      />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoArea}>
            <View style={styles.logoDot} />

            <Text style={styles.logoText}>
              Mi Banco
            </Text>
          </View>
        </View>

        <Text style={styles.greeting}>
          Bienvenido de vuelta 
        </Text>

        <Text style={styles.title}>
          Mis cuentas
        </Text>

        <Text style={styles.sectionLabel}>
          RESUMEN
        </Text>
      </View>

      {/* BODY */}
      <View style={styles.body}>
        {/* BOTÓN */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("AddAccount")
          }
        >
          <Text style={styles.addButtonText}>
            + Agregar nueva cuenta
          </Text>
        </TouchableOpacity>

        {/* ENCABEZADO */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Resumen de cuentas
          </Text>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {accounts.length} cuentas
            </Text>
          </View>
        </View>

        {/* LISTA */}
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          renderItem={renderAccount}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
        />
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
    paddingTop: 52,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  logoArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  logoDot: {
    width: 32,
    height: 32,
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },

  logoText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  greeting: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
  },

  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 3,
  },

  sectionLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    letterSpacing: 1.5,
    marginTop: 16,
  },

  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  addButton: {
    backgroundColor: "#10b981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,

    elevation: 3,

    shadowColor: "#10b981",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  addButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  listTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#475569",
  },

  countBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  countText: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fdfdfd",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: "#e2e8f0",

    overflow: "hidden",

    elevation: 2,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  cardStrip: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 4,
  },

  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  cardIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
  },

  accountName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#475569",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  balanceLabel: {
    fontSize: 11,
    color: "#64748b",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  balance: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4,
    letterSpacing: -0.5,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: 14,
    paddingTop: 12,

    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },

  actionText: {
    fontSize: 11,
    fontWeight: "700",
  },

  updateTime: {
    fontSize: 10,
    color: "#94a3b8",
  },
});