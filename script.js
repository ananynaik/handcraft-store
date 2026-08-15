const products=[
 {id:1,name:'Terracotta Vase',desc:'Hand-shaped ceramic décor',price:699,emoji:'🏺',class:'p1'},
 {id:2,name:'Woven Wall Basket',desc:'Natural fiber wall art',price:849,emoji:'🧺',class:'p2'},
 {id:3,name:'Clay Tea Set',desc:'A warm, rustic everyday set',price:1199,emoji:'🍵',class:'p3'},
 {id:4,name:'Artisan Candle',desc:'Hand-poured soy wax',price:499,emoji:'🕯️',class:'p4'}
];
let cart=[];
const productsEl=document.getElementById('products');
const countEl=document.getElementById('cartCount');
const itemsEl=document.getElementById('cartItems');
const totalEl=document.getElementById('cartTotal');
const panel=document.getElementById('cartPanel');
const overlay=document.getElementById('overlay');
function money(n){return `₹${n.toLocaleString('en-IN')}`}
function renderProducts(){productsEl.innerHTML=products.map(p=>`<article class="product"><div class="product-image ${p.class}">${p.emoji}</div><div class="product-info"><h3>${p.name}</h3><p>${p.desc}</p><div class="price-row"><span class="price">${money(p.price)}</span><button class="add" onclick="addToCart(${p.id})">Add to cart</button></div></div></article>`).join('')}
function addToCart(id){const p=products.find(x=>x.id===id);const existing=cart.find(x=>x.id===id);existing?existing.qty++:cart.push({...p,qty:1});renderCart();openCart()}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);renderCart()}
function renderCart(){countEl.textContent=cart.reduce((s,x)=>s+x.qty,0);if(!cart.length){itemsEl.innerHTML='<div class="empty">Your cart is waiting for something handmade. ✨</div>';totalEl.textContent=money(0);return}itemsEl.innerHTML=cart.map(x=>`<div class="cart-item"><div><strong>${x.name}</strong><small>${x.qty} × ${money(x.price)}</small></div><button onclick="removeFromCart(${x.id})">Remove</button></div>`).join('');totalEl.textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0))}
function openCart(){panel.classList.add('open');overlay.classList.add('open');panel.setAttribute('aria-hidden','false')}
function closeCart(){panel.classList.remove('open');overlay.classList.remove('open');panel.setAttribute('aria-hidden','true')}
document.getElementById('cartButton').onclick=openCart;document.getElementById('closeCart').onclick=closeCart;overlay.onclick=closeCart;
document.getElementById('checkout').onclick=()=>{if(!cart.length){alert('Your cart is empty.');return}alert('Demo checkout — payment integration can be added next!')};
document.getElementById('newsletterForm').addEventListener('submit',e=>{e.preventDefault();document.getElementById('formMessage').textContent='Thanks! You’re on the list. ♥';e.target.reset()});
renderProducts();renderCart();