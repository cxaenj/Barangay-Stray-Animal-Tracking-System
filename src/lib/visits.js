import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'

const visitsRef = collection(db, 'visits')

export async function addVisit(payload) {
  const docRef = await addDoc(visitsRef, {
    ...payload,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export async function getVisitsByAnimal(animalId) {
  const q = query(visitsRef, where('animalId', '==', animalId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => normalizeVisit({ id: d.id, ...d.data() }))
}

function normalizeVisit(data) {
  return {
    ...data,
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
  }
}
