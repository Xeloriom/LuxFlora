export function initShop() {
  fetch("products.json")
    .then(res => res.json())
    .then(products => {
      const shopContainer = document.getElementById("shop");
      if (!shopContainer) return;

      // ==== Wrapper principal ====
      const shopWrapper = document.createElement("div");
      shopWrapper.className = "w-full flex flex-col items-center relative";
      shopContainer.parentNode.insertBefore(shopWrapper, shopContainer);
      shopWrapper.appendChild(shopContainer);

      shopContainer.className = "grid grid-cols-2 gap-6 sm:grid-cols-1 lg:grid-cols-3 items-start";
      shopContainer.style.minHeight = "480px";

      let currentPage = 1;
      const itemsPerPage = 3;
      let filteredProducts = [...products];

      // ==== Barre recherche + filtre ====
      const searchWrapper = document.createElement("div");
      searchWrapper.className = "mb-8 w-full flex flex-col items-center space-y-4";
      searchWrapper.innerHTML = `
        <div class="flex items-center space-x-4 w-full max-w-lg">
          <div class="relative flex-grow">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5
                     0 1 0 5.196 5.196a7.5 7.5
                     0 0 0 10.607 10.607Z" />
              </svg>
            </span>
            <input id="searchInput" type="text" placeholder="Rechercher un produit..."
              class="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2 shadow-sm
                     focus:outline-none focus:ring-0 focus:border-gray-300 text-gray-900 font-sans"
             />
          </div>

          <div class="relative">
            <button id="filterBtn" class="bg-white border border-gray-200 rounded-full px-4 py-2 flex items-center justify-between w-48 shadow hover:shadow-lg transition font-sans" >
              <span id="filterSelected">Tous</span>
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div id="filterOptions" class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg hidden z-50 flex flex-col"></div>
          </div>
        </div>
      `;
      shopWrapper.insertBefore(searchWrapper, shopContainer);

      // ==== Dropdown filtre ====
      const filterBtn = document.getElementById("filterBtn");
      const filterOptions = document.getElementById("filterOptions");
      const filterSelected = document.getElementById("filterSelected");

      const badges = Array.from(new Set(products.map(p => p.badge).filter(Boolean)));
      badges.unshift("Tous");

      badges.forEach(badge => {
        const option = document.createElement("button");
        option.textContent = badge;
        option.className = "px-4 py-2 text-left hover:bg-gray-100 transition font-sans";
        filterOptions.appendChild(option);

        option.addEventListener("click", () => {
          filterSelected.textContent = badge;
          filterOptions.classList.add("hidden");
          filterProducts();
        });
      });

      filterBtn.addEventListener("click", () => {
        filterOptions.classList.toggle("hidden");
      });

      // ==== Pagination ====
      const pagination = document.createElement("div");
      pagination.className = "flex justify-center items-center space-x-2 mt-8 text-gray-900 font-sans";
      pagination.style.minHeight = "40px";
      shopWrapper.appendChild(pagination);

      function renderPagination() {
        pagination.innerHTML = "";
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

        if (totalPages <= 1) return;

        // Bouton précédent
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "←";
        prevBtn.className = `px-3 py-1 rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}`;
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener("click", () => {
          if (currentPage > 1) {
            currentPage--;
            renderProducts();
          }
        });
        pagination.appendChild(prevBtn);

        // Numéros de pages
        for (let i = 1; i <= totalPages; i++) {
          const pageBtn = document.createElement("button");
          pageBtn.textContent = i;
          pageBtn.className = `px-3 py-1 rounded ${i === currentPage ? "bg-black text-white" : "hover:bg-gray-200"}`;
          pageBtn.addEventListener("click", () => {
            currentPage = i;
            renderProducts();
          });
          pagination.appendChild(pageBtn);
        }

        // Bouton suivant
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "→";
        nextBtn.className = `px-3 py-1 rounded ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}`;
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener("click", () => {
          if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
          }
        });
        pagination.appendChild(nextBtn);
      }

      // ==== Panier slide depuis header ====
      const cart = document.createElement("div");
      cart.id = "cart";
      cart.className = "fixed top-0 right-0 w-96 h-full md:h-screen bg-white border-l border-gray-200 shadow-xl p-6 transform translate-x-full transition-transform duration-300 flex flex-col z-[99999]";
      cart.innerHTML = `
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-900">Mon Panier</h3>
          <button id="closeCart" class="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
        </div>
        <div id="cartItems" class="flex flex-col space-y-4 overflow-y-auto flex-1">
          <span class="text-gray-500 text-center mt-10">Votre panier est vide</span>
        </div>
        <div class="mt-4 border-t border-gray-200 pt-4 flex justify-between items-center text-lg font-semibold text-gray-900">
          <span>Total:</span>
          <span id="cartTotal">0€</span>
        </div>
        <button id="checkoutBtn" class="mt-4 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">Commander</button>
      `;
      document.body.appendChild(cart);

      document.getElementById("checkoutBtn").addEventListener("click", () => {
        window.location.href = "../pages/checkout.html";
      });

      let cartData = JSON.parse(localStorage.getItem("cartData") || "[]");
      updateCartUI();

      const headerCartIcon = document.getElementById("headerCartIcon");
      headerCartIcon.addEventListener("click", () => {
        cart.classList.toggle("translate-x-full");
      });
      document.getElementById("closeCart").addEventListener("click", () => {
        cart.classList.add("translate-x-full");
      });

      function updateCartUI() {
        const cartItems = document.getElementById("cartItems");
        cartItems.innerHTML = "";

        if (cartData.length === 0) {
          cartItems.innerHTML = `<span class="text-gray-500 text-center mt-10">Votre panier est vide</span>`;
        }

        let total = 0;
        cartData.forEach((item, index) => {
          total += item.price;
          const div = document.createElement("div");
          div.className = "flex items-center justify-between  p-3 rounded-lg shadow-sm hover:shadow-md transition";
          div.innerHTML = `
            <img src="${item.image}" class="h-20 w-20 object-cover rounded-lg" alt="${item.name}" />
            <div class="flex-1 flex flex-col justify-center px-2">
              <span class="font-medium text-gray-900 w-50">${item.name}</span>
              <span class="text-gray-700 font-semibold">${item.price}€</span>
            </div>
            <button class="text-red-500 font-bold ml-2 remove-btn text-xl">&times;</button>
          `;
          // 🔥 Supprime uniquement CE produit (par son index)
          div.querySelector(".remove-btn").addEventListener("click", () => {
            cartData.splice(index, 1); // enlève 1 seul élément
            localStorage.setItem("cartData", JSON.stringify(cartData));
            updateCartUI();
          });
          cartItems.appendChild(div);
        });

        document.getElementById("cartTotal").textContent = total.toFixed(2) + "€";
        document.getElementById("cartCountHeader").textContent = cartData.length;
        localStorage.setItem("cartData", JSON.stringify(cartData));
      }

      function renderProducts() {
        shopContainer.innerHTML = "";
        const start = (currentPage - 1) * itemsPerPage;
        const paginatedItems = filteredProducts.slice(start, start + itemsPerPage);

        paginatedItems.forEach(product => {
          const item = document.createElement("div");
          item.className = `
            overflow-hidden hover:shadow-xl transition flex flex-col cursor-pointer
            h-auto sm:h-[400px] md:h-[420px]
          `;

                  const likedKey = `like-${product.id}`;
                  const isLiked = localStorage.getItem(likedKey) === "true";

                  item.innerHTML = `
            <div class="relative w-full h-64 sm:h-56 md:h-64">
              <img src="${product.image}" alt="${product.name}"
                   class="object-contain w-full h-full transition hover:scale-105" />
              ${product.badge ? `<span class="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs rounded-full font-semibold shadow">${product.badge}</span>` : ""}
            </div>

            <div class="flex flex-col flex-grow text-center p-4">
              <h3 class="text-base sm:text-lg md:text-lg text-gray-900 truncate">${product.name}</h3>
              <p class="mt-1 text-lg sm:text-xl md:text-xl text-gray-900">${product.price}€</p>
            </div>

            <div class="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-2 sm:space-y-0 pb-4">
              <button class="flex items-center justify-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition add-to-cart" data-id="${product.id}">
                <span>Panier</span>
              </button>
              <button class="flex items-center justify-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:shadow transition like-btn" data-id="${product.id}">
                <svg class="w-5 h-5 ${isLiked ? "text-red-500" : "text-gray-800"}" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                </svg>
              </button>
            </div>
          `;

          shopContainer.appendChild(item);

          item.querySelector(".add-to-cart").addEventListener("click", () => {
            cartData.push(product);
            updateCartUI();
          });

          item.querySelector(".like-btn").addEventListener("click", () => {
            const currentlyLiked = localStorage.getItem(likedKey) === "true";
            localStorage.setItem(likedKey, !currentlyLiked);
            const icon = item.querySelector(".like-btn svg");
            icon.classList.toggle("text-red-500", !currentlyLiked);
            icon.classList.toggle("text-gray-800", currentlyLiked);
          });
        });

        renderPagination();
      }

      renderProducts();

      function filterProducts() {
        const searchText = document.getElementById("searchInput").value.toLowerCase();
        const selectedBadge = filterSelected.textContent;

        filteredProducts = products.filter(p => {
          const matchSearch = p.name.toLowerCase().includes(searchText);
          const matchBadge = selectedBadge === "Tous" ? true : p.badge === selectedBadge;
          return matchSearch && matchBadge;
        });

        currentPage = 1;
        renderProducts();
      }

      document.getElementById("searchInput").addEventListener("input", filterProducts);

      document.getElementById("ProductHome").addEventListener("click", () => {
        cartData.push(
          {
            "name": "Bouquet de lys blancs",
            "description": "Bouquet raffin\u00e9 de lys blancs purit\u00e9, repr\u00e9sentant la puret\u00e9 et la dignit\u00e9. Parfait pour un cadeau \u00e9l\u00e9gant.",
            "price": 44.50,
            "image": "https://m.media-amazon.com/images/I/611TQlcPT-L._UF1000,1000_QL80_.jpg",
            "category": "Fleurs",
            "badge": ""
          }
        );
        updateCartUI();
      })
    });

}

export function initShopOccasion() {
  fetch("occasions.json")
    .then(res => res.json())
    .then(products => {
      const shopContainer = document.getElementById("shopOccasion");
      if (!shopContainer) return;

      const shopWrapper = document.createElement("div");
      shopWrapper.className = "w-full flex flex-col items-center relative";
      shopContainer.parentNode.insertBefore(shopWrapper, shopContainer);
      shopWrapper.appendChild(shopContainer);

      // Grille compacte
      shopContainer.className = "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start w-full";
      shopContainer.style.minHeight = "400px";

      let currentPage = 1;
      const itemsPerPage = 6;
      let filteredProducts = [...products];

      const pagination = document.createElement("div");
      pagination.className = "flex justify-center items-center space-x-2 mt-4 text-gray-900 font-sans";
      pagination.style.minHeight = "40px";
      shopWrapper.appendChild(pagination);

      function renderPagination() {
        pagination.innerHTML = "";
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        if (totalPages <= 1) return;

        const prevBtn = document.createElement("button");
        prevBtn.textContent = "←";
        prevBtn.className = `px-2 py-1 rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}`;
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener("click", () => { if(currentPage>1){currentPage--; renderProducts();} });
        pagination.appendChild(prevBtn);

        for (let i=1;i<=totalPages;i++){
          const pageBtn = document.createElement("button");
          pageBtn.textContent = i;
          pageBtn.className = `px-2 py-1 rounded ${i===currentPage?"bg-black text-white":"hover:bg-gray-200"}`;
          pageBtn.addEventListener("click", ()=>{currentPage=i; renderProducts();});
          pagination.appendChild(pageBtn);
        }

        const nextBtn = document.createElement("button");
        nextBtn.textContent = "→";
        nextBtn.className = `px-2 py-1 rounded ${currentPage===totalPages?"text-gray-400 cursor-not-allowed":"hover:bg-gray-200"}`;
        nextBtn.disabled = currentPage===totalPages;
        nextBtn.addEventListener("click", ()=>{if(currentPage<totalPages){currentPage++; renderProducts();}});
        pagination.appendChild(nextBtn);
      }

      let cartData = JSON.parse(localStorage.getItem("cartData") || "[]");
      function updateCartUI() {
        const cartItems = document.getElementById("cartItems");
        cartItems.innerHTML = "";
        if(cartData.length===0){cartItems.innerHTML=`<span class="text-gray-500 text-center mt-10">Votre panier est vide</span>`;}
        let total = 0;
        cartData.forEach((item,index)=>{
          total+=item.price;
          const div = document.createElement("div");
          div.className="flex items-center justify-between p-2 rounded-lg shadow-sm hover:shadow-md transition";
          div.innerHTML = `
            <img src="${item.image}" class="h-16 w-16 object-cover rounded-lg" alt="${item.name}" />
            <div class="flex-1 flex flex-col justify-center px-2">
              <span class="font-medium text-gray-900 text-sm truncate">${item.name}</span>
              <span class="text-gray-700 font-semibold text-sm">${item.price}€</span>
            </div>
            <button class="text-red-500 font-bold ml-2 remove-btn text-lg">&times;</button>
          `;
          div.querySelector(".remove-btn").addEventListener("click",()=>{cartData.splice(index,1); localStorage.setItem("cartData",JSON.stringify(cartData)); updateCartUI();});
          cartItems.appendChild(div);
        });
        document.getElementById("cartTotal").textContent = total.toFixed(2)+"€";
        document.getElementById("cartCountHeader").textContent = cartData.length;
        localStorage.setItem("cartData",JSON.stringify(cartData));
      }

      function renderProducts() {
        shopContainer.innerHTML = "";
        const start = (currentPage - 1) * itemsPerPage;
        const paginatedItems = filteredProducts.slice(start, start + itemsPerPage);

        paginatedItems.forEach(product => {
          const likedKey = `like-${product.id}`;
          const isLiked = localStorage.getItem(likedKey) === "true"; // ✅ Définition de isLiked

          const item = document.createElement("div");
          item.className = "overflow-hidden hover:shadow-lg transition flex flex-col";
          item.innerHTML = `
      <div class="relative w-full h-40 cursor-pointer">
        <img src="${product.image}" alt="${product.name}" class="object-contain w-full h-full" />
        ${product.badge ? `<span class="absolute top-1 left-1 bg-black text-white px-1 py-0.5 text-xs rounded-full font-semibold shadow">${product.badge}</span>` : ""}
      </div>
      <div class="flex flex-col flex-grow text-center p-2">
        <h3 class="text-xl  truncate">${product.name}</h3>
        <p class="mt-1 text-lg text-black">${product.price}€</p>
      </div>
      <div class="flex justify-center space-x-2 p-2">
        <button class="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition add-to-cart" data-id="${product.id}">
          <span>Panier</span>
        </button>
        <button class="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:shadow transition like-btn" data-id="${product.id}">
          <svg class="w-5 h-5 ${isLiked ? "text-red-500" : "text-gray-800"}" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
          </svg>
        </button>
      </div>
    `;
          shopContainer.appendChild(item);

          // Ajout au panier
          item.querySelector(".add-to-cart").addEventListener("click", () => {
            cartData.push(product);
            updateCartUI();
          });

          // ❤️ Fonctionnalité Like
          item.querySelector(".like-btn").addEventListener("click", () => {
            const currentlyLiked = localStorage.getItem(likedKey) === "true";
            localStorage.setItem(likedKey, !currentlyLiked);
            const icon = item.querySelector(".like-btn svg");
            icon.classList.toggle("text-red-500", !currentlyLiked);
            icon.classList.toggle("text-gray-800", currentlyLiked);
          });
        });

        renderPagination();
      }

      renderProducts();
    });
}

