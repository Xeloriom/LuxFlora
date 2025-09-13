// Cart display & promo
let total = 0;

function displayCartItems() {
  const cartItemsList = document.getElementById('cartItemsList');
  const cartTotalDisplay = document.getElementById('cartTotalDisplay');
  const cartData = JSON.parse(localStorage.getItem('cartData') || '[]');
  cartItemsList.innerHTML = '';
  total = 0;

  if(cartData.length === 0){
    cartItemsList.innerHTML = '<li class="py-4 text-center text-gray-500">Votre panier est vide.</li>';
    cartTotalDisplay.textContent = '0 €';
    return;
  }

  cartData.forEach(item => {
    total += item.price;
    const li = document.createElement('li');
    li.className = 'flex justify-between py-4';
    li.innerHTML = `
      <div class="flex space-x-4">
        <img class="h-16 w-16 rounded object-cover" src="${item.image}" alt="${item.name}" />
        <div>
          <h4 class="text-gray-900 font-semibold">${item.name}</h4>
          <p class="text-gray-700">${item.price.toFixed(2)} €</p>
        </div>
      </div>
    `;
    cartItemsList.appendChild(li);
  });

  cartTotalDisplay.textContent = total.toFixed(2) + ' €';
}

document.addEventListener('DOMContentLoaded', displayCartItems);

// Promo code
let promoApplied = false;
document.getElementById("applyPromo")?.addEventListener("click", async () => {
  if (promoApplied) return;
  const code = document.getElementById("promo").value.trim().toUpperCase();
  const msg = document.getElementById("promoMessage");
  if (!code) return;

  try {
    const res = await fetch("../promos.json");
    const promos = await res.json();
    const promoObj = promos.find(p => p.code.toUpperCase() === code);

    if (promoObj) {
      const discount = promoObj.discount;
      const discounted = total - (total * discount / 100);
      document.getElementById("cartTotalDisplay").textContent = discounted.toFixed(2) + " €";
      msg.textContent = `✔ Promo applied: -${discount}%`;
      msg.className = "text-green-600 text-sm sm:col-span-2";
      promoApplied = true;
    } else {
      msg.textContent = "❌ Code promo invalide.";
      msg.className = "text-red-600 text-sm sm:col-span-2";
    }
  } catch(e){
    msg.textContent = "⚠ Erreur lors du chargement des promos.";
    msg.className = "text-red-600 text-sm sm:col-span-2";
  }
});
