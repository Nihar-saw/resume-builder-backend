import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { env } from "./env.js";

let adminAuth = null;

try {
  const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
    console.log("Firebase Admin SDK initialized successfully.");
  }
  adminAuth = getAuth();
} catch (error) {
  console.error("Firebase Admin SDK initialization failed:");
  console.error(error);
}

export { adminAuth };
export default adminAuth;
