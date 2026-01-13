import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBxewzUA_bFDBXQUIwy2faF4fK2NgxIs1I",
  authDomain: "barangay-animal-tracking.firebaseapp.com",
  projectId: "barangay-animal-tracking",
  storageBucket: "barangay-animal-tracking.firebasestorage.app",
  messagingSenderId: "388642509250",
  appId: "1:388642509250:web:71896a2eadf502a8b4c65b",
  measurementId: "G-VMBD4RERPX"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
