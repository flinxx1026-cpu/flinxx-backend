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

    console.log(`📍 [Firebase Admin] Looking for service account at:`, serviceAccountPath);

    // Check if service account file exists
    if (!fs.existsSync(serviceAccountPath)) {
      console.error(
        "❌ firebase-service-account.json NOT FOUND at:",
        serviceAccountPath
      );
      console.error(
        "❌ Firebase Admin SDK will NOT be available. New user authentication will FAIL."
      );
      console.error(
        "📍 To fix: Download service account from Firebase Console → Project Settings → Service Accounts"
      );
      console.error(`📍 Expected file path: ${serviceAccountPath}`);
      return null;
    }

    console.log("✅ firebase-service-account.json file found");

    // Load service account
    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8")
    );

    console.log("📍 [Firebase Admin] Service account details:");
    console.log(`   - Project ID: ${serviceAccount.project_id}`);
    console.log(`   - Client Email: ${serviceAccount.client_email}`);
    console.log(`   - Private Key ID: ${serviceAccount.private_key_id}`);

    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });

    console.log("✅ Firebase Admin SDK initialized successfully");
    console.log(`📍 Project ID: ${serviceAccount.project_id}`);
    console.log("✅ Firebase token verification is NOW AVAILABLE for new users");
    initialized = true;

    return admin;
  } catch (error) {
    console.error("❌ CRITICAL: Failed to initialize Firebase Admin SDK:", error.message);
    console.error("❌ Firebase token verification will be DISABLED");
    console.error("❌ New user authentication will FAIL");
    console.error("📍 Stack trace:", error.stack);
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
    console.log(`🔐 [verifyFirebaseToken] Starting token verification (length: ${idToken.length})`);

    if (!admin.apps.length) {
      console.error(
        "❌ CRITICAL: Firebase Admin SDK NOT initialized. Cannot verify token."
      );
      console.error("❌ This means Firebase authentication is DISABLED for new users");
      return null;
    }

    console.log("✅ Firebase Admin SDK verified as initialized");
    console.log(`🔐 [verifyFirebaseToken] Calling admin.auth().verifyIdToken()...`);

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    console.log("✅ Firebase token verified successfully");
    console.log("🔐 [verifyFirebaseToken] Token claims:");
    console.log(`   - UID: ${decodedToken.uid}`);
    console.log(`   - Email: ${decodedToken.email}`);
    console.log(`   - Name: ${decodedToken.name || 'N/A'}`);
    console.log(`   - Issued At: ${new Date(decodedToken.iat * 1000).toISOString()}`);
    console.log(`   - Expires At: ${new Date(decodedToken.exp * 1000).toISOString()}`);

    return decodedToken;
  } catch (error) {
    console.error("❌ Firebase token verification FAILED:", error.message);
    console.error("📍 Error code:", error.code);
    console.error("📍 This user signup will FAIL without a valid token");

    // Detailed error logging
    if (error.code === "auth/invalid-argument") {
      console.error("⚠️ Invalid token format - check that token string is valid");
    } else if (error.code === "auth/invalid-id-token") {
      console.error("⚠️ Token is invalid or expired - check Firebase configuration");
    } else if (error.code === "auth/id-token-revoked") {
      console.error("⚠️ Token has been revoked");
    } else if (error.code === "auth/argument-error") {
      console.error("⚠️ Admin SDK not initialized - firebase-service-account.json might be missing");
    }

    console.error("📍 Stack trace:", error.stack);

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
