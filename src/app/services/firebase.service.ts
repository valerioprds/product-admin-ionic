import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
/* importaciones para la base de datos */
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  addDoc,
  collection,
  collectionData,
  query,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  getStorage,
  uploadString,
  ref,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilSvc = inject(UtilsService);

  //================== autenticacion ==================

  getAuth() {
    return getAuth();
  }

  // ======== Acceder ========
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // ======== Crear Usuario ========
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // ======== Actualizar  Usuario ========
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  // ======== restablecer contraseña ========

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // ======== cerrar sesion  ========

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilSvc.routerLink('/auth');
  }

  // ========== base de datos =========

  /*  obtnere documentos de una collecion  */

  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, ...collectionQuery), { idField: 'id' });
  }
  /*  guardar datos del usuario */
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  /*  actualizar documento del usuario */
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  /*  eliminar documento del usuario */
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  /*  obtener datos del usuario */

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  /* añadir documento */

  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  /* ======= almacenamiento con storage de firebase ======= */

  /* subir imagen  */
  async uploadImage(path: string, data_url: string) {
    await uploadString(ref(getStorage(), path), data_url, 'data_url');
    return getDownloadURL(ref(getStorage(), path));
  }

  /* obtner ruta imagen con su url */
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }

  /* eliminar archivos de le storage */

  deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path));
  }
}
