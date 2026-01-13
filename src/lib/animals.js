import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { db, storage } from './firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const animalsRef = collection(db, 'animals')

export async function addAnimal(payload) {
  const docRef = await addDoc(animalsRef, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateAnimal(id, updates) {
  await updateDoc(doc(db, 'animals', id), {
    ...updates,
    updatedAt: serverTimestamp()
  })
}

export async function deleteAnimal(id) {
  await deleteDoc(doc(db, 'animals', id))
}

export async function getAnimal(id) {
  const snap = await getDoc(doc(db, 'animals', id))
  if (!snap.exists()) return null
  const data = snap.data()
  return normalizeAnimal({ id: snap.id, ...data })
}

export async function getAnimals(filter = {}) {
  let q = query(animalsRef, orderBy('updatedAt', 'desc'))

  if (filter.species && filter.species !== 'all') {
    q = query(animalsRef, where('species', '==', filter.species))
  }
  if (filter.healthStatus && filter.healthStatus !== 'all') {
    q = query(animalsRef, where('healthStatus', '==', filter.healthStatus))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => normalizeAnimal({ id: d.id, ...d.data() }))
}

export async function uploadAnimalPhoto(animalId, file) {
  const storageRef = ref(storage, `animals/${animalId}/${Date.now()}-${file.name}`)
  const buffer = await file.arrayBuffer()
  await uploadBytes(storageRef, buffer, { contentType: file.type })
  return getDownloadURL(storageRef)
}

function normalizeAnimal(data) {
  return {
    ...data,
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
    lastSeen: data.lastSeen?.toDate?.() || data.lastSeen,
  }
}
