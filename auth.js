import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, updateProfile, sendEmailVerification } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { app, db } from "./firebase.js";

export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export async function register(email, password, name) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });
  await setDoc(doc(db, "users", result.user.uid), { name, email, createdAt: serverTimestamp() });
  await sendEmailVerification(result.user);
  return result.user;
}

export async function login(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", result.user.uid), { lastLogin: serverTimestamp() }, { merge: true });
  return result.user;
}

export async function googleLogin() {
  const result = await signInWithPopup(auth, googleProvider);
  await setDoc(doc(db, "users", result.user.uid), { name: result.user.displayName || "Customer", email: result.user.email, lastLogin: serverTimestamp() }, { merge: true });
  return result.user;
}

export function logout() { return signOut(auth); }
export async function resendVerification() { if (auth.currentUser) await sendEmailVerification(auth.currentUser); }
export { onAuthStateChanged };