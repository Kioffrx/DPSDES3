import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export function suscribirTransaccionesMes(uid, callback) {
  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString().split('T')[0];
  const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0).toISOString().split('T')[0];

  const q = query(
    collection(db, 'transacciones'),
    where('uidUsuario', '==', uid),
    where('fecha', '>=', inicioMes),
    where('fecha', '<=', finMes)
  );

  return onSnapshot(q, (snapshot) => {
    const transacciones = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(transacciones);
  });
}

export function suscribirCuentas(uid, callback) {
  const q = query(
    collection(db, 'transacciones'),
    where('uidUsuario', '==', uid)
  );
  return onSnapshot(q, (snapshot) => {
    const cuentas = [...new Set(snapshot.docs.map(doc => doc.data().cuenta))];
    const cuentasObj = cuentas.map(nombre => ({ nombre }));
    callback(cuentasObj);
  });
}