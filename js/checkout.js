document.getElementById("checkoutButton")?.addEventListener("click", (e) => {
  e.preventDefault();

  const deliveryType = document.querySelector(".delivery-radio:checked").value;
  const pickupPayment = deliveryType === 'pickup' ? document.querySelector('input[name="pickupPayment"]:checked')?.value : null;

  // Champs obligatoires de base
  const requiredFields = ['your_name','your_email','phone'];

  if(deliveryType === 'delivery') {
    requiredFields.push('address','city','zip','country');
  }

  // Vérifier si paiement en ligne via carte
  const cardRequired = deliveryType === 'delivery' || (deliveryType === 'pickup' && pickupPayment === 'pay-now');
  if(cardRequired) {
    requiredFields.push('cardNumber','cardExpiry','cardCVC');
  }

  // Vérification des champs manquants
  const missingFields = requiredFields.filter(f => !document.getElementById(f)?.value.trim());

  const cartData = JSON.parse(localStorage.getItem('cartData') || '[]');
  if(cartData.length === 0) return alert("Votre panier est vide.");
  if(deliveryType === 'pickup' && !pickupPayment) return alert("Sélectionnez un mode de paiement.");

  if(missingFields.length > 0){
    showErrorPopup(missingFields);
    return;
  }

  // Création de la commande
  const order = {
    cart: cartData,
    name: document.getElementById('your_name').value,
    email: document.getElementById('your_email').value,
    phone: document.getElementById('phone').value,
    deliveryType: deliveryType,
    paymentMethod: cardRequired ? 'online' : 'on-site',
    address: deliveryType === "delivery" ? {
      street: document.getElementById('address').value,
      city: document.getElementById('city').value,
      zip: document.getElementById('zip').value,
      country: document.getElementById('country').value
    } : null,
    total: document.getElementById('cartTotalDisplay').textContent,
    cardInfo: cardRequired ? {
      number: document.getElementById('cardNumber').value,
      expiry: document.getElementById('cardExpiry').value,
      cvc: document.getElementById('cardCVC').value
    } : null,
    date: new Date().toISOString()
  };

  addOrder(order);
  localStorage.setItem("lastOrder", JSON.stringify(order));
  window.location.href = "suivi-livraison.html";
});

function showErrorPopup(fields){
  const popup = document.getElementById('errorPopup');
  const list = document.getElementById('missingFieldsList');
  list.innerHTML = '';

  const fieldNames = {
    'your_name': 'Nom complet',
    'your_email': 'Email',
    'phone': 'Téléphone',
    'address': 'Adresse',
    'city': 'Ville',
    'zip': 'Code postal',
    'country': 'Pays',
    'cardNumber': 'Numéro de carte',
    'cardExpiry': 'Date d\'expiration',
    'cardCVC': 'CVC'
  };
  fields.forEach(f => {
    const li = document.createElement('li');
    li.textContent = fieldNames[f];
    list.appendChild(li);
  });

  popup.classList.remove('hidden');
  document.getElementById('closePopup').addEventListener('click', () => popup.classList.add('hidden'));
}
