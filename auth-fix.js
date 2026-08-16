import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updateProfile, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

const auth = window.sonaliFirebase?.auth;
const form = document.getElementById('authForm');
const message = document.getElementById('authMessage');
const email = document.getElementById('authEmail');
const password = document.getElementById('authPassword');
const name = document.getElementById('authName');
const google = document.getElementById('googleLogin');
const switchBox = document.getElementById('authSwitch');
const title = document.getElementById('authTitle');
const subtitle = document.getElementById('authSubtitle');
const submit = document.getElementById('authSubmit');
const close = () => document.getElementById('authOverlay')?.classList.remove('open');
let signup = false;

function show(text, error=false){ if(message){ message.textContent=text; message.style.color=error?'#b3261e':'#8b6a37'; } }
function friendly(code){
  const map={
    'auth/invalid-credential':'Incorrect email or password.',
    'auth/invalid-login-credentials':'Incorrect email or password.',
    'auth/user-not-found':'No account exists with this email.',
    'auth/wrong-password':'Incorrect email or password.',
    'auth/email-already-in-use':'An account already exists with this email. Try signing in.',
    'auth/weak-password':'Password must be at least 6 characters.',
    'auth/invalid-email':'Please enter a valid email address.',
    'auth/too-many-requests':'Too many attempts. Please wait a little and try again.',
    'auth/popup-closed-by-user':'Google sign-in was cancelled.'
  }; return map[code] || 'Something went wrong. Please try again.';
}

if(form && auth){
  form.addEventListener('submit', async e => {
    e.preventDefault(); e.stopImmediatePropagation();
    show('Please wait…');
    try{
      if(signup){
        const cred=await createUserWithEmailAndPassword(auth,email.value.trim(),password.value);
        if(name.value.trim()) await updateProfile(cred.user,{displayName:name.value.trim()});
        try{ await sendEmailVerification(cred.user); }catch(_){}
        show('Account created! Check your email to verify your address.');
        setTimeout(close,1800);
      }else{
        const cred=await signInWithEmailAndPassword(auth,email.value.trim(),password.value);
        show(`Welcome${cred.user.displayName?', '+cred.user.displayName:''}!`);
        setTimeout(close,700);
      }
    }catch(err){ console.error(err); show(friendly(err.code),true); }
  }, true);
}

google?.addEventListener('click', async e => {
  e.preventDefault();
  if(!auth) return show('Authentication is not initialized.',true);
  show('Opening Google sign-in…');
  try{ const cred=await signInWithPopup(auth,new GoogleAuthProvider()); show(`Welcome${cred.user.displayName?', '+cred.user.displayName:''}!`); setTimeout(close,700); }
  catch(err){ console.error(err); show(friendly(err.code),true); }
}, true);

switchBox?.addEventListener('click', e => {
  if(e.target.tagName!=='BUTTON') return;
  signup=!signup;
  title.textContent=signup?'Create your account':'Welcome back';
  subtitle.textContent=signup?"Join Sonali's Handcrafts.":"Sign in to your Sonali's Handcrafts account.";
  name.hidden=!signup; name.required=signup;
  submit.innerHTML=signup?'Create account <span>→</span>':'Sign in <span>→</span>';
  switchBox.innerHTML=signup?'Already have an account? <button type="button">Sign in</button>':'New here? <button type="button">Create an account</button>';
  show('');
});

// Add a simple password-reset action when the user presses Enter with an empty password.
window.resetSonaliPassword = async () => {
  if(!email.value.trim()) return show('Enter your email first.',true);
  try{ await sendPasswordResetEmail(auth,email.value.trim()); show('Password reset email sent.'); }
  catch(err){ show(friendly(err.code),true); }
};
