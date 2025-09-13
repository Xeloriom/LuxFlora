// Delivery / Pickup toggle
const labels = {
  delivery: document.getElementById('label-delivery'),
  pickup: document.getElementById('label-pickup')
};
const pickupPaymentDiv = document.getElementById('pickupPaymentOptions');
const pickupLabels = {
  'pay-now': document.getElementById('pay-now-label'),
  'pay-later': document.getElementById('pay-later-label')
};

function updateDeliverySelection(type) {
  for (const key in labels) labels[key].classList.toggle('border-black', key === type);
  localStorage.setItem('deliveryType', type);

  if (type === 'pickup') {
    pickupPaymentDiv.classList.remove('hidden');
    const savedPickup = localStorage.getItem('pickupPayment') || 'pay-now';
    pickupLabels[savedPickup].classList.add('border-black');
    document.querySelector(`input[name="pickupPayment"][value="${savedPickup}"]`).checked = true;
  } else {
    pickupPaymentDiv.classList.add('hidden');
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  const savedType = localStorage.getItem('deliveryType') || 'delivery';
  updateDeliverySelection(savedType);
  document.querySelector(`input[name="deliveryType"][value="${savedType}"]`).checked = true;
});

// Events
document.querySelectorAll('.delivery-radio').forEach(radio => {
  radio.addEventListener('change', e => updateDeliverySelection(e.target.value));
});

document.querySelectorAll('.pickup-radio').forEach(radio => {
  radio.addEventListener('change', e => {
    for (const key in pickupLabels) pickupLabels[key].classList.toggle('border-black', key === e.target.value);
    localStorage.setItem('pickupPayment', e.target.value);
  });
});
