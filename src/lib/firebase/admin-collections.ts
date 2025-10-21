import { getAdminFirestore } from "@/lib/firebase/admin-app";
import {
  labelCollectionPath,
  noteCollectionPath,
  noteDocPath,
  reminderCollectionPath,
} from "@/lib/firebase/collections";

export function adminNoteCollection(userId: string) {
  return getAdminFirestore().collection(noteCollectionPath(userId));
}

export function adminLabelCollection(userId: string) {
  return getAdminFirestore().collection(labelCollectionPath(userId));
}

export function adminReminderCollection(userId: string) {
  return getAdminFirestore().collection(reminderCollectionPath(userId));
}

export function adminNoteDoc(userId: string, noteId: string) {
  return getAdminFirestore().doc(noteDocPath(userId, noteId));
}
