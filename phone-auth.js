import { RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

const waitForAuth = () => new Promise(resolve => {
  if (window.sonaliFirebase?.auth) return resolve(window.sonaliFirebase.auth);
  const timer = setInterval(() => {
    if (window.sonaliFirebase?.auth) { clearInterval(timer); resolve(window.sonaliFirebase.auth); }
  }, 50);
  setTimeout(() => clearInterval(timer), 10000);
});

const setup = async () => {
  const auth = await waitForAuth();
  const form = document.getElementById('authForm');
  const modal = document.querySelector('.auth-modal');
  if (!form || !modal || document.getElementById('phoneAuthArea')) return;

  const area = document.createElement('div');
  area.id = 'phoneAuthArea';
  area.innerHTML = `
    <div class="auth-divider"><span>OR</span></div>
    <button type="button" class="phone-login-btn" id="phoneModeBtn">📱 Continue with phone</button>
    <div id="phonePanel" hidden>
      <label>Phone number
        <input id="phoneNumber" type="tel" inputmode="tel" autocomplete="tel" placeholder="+91 98765 43210">
      </label>
      <div id="recaptcha-container"></div>
      <button type="button" class="primary-btn auth-submit" id="sendCodeBtn">Send verification code <span>→</span></button>
      <label id="phoneCodeWrap" hidden>Verification code
        <input id="phoneCode" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="6-digit code">
      </label>
      <button type="button" class="primary-btn auth-submit" id="verifyCodeBtn" hidden>Verify phone <span>✓</span></button>
      <button type="button" class="phone-back" id="phoneBack">← Back to email login</button>
    </div>`;
  modal.insertBefore(area, document.getElementById('authSwitch'));

  const phoneModeBtn = document.getElementById('phoneModeBtn');
  const phonePanel = document.getElementById('phonePanel');
  const phoneNumber = document.getElementById('phoneNumber');
  const sendCodeBtn = document.getElementById('sendCodeBtn');
  const phoneCodeWrap = document.getElementById('phoneCodeWrap');
  const phoneCode = document.getElementById('phoneCode');
  const verifyCodeBtn = document.getElementById('verifyCodeBtn');
  const phoneBack = document.getElementById('phoneBack');
  const message = document.getElementById('authMessage');
  let confirmationResult = null;
  let verifier = null;

  const resetRecaptcha = () => {
    try { if (verifier) verifier.clear(); } catch (_) {}
    verifier = null;
    const container = document.getElementById('recaptcha-container');
    if (container) container.innerHTML = '';
  };

  phoneModeBtn.onclick = () => {
    form.hidden = true;
    document.getElementById('googleLogin').hidden = true;
    document.getElementById('authSwitch').hidden = true;
    phoneModeBtn.hidden = true;
    phonePanel.hidden = false;
    message.textContent = 'Enter your phone number with country code.';
    setTimeout(() => {
      try {
        verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'normal' });
        verifier.render();
      } catch (e) { message.textContent = 'Could not load reCAPTCHA. Please refresh and try again.'; console.error(e); }
    }, 50);
  };

  sendCodeBtn.onclick = async () => {
    const value = phoneNumber.value.trim();
    if (!/^\+[1-9]\d{7,14}$/.test(value)) {
      message.textContent = 'Enter a valid number, for example +919876543210.';
      return;
    }
    sendCodeBtn.disabled = true;
    message.textContent = 'Sending verification code…';
    try {
      confirmationResult = await signInWithPhoneNumber(auth, value, verifier);
      phoneCodeWrap.hidden = false;
      verifyCodeBtn.hidden = false;
      sendCodeBtn.hidden = true;
      message.textContent = 'Code sent. Check your phone.';
      phoneCode.focus();
    } catch (error) {
      console.error(error);
      message.textContent = error.code === 'auth/billing-not-enabled' ? 'Phone verification needs Firebase billing enabled for real SMS.' : (error.message || 'Could not send the code.');
      sendCodeBtn.disabled = false;
      resetRecaptcha();
      try { verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'normal' }); verifier.render(); } catch (_) {}
    }
  };

  verifyCodeBtn.onclick = async () => {
    if (!confirmationResult) return;
    verifyCodeBtn.disabled = true;
    message.textContent = 'Verifying…';
    try {
      const result = await confirmationResult.confirm(phoneCode.value.trim());
      message.textContent = `Welcome${result.user.displayName ? ', ' + result.user.displayName : ''}!`;
      setTimeout(() => document.getElementById('authClose')?.click(), 700);
    } catch (error) {
      console.error(error);
      message.textContent = error.code === 'auth/invalid-verification-code' ? 'That code is incorrect. Try again.' : (error.message || 'Verification failed.');
      verifyCodeBtn.disabled = false;
    }
  };

  phoneBack.onclick = () => {
    resetRecaptcha();
    confirmationResult = null;
    form.hidden = false;
    document.getElementById('googleLogin').hidden = false;
    document.getElementById('authSwitch').hidden = false;
    phoneModeBtn.hidden = false;
    phonePanel.hidden = true;
    phoneCodeWrap.hidden = true;
    verifyCodeBtn.hidden = true;
    sendCodeBtn.hidden = false;
    sendCodeBtn.disabled = false;
    message.textContent = '';
  };
};
setup();
