import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, updateProfile } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp, addDoc, collection } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { app, db } from "./firebase.js";

export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

async function queueLoginEmail(user) {
  if (!user?.email) return;
  const name = user.displayName || "Customer";
  await addDoc(collection(db, "mail"), {
    to: [user.email],
    message: {
      subject: "Thanks for logging in to Sonali's Handcrafts",
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px;color:#171613"><h1 style="font-family:Georgia,serif">Thanks for logging in!</h1><p>Hi ${name.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))},</p><p>Thanks for logging in to <strong>Sonali's Handcrafts</strong>. We're happy to have you with us.</p><p>Happy shopping!</p><p><strong>Sonali's Handcrafts</strong><br><em>Crafted with love.</em></p></div>`
    },
    createdAt: serverTimestamp()
  });
}

export async function register(email, password, name) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });
  await setDoc(doc(db, "users", result.user.uid), { name, email, createdAt: serverTimestamp() });
  return result.user;
}

export async function login(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", result.user.uid), { lastLogin: serverTimestamp() }, { merge: true });
  await queueLoginEmail(result.user);
  return result.user;
}

export async function googleLogin() {
  const result = await signInWithPopup(auth, googleProvider);
  await setDoc(doc(db, "users", result.user.uid), { name: result.user.displayName || "Customer", email: result.user.email, lastLogin: serverTimestamp() }, { merge: true });
  await queueLoginEmail(result.user);
  return result.user;
}

export function logout() { return signOut(auth); }
export { onAuthStateChanged };