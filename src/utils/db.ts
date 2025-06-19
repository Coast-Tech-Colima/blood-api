import admin from "firebase-admin";
import 'dotenv/config'

if (!admin.apps.length) {
  const credentials = JSON.parse(
    Buffer.from(
      process.env.GOOGLE_CREDENTIALS as string,
      "base64"
    ).toString("utf8")
  );
  admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });
}
const auth = admin.auth();

const db = admin.firestore();

export { db, auth };
