import {
  cert,
  getApps,
  initializeApp,
  ServiceAccount
} from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

import serviceAccountKey from "../firebase_service_account.json"

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccountKey as ServiceAccount)
  })
}

export const auth = getAuth()
export const db = getFirestore()
