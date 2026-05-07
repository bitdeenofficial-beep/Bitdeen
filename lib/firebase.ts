import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBjK7ws7mhnDA5HF24neBVPHQztI596Wfk",
  authDomain: "bitdeen-ce677.firebaseapp.com",
  projectId: "bitdeen-ce677",
  storageBucket: "bitdeen-ce677.firebasestorage.app",
  messagingSenderId: "933214939925",
  appId: "1:933214939925:web:9088572a11bfdf588dd71c",
  measurementId: "G-X4XXFHR7BJ"
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()

export { app, auth, db, googleProvider }
