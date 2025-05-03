import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "tu_api_key",
  authDomain: "tu_auth_domain",
  projectId: "tu_project_id",
  storageBucket: "tu_storage_bucket",
  messagingSenderId: "tu_messaging_sender_id",
  appId: "tu_app_id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const saveTriviaResult = async (category, questions, score) => {
  try {
    await addDoc(collection(db, 'triviaResults'), {
      category,
      questions,
      score,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    console.error('Error al guardar el resultado:', error);
    throw error;
  }
}; 