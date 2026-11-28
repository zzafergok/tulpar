import 'server-only';

import type {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
} from 'firebase-admin/firestore';
import type { z } from 'zod';
import { getAdminFirestore } from './admin';

export class FirestoreOwnershipError extends Error {
  public readonly status = 404;

  constructor(message = 'Kayıt bulunamadı.') {
    super(message);
    this.name = 'FirestoreOwnershipError';
  }
}

/**
 * Fetches a Firestore document and verifies `userId` ownership.
 * Returns a uniform 404-style error for both missing and unowned documents to prevent IDOR enumeration.
 */
export async function getOwnedDocument(
  collectionName: string,
  documentId: string,
  userId: string,
): Promise<DocumentSnapshot<DocumentData>> {
  const snapshot = await getAdminFirestore()
    .collection(collectionName)
    .doc(documentId)
    .get();

  const data = snapshot.data();
  if (!snapshot.exists || !data || data.userId !== userId) {
    throw new FirestoreOwnershipError();
  }

  return snapshot;
}

export async function getOwnedDocumentReference(
  collectionName: string,
  documentId: string,
  userId: string,
): Promise<DocumentReference<DocumentData>> {
  const snapshot = await getOwnedDocument(collectionName, documentId, userId);
  return snapshot.ref;
}

/**
 * Returns a reference to `/users/{uid}/{subcollection}` matching the default Firestore hierarchy.
 */
export function getUserSubcollection(
  userId: string,
  subcollectionName: string,
): CollectionReference<DocumentData> {
  return getAdminFirestore()
    .collection('users')
    .doc(userId)
    .collection(subcollectionName);
}

/**
 * Parses a Firestore document snapshot with a Zod schema without unsafe `any` casts.
 */
export function parseFirestoreDoc<TSchema extends z.ZodTypeAny>(
  snapshot: DocumentSnapshot<DocumentData>,
  schema: TSchema,
): (z.infer<TSchema> & { id: string }) | null {
  const data = snapshot.data();
  if (!snapshot.exists || !data) {
    return null;
  }

  const parsed = schema.safeParse({ id: snapshot.id, ...data });
  if (!parsed.success) {
    return null;
  }

  return parsed.data as z.infer<TSchema> & { id: string };
}
