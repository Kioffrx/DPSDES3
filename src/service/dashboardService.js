import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export function suscribirTransaccionesMes(uid, callback) {
  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59);

  const q = query(
    collection(db, 'users', uid, 'transactions'),
    where('fecha', '>=', Timestamp.fromDate(inicioMes)),
    where('fecha', '<=', Timestamp.fromDate(finMes))
  );

  return onSnapshot(q, (snapshot) => {
    const transacciones = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(transacciones);
  });
}

export function suscribirCuentas(uid, callback) {
  const q = collection(db, 'users', uid, 'accounts');
  return onSnapshot(q, (snapshot) => {
    const cuentas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(cuentas);
  });
}