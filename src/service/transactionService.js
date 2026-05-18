import { db, auth } from '../config/firebase';

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';


// 1. GUARDADO / AQUI SE REGISTRAN LAS TRANSACCIONES EN LA COLECCIÓN 'transacciones' CON EL UID DEL USUARIO LOGUEADO [doc: 51]
export const agregarTransaccion = async (
  monto,
  tipo,
  categoria,
  cuenta,
  accountId,
  fecha,
  descripcion
) => {

  try {

    const usuarioLogueado = auth.currentUser;

    if (!usuarioLogueado) {
      throw new Error("No hay sesión activa");
    }

    // GUARDAR EN FIRESTORE
    const docRef = await addDoc(
      collection(db, 'transacciones'),
      {

        uidUsuario: usuarioLogueado.uid,

        monto: parseFloat(monto),

        tipo, // ingreso o gasto

        categoria,

        // NOMBRE VISIBLE DE LA CUENTA
        cuenta,

        // ID REAL DE FIREBASE
        accountId,

        fecha,

        descripcion,

        fechaRegistro: new Date()
      }
    );

    return docRef.id;

  } catch (error) {

    console.error(
      "Error al registrar transaccion:",
      error
    );

    throw error;
  }
};


// 2. OBTENER TRANSACCIONES (Con los filtros por categoría, cuenta y período)
export const obtenerTransacciones = async (
  filtros = {}
) => {

  try {

    const usuarioLogueado = auth.currentUser;

    if (!usuarioLogueado) {
      throw new Error("No hay sesión activa");
    }

     // Consulta base: Solo traer datos del usuario logueado [doc: 51]
    let consulta = query(

      collection(db, 'transacciones'),

      where(
        'uidUsuario',
        '==',
        usuarioLogueado.uid
      )
    );

    // Filtros dinámicos (Requisito de Persona 1) [doc: 16]
    if (filtros.categoria) {

      consulta = query(
        consulta,
        where(
          'categoria',
          '==',
          filtros.categoria
        )
      );
    }

    // FILTRO CUENTA
    if (filtros.cuenta) {

      consulta = query(
        consulta,
        where(
          'cuenta',
          '==',
          filtros.cuenta
        )
      );
    }

    // FILTRO FECHAS
    if (
      filtros.fechaInicio &&
      filtros.fechaFin
    ) {

      consulta = query(
        consulta,

        where(
          'fecha',
          '>=',
          filtros.fechaInicio
        ),

        where(
          'fecha',
          '<=',
          filtros.fechaFin
        )
      );
    }

    const querySnapshot =
      await getDocs(consulta);

    const transacciones = [];

    querySnapshot.forEach((documento) => {

      transacciones.push({

        id: documento.id,

        ...documento.data()

      });

    });

    return transacciones;

  } catch (error) {

    console.error(
      "Error al obtener transacciones:",
      error
    );

    throw error;
  }
};


// 3. EDITAR TRANSACCIÓN
export const editarTransaccion = async (
  idTransaccion,
  datosActualizados
) => {

  try {

    const docRef = doc(
      db,
      'transacciones',
      idTransaccion
    );

    await updateDoc(docRef, {

      ...datosActualizados,

      monto: parseFloat(
        datosActualizados.monto
      )

    });

  } catch (error) {

    console.error(
      "Error al editar transaccion:",
      error
    );

    throw error;
  }
};


// 4. ELIMINAR TRANSACCIÓN
export const eliminarTransaccion = async (
  idTransaccion
) => {

  try {

    const docRef = doc(
      db,
      'transacciones',
      idTransaccion
    );

    await deleteDoc(docRef);

  } catch (error) {

    console.error(
      "Error al eliminar transaccion:",
      error
    );

    throw error;
  }
};