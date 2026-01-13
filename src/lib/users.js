import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore'
import { db } from './firebase'

const usersRef = collection(db, 'users')

export async function getUsers(role) {
  const q = role ? query(usersRef, where('role', '==', role)) : usersRef
  const snap = await getDocs(q)
  return snap.docs.map((d) => normalizeUser({ id: d.id, ...d.data() }))
}

export async function updateUser(uid, updates) {
  await updateDoc(doc(db, 'users', uid), {
    ...updates,
    updatedAt: serverTimestamp()
  })
}

export async function deleteUser(uid) {
  await deleteDoc(doc(db, 'users', uid))
}

function normalizeUser(data) {
  return {
    ...data,
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
  }
}
