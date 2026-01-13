import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { auth, db } from './firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export async function registerUser({ email, password, fullName, role = 'staff' }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName: fullName })

  const profile = {
    uid: credential.user.uid,
    email,
    fullName,
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    animalsManaged: 0
  }
  await setDoc(doc(db, 'users', credential.user.uid), profile)
  return profile
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function logoutUser() {
  await signOut(auth)
}

export function listenToAuth(cb) {
  return onAuthStateChanged(auth, cb)
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  const data = snap.data()
  return {
    ...data,
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
  }
}
