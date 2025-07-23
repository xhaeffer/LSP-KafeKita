import {
  cert,
  getApps,
  initializeApp,
  ServiceAccount
} from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

const serviceAccountKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccountKey as ServiceAccount)
  })
}

export const auth = getAuth()
export const db = getFirestore()
