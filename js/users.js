function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function addOrder(order) {
  let users = getUsers();
  let user = users.find(u => u.email === order.email);

  if (!user) {
    user = { name: order.name, email: order.email, phone: order.phone, orders: [] };
    users.push(user);
  }

  user.orders.push(order);
  saveUsers(users);

  updateProfileIcon();
  clearCart();
}

function updateProfileIcon() {
  const users = getUsers();
  const profileIcon = document.getElementById('profileIcon');
  if (users.length > 0) profileIcon.classList.remove('hidden');
  else profileIcon.classList.add('hidden');
}

function clearCart() {
  localStorage.removeItem('cartData');
  displayCartItems();
}

// Initialisation
document.addEventListener('DOMContentLoaded', updateProfileIcon);

document.getElementById('profileIcon').addEventListener('click', () => {
  window.location.href = '../pages/mes-commandes.html';
});
