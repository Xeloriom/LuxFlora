// Empêche le scroll sur la page globale mais autorise le scroll sur les éléments avec la classe 'scrollable'
document.addEventListener('touchmove', function(e) {
  if (!e.target.closest('.scrollable')) {
    e.preventDefault();
  }
}, { passive: false });

// Désactiver la roulette souris (utile sur certains mobiles/tablettes)
window.addEventListener('wheel', function(e) {
  if (!e.target.closest('.scrollable')) {
    e.preventDefault();
  }
}, { passive: false });

// Désactiver le clic droit
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  alert("Action non autorisée");
});

// Désactiver la sélection de texte
document.addEventListener('selectstart', function(e) {
  e.preventDefault();
});

// Désactiver Ctrl+C, Ctrl+U, Ctrl+Shift+I, Ctrl+Shift+J et F12
document.addEventListener('keydown', function(e) {
  if (
    (e.ctrlKey && e.key === 'c') || // Copier
    (e.ctrlKey && e.key === 'u') || // Voir le code source
    (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') || // DevTools
    (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'j') || // Console
    (e.key === 'F12') // F12
  ) {
    e.preventDefault();
    alert("Action non autorisée");
  }
});



