import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let initialized = false;

/**
 * Initialize Firebase Admin SDK
 * Service account JSON must be at backend/firebase-service-account.json
 */
export function initializeFirebaseAdmin() {
  // Skip if already initialized
  if (admin.apps.length > 0) {
    console.log("✅ Firebase Admin SDK already initialized");
    initialized = true;
    return admin;
  }

  try {
    const serviceAccountPath = path.join(
      __dirname,
      "firebase-service-account.json"
    );

    // Check if service account file exists
    if (!fs.existsSync(serviceAccountPath)) {
      console.warn(
        "⚠️ firebase-service-account.json not found at:",
        serviceAccountPath
      );
      console.warn(
        "⚠️ Firebase Admin SDK will not be available. Token verification will fail."
      );
      console.warn(
        "📍 To fix: Download service account from Firebase Console → Project Settings → Service Accounts"
      );
      return null;
    }

    // Load service account
    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8")
    );

    console.log("📍 Service account project_id:", serviceAccount.project_id);

    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });

    console.log("✅ Firebase Admin SDK initialized successfully");
    console.log("📍 Project ID:", serviceAccount.project_id);
    initialized = true;

    return admin;
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin SDK:", error.message);
    console.error(
      "⚠️ Firebase token verification will be disabled. Check service account file."
    );
    return null;
  }
}

/**
 * Verify Firebase ID Token
 * @param {string} idToken - Firebase ID token from frontend
 * @returns {Promise<object>} Decoded token or null if verification fails
 */
export async function verifyFirebaseToken(idToken) {
  try {
    if (!admin.apps.length) {
      console.warn(
        "⚠️ Firebase Admin SDK not initialized. Cannot verify token."
      );
      return null;
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("✅ Firebase token verified successfully");
    console.log("📍 Token claims - UID:", decodedToken.uid, "Email:", decodedToken.email);
    return decodedToken;
  } catch (error) {
    console.error("❌ Firebase token verification failed:", error.message);
    console.error("📍 Error code:", error.code);

    // Detailed error logging
    if (error.code === "auth/invalid-argument") {
      console.error("⚠️ Invalid token format");
    } else if (error.code === "auth/invalid-id-token") {
      console.error("⚠️ Token is invalid or expired");
    } else if (error.code === "auth/id-token-revoked") {
      console.error("⚠️ Token has been revoked");
    }

    return null;
  }
}

/**
 * Get Firebase Admin instance
 */
export function getFirebaseAdmin() {
  if (!admin.apps.length && !initialized) {
    console.warn("⚠️ Firebase Admin SDK not yet initialized");
    initializeFirebaseAdmin();
  }
  return admin.apps.length > 0 ? admin : null;
}

export default admin;
