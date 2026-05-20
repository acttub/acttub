import {
  getApps,
  initializeApp,
  cert,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

const globalForFb = globalThis as unknown as { fbAdminApp?: App };

function getApp(): App {
  if (globalForFb.fbAdminApp) return globalForFb.fbAdminApp;
  const existing = getApps();
  if (existing.length > 0) {
    globalForFb.fbAdminApp = existing[0];
    return existing[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY 환경변수가 필요합니다.",
    );
  }

  const app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
  globalForFb.fbAdminApp = app;
  return app;
}

export function adminDb(): Firestore {
  return getFirestore(getApp());
}
