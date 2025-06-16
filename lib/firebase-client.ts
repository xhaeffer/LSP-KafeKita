import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDYjRbWRp7uoUsSys1tdR_NNSf5gqIXSJ0",
  authDomain: "lsp-kafekita.firebaseapp.com",
  projectId: "lsp-kafekita",
  storageBucket: "lsp-kafekita.firebasestorage.app",
  messagingSenderId: "641403034384",
  appId: "1:641403034384:web:378690ec96ce26bc3e2395"
};

const app = 
  getApps().length 
    ? getApp() 
    : initializeApp(firebaseConfig)

export const auth = getAuth(app)