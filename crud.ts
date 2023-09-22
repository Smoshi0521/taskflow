import {
  CollectionReference,
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

export async function Create(ref: CollectionReference, data: any) {
  try {
    await addDoc(ref, { ...data });
  } catch (err) {
    return err;
  }
}

export async function Delete(ref:CollectionReference) {
  await deleteDoc
}