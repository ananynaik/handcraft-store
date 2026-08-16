import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

// Sonali's Handcrafts Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeCA_wut1H1_RyOKLfcLXSj-GCb8GOxkY",
  authDomain: "sonalis-handcrafts.firebaseapp.com",
  projectId: "sonalis-handcrafts",
  storageBucket: "sonalis-handcrafts.firebasestorage.app",
  messagingSenderId: "275433297737",
  appId: "1:275433297737:web:be6eee5d452c77245dec98",
  measurementId: "G-4FE43YQE09"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
try { getAnalytics(firebaseApp); } catch (_) {}

const products=[
 {id:1,name:'Terracotta Vase',desc:'Hand-shaped ceramic décor',price:699,class:'p1'},
 {id:2,name:'Woven Wall Basket',desc:'Natural fiber wall art',price:849,class:'p2'},
 {id:3,name:'Clay Tea Set',desc:'A warm, rustic everyday set',price:1199,class:'p3'},
 {id:4,name:'Artisan Candle',desc:'Hand-poured soy wax',price:499,class:'p4'}
];
let cart=[];
const productsEl=document.getElementById('products');
const countEl=document.getElementById('cartCount');
const itemsEl=document.getElementById('cartItems');
const totalEl=document.getElementById('cartTotal');
const panel=document.getElementById('cartPanel');
const overlay=document.getElementById('overlay');
const nav=document.getElementById('nav');
const menuToggle=document.getElementById('menuToggle');
function money(n){return `₹${n.toLocaleString('en-IN')}`}
function renderProducts(){productsEl.innerHTML=products.map(p=>`<article class="product"><div class="product-image ${p.class}" aria-hidden="true"></div><div class="product-info"><h3>${p.name}</h3><p>${p.desc}</p><div class="price-row"><span class="price">${money(p.price)}</span><button class="add" onclick="addToCart(${p.id})">Add to cart</button></div></div></article>`).join('')}
function addToCart(id){const p=products.find(x=>x.id===id);const existing=cart.find(x=>x.id===id);existing?existing.qty++:cart.push({...p,qty:1});renderCart();openCart()}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);renderCart()}
function renderCart(){countEl.textContent=cart.reduce((s,x)=>s+x.qty,0);if(!cart.length){itemsEl.innerHTML='<div class="empty">Your cart is ready for something handmade.</div>';totalEl.textContent=money(0);return}itemsEl.innerHTML=cart.map(x=>`<div class="cart-item"><div><strong>${x.name}</strong><small>${x.qty} × ${money(x.price)}</small></div><button onclick="removeFromCart(${x.id})">Remove</button></div>`).join('');totalEl.textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0))}
function openCart(){panel.classList.add('open');overlay.classList.add('open');panel.setAttribute('aria-hidden','false')}
function closeCart(){panel.classList.remove('open');overlay.classList.remove('open');panel.setAttribute('aria-hidden','true')}
function closeMenu(){nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false')}
document.getElementById('cartButton').onclick=openCart;
document.getElementById('closeCart').onclick=closeCart;
overlay.onclick=closeCart;
menuToggle.onclick=()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open))};
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));

document.getElementById('checkout').onclick=async()=>{
  if(!cart.length){alert('Your cart is empty.');return}
  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  try{
    await addDoc(collection(db,'orders'),{
      items:cart.map(({id,name,price,qty})=>({id,name,price,qty})),
      total,
      status:'pending',
      createdAt:serverTimestamp()
    });
    alert('Order saved successfully. Payment integration can be added next.');
    cart=[];
    renderCart();
    closeCart();
  }catch(error){
    console.error('Firebase order error:',error);
    alert('Firebase is connected, but Firestore needs to be enabled/configured before orders can be saved.');
  }
};

document.getElementById('newsletterForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const email=e.target.querySelector('input[type="email"]').value.trim();
  const message=document.getElementById('formMessage');
  try{
    await addDoc(collection(db,'newsletterSubscribers'),{email,createdAt:serverTimestamp()});
    message.textContent='Thanks! You’re on the list.';
    e.target.reset();
  }catch(error){
    console.error('Firebase newsletter error:',error);
    message.textContent='Please enable Firestore to save subscriptions.';
  }
});

// Exposed for future customer login/signup features.
window.sonaliFirebase = { app: firebaseApp, db, auth };
renderProducts();renderCart();