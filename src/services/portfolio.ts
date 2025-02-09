import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, Timestamp, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Portfolio } from '@/types/portfolio';

const COLLECTION_NAME = 'portfolios';

export const getPortfolios = async (): Promise<Portfolio[]> => {
  const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Portfolio[];
};

export const addPortfolio = async (portfolio: Omit<Portfolio, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...portfolio,
    category: portfolio.category || null, // Ensure category is stored as ID or null if empty
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updatePortfolio = async (id: string, portfolio: Partial<Portfolio>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...portfolio,
    category: portfolio.category !== undefined ? portfolio.category : undefined, // Update category only if provided
    updatedAt: Timestamp.now(),
  });
};

export const deletePortfolio = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};
