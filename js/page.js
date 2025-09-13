import { setZoom } from './spline.js';
import { loadTranslations, translatePage } from './i18n.js';

document.addEventListener("DOMContentLoaded", async () => {
  // 1️⃣ Charger traductions
  await loadTranslations();

  const container = document.getElementById('pages-container');
  let currentIndex = 0;
  let isAnimating = false;

  // 2️⃣ Charger routes
  const routesRes = await fetch('routes.json');
  const routes = await routesRes.json();

  // 3️⃣ Injecter header
  const headerRes = await fetch('pages/header.html');
  const headerHTML = await headerRes.text();
  document.body.insertAdjacentHTML('afterbegin', headerHTML);

  // Traduire le header juste après l'injection
  const headerEl = document.querySelector('header'); // Adapte le sélecteur selon ta structure
  if (headerEl) {
    translatePage(headerEl);
  }

  const menuLinks = document.querySelectorAll('nav ul li a');
  document.getElementById('logo-container').addEventListener('click', ()=>{
    currentIndex = 0;
    showPage(pagesArray[currentIndex], currentIndex);
  });

  // 4️⃣ Charger une page
  async function loadPage(file) {
    const res = await fetch(file);
    const text = await res.text();
    const div = document.createElement('div');
    div.innerHTML = text;
    const page = div.firstElementChild;

    page.classList.add('absolute','inset-0','transition','duration-500','ease-in-out','opacity-0','scale-95');
    page.style.pointerEvents='none';
    container.appendChild(page);

    if (page.querySelector('#shop')) {
      import('./shop.js').then(module => {
        module.initShop(); // lance ton script shop
        module.initShopOccasion();
      });
    }

    // Traduire immédiatement
    translatePage(page);

    return page;
  }

  // 5️⃣ Charger toutes les pages
  const pagesArray = [];
  for (let route of routes) {
    const page = await loadPage(route.file);
    pagesArray.push(page);
  }

  // 6️⃣ Afficher une page
  function showPage(targetPage, pageIndex){
    if(isAnimating) return;
    isAnimating = true;

    pagesArray.forEach(p => {
      if(p !== targetPage){
        p.classList.remove('opacity-100','scale-100');
        p.classList.add('opacity-0','scale-95');
        p.style.pointerEvents='none';
      }
    });

    targetPage.classList.remove('opacity-0','scale-95');
    void targetPage.offsetHeight;
    targetPage.classList.add('opacity-100','scale-100');
    targetPage.style.pointerEvents='auto';
    setZoom(pageIndex);

    // Traduire la page active
    translatePage(targetPage);

    setTimeout(()=>{isAnimating=false;},600);
  }

  // 7️⃣ Page par défaut
  showPage(pagesArray[currentIndex], currentIndex);

  // 8️⃣ Clic sur menu
  menuLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();

      // Nouvelle méthode : utilise l'attribut data-route-name
      const routeName = link.getAttribute('data-route-name');
      const pageIndex = routes.findIndex(r => r.name === routeName);

      if(pageIndex !== -1){
        currentIndex = pageIndex;
        showPage(pagesArray[currentIndex], currentIndex);
      }
    });
  });

  // 9️⃣ Scroll pour changer de page
  let scrollDelta = 0;
  window.addEventListener('wheel', e=>{
    if(isAnimating) return;
    scrollDelta += e.deltaY*0.5;
    scrollDelta = Math.max(Math.min(scrollDelta,50),-50);

    if(scrollDelta > 30 && currentIndex < pagesArray.length - 1){
      currentIndex++;
      showPage(pagesArray[currentIndex], currentIndex);
      scrollDelta=0;
    } else if(scrollDelta < -30 && currentIndex > 0){
      currentIndex--;
      showPage(pagesArray[currentIndex], currentIndex);
      scrollDelta=0;
    }

    setTimeout(()=>{scrollDelta=0;},200);
  });

  //Menu-Mobile-------->


  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  const desktopNav = document.getElementById("desktopNav");

// Fonction pour mettre à jour le background selon la taille de l'écran
  function updateMobileMenuBg() {
    if (window.innerWidth < 768) {
      // mobile → blanc
      mobileMenu.style.backgroundColor = "white";
    } else {
      // desktop → transparent
      mobileMenu.style.backgroundColor = "transparent";
    }
  }

// Ouvrir/fermer le menu mobile
  burger?.addEventListener("click", () => {
    const open = !mobileMenu.classList.contains("hidden");
    mobileMenu.classList.toggle("hidden");
    burger.setAttribute("aria-expanded", String(open));

    // Forcer fond blanc si menu ouvert sur mobile
    if (!mobileMenu.classList.contains("hidden") && window.innerWidth < 768) {
      mobileMenu.style.backgroundColor = "white";
    }
  });

// Fermer le menu mobile au clic sur un lien
  const mobileLinks = mobileMenu.querySelectorAll("a");
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      burger.setAttribute("aria-expanded", "false");
    });
  });

// Au redimensionnement : s'assurer que mobileMenu est fermé en desktop et que desktopNav s'affiche
  function onResizeHeader() {
    const w = window.innerWidth;
    if (w >= 768) {
      desktopNav?.classList.remove("hidden");
      if (!mobileMenu.classList.contains("hidden")) mobileMenu.classList.add("hidden");
      burger?.setAttribute("aria-expanded", "false");
    } else {
      desktopNav?.classList.add("hidden");
    }

    // Mettre à jour le background du menu
    updateMobileMenuBg();
  }

  window.addEventListener("resize", onResizeHeader);
  onResizeHeader(); // run at load


});

