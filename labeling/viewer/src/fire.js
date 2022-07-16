import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore/lite'

const firebaseConfig = {
  apiKey: 'AIzaSyBEa7zqwvWSSVua_l3GP4t9KZhUB8rUP3Q',
  authDomain: 'log-here-now.firebaseapp.com',
  projectId: 'log-here-now',
  storageBucket: 'log-here-now.appspot.com',
  messagingSenderId: '1069340805490',
  appId: '1:1069340805490:web:657052bed8aa0574d8f5eb',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

export const db = getFirestore()
