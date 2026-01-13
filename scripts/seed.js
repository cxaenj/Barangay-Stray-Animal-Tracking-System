// Firebase seeding script using Admin SDK
// Run with: npm run seed

import { initializeApp, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

// Initialize Firebase Admin (uses Application Default Credentials)
if (!getApps().length) {
  initializeApp({
    projectId: 'barangay-animal-tracking'
  })
}

const auth = getAuth()
const db = getFirestore()

async function seed() {
  console.log('🌱 Seeding database...\n')

  const users = [
    { email: 'admin@barangay.com', password: 'password123', fullName: 'Administrator', role: 'admin' },
    { email: 'staff@barangay.com', password: 'password123', fullName: 'Barangay Staff', role: 'staff' },
    { email: 'vet@barangay.com', password: 'password123', fullName: 'Dr. Veterinarian', role: 'veterinarian' }
  ]

  for (const u of users) {
    try {
      // Try to get existing user
      let userRecord
      try {
        userRecord = await auth.getUserByEmail(u.email)
        // Update password if user exists
        await auth.updateUser(userRecord.uid, { password: u.password })
        console.log(`🔄 Updated user: ${u.email} (password reset to password123)`)
      } catch (e) {
        if (e.code === 'auth/user-not-found') {
          // Create new user
          userRecord = await auth.createUser({
            email: u.email,
            password: u.password,
            displayName: u.fullName
          })
          console.log(`✅ Created user: ${u.email}`)
        } else {
          throw e
        }
      }

      // Create/update user profile in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: u.email,
        fullName: u.fullName,
        role: u.role,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        animalsManaged: 0
      }, { merge: true })
      
    } catch (e) {
      console.error(`❌ Error with ${u.email}:`, e.message)
    }
  }

  const animals = [
    { tagId: 'CAT-152980', name: 'CAT-01', species: 'cat', sex: 'male', location: 'Barangay Hall', healthStatus: 'healthy', vaccinated: false, neutered: false, color: 'Orange tabby' },
    { tagId: 'DOG-329140', name: 'DOG-03', species: 'dog', sex: 'female', location: 'Market Area', healthStatus: 'healthy', vaccinated: true, neutered: true, color: 'Black and white' },
    { tagId: 'CAT-990812', name: 'CAT-03', species: 'cat', sex: 'female', location: 'Elementary School', healthStatus: 'healthy', vaccinated: false, neutered: false, color: 'Calico' },
    { tagId: 'DOG-284975', name: 'DOG-02', species: 'dog', sex: 'male', location: 'Park Area', healthStatus: 'healthy', vaccinated: true, neutered: true, color: 'Brown' },
    { tagId: 'CAT-706213', name: 'CAT-05', species: 'cat', sex: 'female', location: 'Church vicinity', healthStatus: 'healthy', vaccinated: true, neutered: true, color: 'White' },
    { tagId: 'CAT-152950', name: 'CAT-04', species: 'cat', sex: 'unknown', location: 'Residential area', healthStatus: 'injured', vaccinated: false, neutered: false, color: 'Gray' }
  ]

  console.log('\n🐾 Creating animals...')
  
  // Check if animals already exist
  const existingAnimals = await db.collection('animals').get()
  if (existingAnimals.size > 0) {
    console.log(`⚠️ ${existingAnimals.size} animals already exist, skipping...`)
  } else {
    for (const a of animals) {
      await db.collection('animals').add({
        ...a,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        createdBy: 'seed-script'
      })
      console.log(`✅ Created animal: ${a.name}`)
    }
  }

  console.log('\n✨ Done!')
  console.log('\n📧 Demo accounts (all passwords: password123):')
  console.log('   admin@barangay.com')
  console.log('   staff@barangay.com')
  console.log('   vet@barangay.com')
  process.exit(0)
}

seed().catch((e) => {
  console.error('Seed failed:', e)
  process.exit(1)
})
