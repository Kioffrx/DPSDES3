/*import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

import { db } from "../config/firebase";

export const createAccount = async (
  uid,
  account
) => {

  const accountsRef = collection(
    db,
    "users",
    uid,
    "accounts"
  );

  await addDoc(accountsRef, {
    name: account.name,
    type: account.type,
    balance: 0,
    createdAt: serverTimestamp()
  });
};

export const getAccounts = async (uid) => {

    import {
    query,
    where
} from "firebase/firestore";

import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  where
} from "firebase/firestore";


export const getAccountsWithBalance = async (uid) => {

  const accountsRef = collection(
    db,
    "users",
    uid,
    "accounts"
  );

  const accountsSnapshot = await getDocs(accountsRef);

  const accounts = [];

  for (const accountDoc of accountsSnapshot.docs) {

    const accountData = {
      id: accountDoc.id,
      ...accountDoc.data()
    };

    // Buscar transacciones de esta cuenta
    const transactionsRef = collection(db, "transacciones");

    const q = query(
      transactionsRef,
      where("uidUsuario", "==", uid),
      where("accountId", "==", accountDoc.id)
    );

    const transactionsSnapshot = await getDocs(q);

    let balance = 0;

    transactionsSnapshot.forEach(doc => {

      const transaction = doc.data();

      if (transaction.tipo === "ingreso") {
        balance += transaction.monto;
      } else {
        balance -= transaction.monto;
      }
    });

    accounts.push({
      ...accountData,
      balance
    });
  }

  return accounts;
};

  const accountsRef = collection(
    db,
    "users",
    uid,
    "accounts"
  );

  const snapshot = await getDocs(accountsRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};*/

/*
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  where
} from "firebase/firestore";

import { db } from "../config/firebase";


// CREAR CUENTA
export const createAccount = async (uid, account) => {

  const accountsRef = collection(
    db,
    "users",
    uid,
    "accounts"
  );

  await addDoc(accountsRef, {
    name: account.name,
    type: account.type,
    createdAt: serverTimestamp()
  });
};


// OBTENER CUENTAS SIMPLES
export const getAccounts = async (uid) => {

  const accountsRef = collection(
    db,
    "users",
    uid,
    "accounts"
  );

  const snapshot = await getDocs(accountsRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};


// OBTENER CUENTAS CON SALDO DINÁMICO
export const getAccountsWithBalance = async (uid) => {

  const accountsRef = collection(
    db,
    "users",
    uid,
    "accounts"
  );

  const accountsSnapshot = await getDocs(accountsRef);

  const accounts = [];

  for (const accountDoc of accountsSnapshot.docs) {

    const accountData = {
      id: accountDoc.id,
      ...accountDoc.data()
    };

    // Buscar transacciones de esta cuenta
    const transactionsRef = collection(db, "transacciones");

    const q = query(
      transactionsRef,
      where("uidUsuario", "==", uid),
      where("accountId", "==", accountDoc.id)
    );

    const transactionsSnapshot = await getDocs(q);

    let balance = 0;

    transactionsSnapshot.forEach(doc => {

      const transaction = doc.data();

      if (transaction.tipo === "ingreso") {
        balance += transaction.monto;
      } else {
        balance -= transaction.monto;
      }

    });

    accounts.push({
      ...accountData,
      balance
    });
  }

  return accounts;
};*/


import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  where
} from "firebase/firestore";

import { db } from "../config/firebase";


// CREAR CUENTA
export const createAccount = async (
  uid,
  account
) => {

  const accountsRef = collection(
    db,
    "users",
    uid,
    "accounts"
  );

  await addDoc(accountsRef, {

    name: account.name,

    type: account.type,

    balance: 0,

    createdAt: serverTimestamp()

  });
};


// OBTENER CUENTAS
export const getAccounts = async (uid) => {

  const accountsRef = collection(
    db,
    "users",
    uid,
    "accounts"
  );

  const snapshot = await getDocs(accountsRef);

  return snapshot.docs.map(doc => ({

    id: doc.id,

    ...doc.data()

  }));
};


// OBTENER CUENTAS CON SALDO DINÁMICO
export const getAccountsWithBalance = async (uid) => {

  const accountsRef = collection(
    db,
    "users",
    uid,
    "accounts"
  );

  const accountsSnapshot =
    await getDocs(accountsRef);

  const accounts = [];

  for (const accountDoc of accountsSnapshot.docs) {

    const accountData = {

      id: accountDoc.id,

      ...accountDoc.data()

    };

    // BUSCAR TRANSACCIONES
    const transactionsRef =
      collection(db, "transacciones");

    const q = query(

      transactionsRef,

      where(
        "uidUsuario",
        "==",
        uid
      ),

      where(
        "accountId",
        "==",
        accountDoc.id
      )
    );

    const transactionsSnapshot =
      await getDocs(q);

    let balance = 0;

    transactionsSnapshot.forEach(doc => {

      const transaction = doc.data();

      if (transaction.tipo === "ingreso") {

        balance += transaction.monto;

      } else {

        balance -= transaction.monto;

      }

    });

    accounts.push({

      ...accountData,

      balance

    });
  }

  return accounts;
};
