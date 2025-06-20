"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
require("dotenv/config");
if (!firebase_admin_1.default.apps.length) {
    const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_CREDENTIALS, "base64").toString("utf8"));
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(credentials),
    });
}
const auth = firebase_admin_1.default.auth();
exports.auth = auth;
const db = firebase_admin_1.default.firestore();
exports.db = db;
//# sourceMappingURL=db.js.map