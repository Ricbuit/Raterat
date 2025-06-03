import { db } from './Firebase.ts';
import { collection, getDocs, addDoc, setDoc, doc } from 'firebase/firestore';

export async function fetchCities(): Promise<string[]> {
    const snapshot = await getDocs(collection(db, 'cities'));
    return snapshot.docs.map(doc => doc.data().name);
}

export async function saveCity(name: string) {
    await addDoc(collection(db, 'cities'), {
        name,
        createdAt: Date.now(),
    });
}

export async function createCategory(city: string, category: string) {
    const ref = doc(collection(doc(db, 'cities', city), 'categories'), category);
    await setDoc(ref, {});
}

export async function addItemToCategory(city: string, category: string, name: string) {
    const ref = collection(doc(collection(doc(db, 'cities', city), 'categories'), category), 'items');
    await addDoc(ref, { name });
}
