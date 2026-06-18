function loadComponent(selector, filePath) {
  if (!document.querySelector(selector)) {
    return Promise.resolve(); 
  }

  return fetch(filePath)
    .then((response) => {
      if (!response.ok) throw new Error(`Không thể tải file: ${filePath}`);
      return response.text();
    })
    .then((html) => {
      document.querySelector(selector).innerHTML = html;
    })
    .catch((error) => console.error(`Lỗi load ${filePath}:`, error));
}

let currentGenre = "All";
let currentSort = "Featured";
let currentSlide = 0;



async function initPage() {
 
  await loadComponent("#navbar-container", "./components/navbar.html");
  await loadComponent("#footer-container", "./components/footer.html");
  await loadComponent("#login-modal-container", "./components/login-modal.html");

  
  await loadComponent("#hero-carousel-container", "./components/hero-carousel.html");
  await loadComponent("#browse-by-genre-container", "./components/pages/home/browse-by-genre.html");
  await loadComponent("#featured-month-container", "./components/pages/home/featured-month.html");
  await loadComponent("#reading-room-container", "./components/pages/home/reading-room.html");
  await loadComponent("#new-arrival-container", "./components/pages/home/new-arrival.html");

  
  await loadComponent("#breadcrumb-placeholder", "./components/pages/bag/breadcrumb.html");
  await loadComponent("#cart-items-placeholder", "./components/pages/bag/cart-item.html");
  await loadComponent("#order-summary-placeholder", "./components/pages/bag/order-summary.html");

 
  setupLoginModal();
  setupMobileMenu();
  setupHeroCarousel();
  renderFilters();
  setupFilters();
 
  if (typeof featuredMonth !== "undefined") renderCardBooks("booksGrid", featuredMonth);
  if (typeof newArrivals !== "undefined") renderCardBooks("newArrivalsGrid", newArrivals);
  if (typeof books !== "undefined")
    updateBooks();
  if (typeof recommendedBooks !== "undefined") renderCardBooks("recommendedGrid", recommendedBooks);
  if (typeof cartItems !== "undefined") {
  renderCart();
}
}


function renderCardBooks(gridId, data) {
  const booksGrid = document.getElementById(gridId);
  if (!booksGrid || !data) return;

  booksGrid.innerHTML = data
    .map(
      (book) => `
        <a href="./book-detail.html?id=${book.id}" class="book-link">
          <div class="book-card">
            <div class="book-cover" style="background:${book.color || '#3D5546'}">
              ${book.badge ? `<span class="book-badge ${book.badge.toLowerCase()}">${book.badge}</span>` : ""}
              <h4 class="book-title-cover">${book.title}</h4>
              <p class="book-author-cover">${book.author}</p>
            </div>
            <h5 class="book-title">${book.title}</h5>
            <p class="book-author">${book.author}</p>
            <div class="book-footer">
              <p class="book-price">
                $${(book.price || book.priceCurrent).toFixed(2)}
                ${book.oldPrice || book.priceOld ? `<span class="old-price">$${(book.oldPrice || book.priceOld).toFixed(2)}</span>` : ""}
              </p>
              <span class="book-rating">★ ${book.rating}</span>
            </div>
          </div>
        </a>
      `
    )
    .join("");
}

function renderFilters() {
  const filtersContainer = document.getElementById("filtersContainer");

  if (!filtersContainer || typeof books === "undefined") return;

  const genres = ["All", ...new Set(books.map((book) => book.genre))];

  filtersContainer.innerHTML = genres
    .map(
      (genre) => `
        <button
          class="filter-btn ${genre === "All" ? "is-active" : ""}"
          type="button"
          data-genre="${genre}"
        >
          ${genre}
        </button>
      `
    )
    .join("");
}

function renderHero() {
  if (typeof heroSlides === "undefined") return;

  const slide = heroSlides[currentSlide];

  document.getElementById("heroSubtitle").textContent =
    slide.subtitle;

  document.getElementById("heroTitle").textContent =
    slide.title;

  document.getElementById("heroDescription").textContent =
    slide.description;

  document.getElementById("heroButton").textContent =
    slide.buttonText;

  document.getElementById("heroContainer").style.background =
    slide.background;

  renderDots();
}

function renderDots() {
  const pagination =
    document.getElementById("heroPagination");

  pagination.innerHTML = heroSlides
    .map(
      (_, index) => `
      <span
        class="dot ${index === currentSlide ? "active" : ""}"
        data-index="${index}"
      ></span>
    `
    )
    .join("");
}

function renderCart() {
  const container = document.getElementById("cart-items-placeholder");

  if (!container || typeof cartItems === "undefined") return;

  container.innerHTML = cartItems
    .map(
      (item) => `
      <div class="cart-item" data-id="${item.id}">
        <div class="item-details">
          <div
            class="book-thumbnail"
            style="background:${item.color}"
          ></div>

          <div class="item-info">
            <div>
              <h3 class="item-title">${item.title}</h3>
              <p class="item-author">${item.author}</p>
            </div>

            <button
              class="remove-btn"
              data-id="${item.id}"
            >
              Remove
            </button>
          </div>
        </div>

        <div class="item-actions">
          <div class="quantity-selector">
            <button class="decrease-btn" data-id="${item.id}">
              -
            </button>

            <span>${item.quantity}</span>

            <button class="increase-btn" data-id="${item.id}">
              +
            </button>
          </div>

          <div class="item-price">
            $${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      </div>
    `
    )
    .join("");

  renderOrderSummary();
}

function renderOrderSummary() {
  const summary = document.getElementById(
    "order-summary-placeholder"
  );

  if (!summary) return;

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  summary.innerHTML = `
    <div class="order-summary-card">
      <h2 class="summary-title">
        Order summary
      </h2>

      <div class="summary-rows">
        <div class="summary-row">
          <span class="label">
            Subtotal (${totalItems} items)
          </span>

          <span class="value">
            $${subtotal.toFixed(2)}
          </span>
        </div>

        <div class="summary-row">
          <span class="label">Shipping</span>
          <span class="value value--free">
            Free
          </span>
        </div>
      </div>

      <div class="summary-total-section">
        <div class="total-row">
          <span class="total-label">
            Total
          </span>

          <span class="total-price">
            $${subtotal.toFixed(2)}
          </span>
        </div>
      </div>

      <button class="checkout-btn">
        Checkout
      </button>

      <p class="checkout-note">
        You'll be asked to sign in to complete your order.
      </p>
    </div>
  `;
}


function setupLoginModal() {
 
  document.addEventListener('click', function(e) {
    const openBtn = e.target.closest('#openLoginBtn');
    if (openBtn) {

      e.preventDefault();

      const loginModal = document.getElementById('loginModal');

      if (loginModal) {
        loginModal.classList.add('active');
      }
    }
  });

 
  document.addEventListener('click', function(e) {
    const closeBtn = e.target.closest('.modal-close');
    if (closeBtn) {
      const loginModal = document.getElementById('loginModal');
      if (loginModal) loginModal.classList.remove('active');
    }
  });


  document.addEventListener('click', function(e) {
    const loginModal = document.getElementById('loginModal');
    if (loginModal && e.target === loginModal) {
      loginModal.classList.remove('active');
    }
  });
}

function setupMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileActions = document.getElementById("mobileActions");

  if (!menuToggle || !mobileMenu || !mobileActions) return;

  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    mobileActions.classList.toggle("active");

    menuToggle.textContent =
      mobileMenu.classList.contains("active") ? "✕" : "☰";
  });
}

function setupHeroCarousel() {
  if (!document.getElementById("heroContainer")) return;
  const prevBtn = document.querySelector(
    ".hero-arrow-prev"
  );

  const nextBtn = document.querySelector(
    ".hero-arrow-next"
  );

  prevBtn?.addEventListener("click", () => {
    currentSlide =
      (currentSlide - 1 + heroSlides.length) %
      heroSlides.length;

    renderHero();
  });

  nextBtn?.addEventListener("click", () => {
    currentSlide =
      (currentSlide + 1) %
      heroSlides.length;

    renderHero();
  });

  document.addEventListener("click", (e) => {
    const dot = e.target.closest(".dot");

    if (!dot) return;

    currentSlide = Number(dot.dataset.index);

    renderHero();
  });

  renderHero();
  setInterval(() => {
  currentSlide =
    (currentSlide + 1) %
    heroSlides.length;

  renderHero();
}, 5000);
}



function updateBooks() {
  if (typeof books === "undefined") return;

  let filteredBooks = [...books];

  // Filter
  if (currentGenre !== "All") {
    filteredBooks = filteredBooks.filter(
      (book) => book.genre === currentGenre
    );
  }

  // Sort
  switch (currentSort) {
    case "Price: Low to High":
      filteredBooks.sort((a, b) => a.price - b.price);
      break;

    case "Price: High to Low":
      filteredBooks.sort((a, b) => b.price - a.price);
      break;

    case "Newest":
      filteredBooks.sort((a, b) => b.id - a.id);
      break;
  }

  renderCardBooks("listBooksGrid", filteredBooks);
}

function setupFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const sortSelect = document.getElementById("sort");

  if (!filterButtons.length || !sortSelect) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) =>
        btn.classList.remove("is-active")
      );

      button.classList.add("is-active");

      currentGenre = button.textContent.trim();

      updateBooks();
    });
  });

  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;

    updateBooks();
  });
}

document.addEventListener("click", (e) => {
  const increaseBtn = e.target.closest(".increase-btn");
  const decreaseBtn = e.target.closest(".decrease-btn");
  const removeBtn = e.target.closest(".remove-btn");

  if (increaseBtn) {
    const id = Number(increaseBtn.dataset.id);

    const item = cartItems.find(
      (item) => item.id === id
    );

    item.quantity++;

    renderCart();
  }

  if (decreaseBtn) {
    const id = Number(decreaseBtn.dataset.id);

    const item = cartItems.find(
      (item) => item.id === id
    );

    if (item.quantity > 1) {
      item.quantity--;
    }

    renderCart();
  }

  if (removeBtn) {
    const id = Number(removeBtn.dataset.id);

    const index = cartItems.findIndex(
      (item) => item.id === id
    );

    if (index !== -1) {
      cartItems.splice(index, 1);
    }

    renderCart();
  }
});

document.addEventListener("DOMContentLoaded", initPage);