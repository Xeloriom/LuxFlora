// Carte bancaire section
const cardSection = document.querySelector('div.bg-white.rounded-2xl.shadow-md.p-8.border.border-gray-100:nth-of-type(2)');

function updateCardVisibility() {
  const deliveryType = localStorage.getItem('deliveryType') || 'delivery';
  let showCard = true;

  if (deliveryType === 'pickup') {
    const pickupPayment = localStorage.getItem('pickupPayment') || 'pay-now';
    showCard = pickupPayment === 'pay-now';
  }

  cardSection.style.display = showCard ? 'block' : 'none';
}

// Déclenche au chargement et au changement
document.addEventListener('DOMContentLoaded', updateCardVisibility);
document.querySelectorAll('.delivery-radio, .pickup-radio').forEach(radio => {
  radio.addEventListener('change', updateCardVisibility);
});
