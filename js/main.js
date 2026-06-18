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

 
  if (typeof featuredMonth !== "undefined") renderCardBooks("booksGrid", featuredMonth);
  if (typeof newArrivals !== "undefined") renderCardBooks("newArrivalsGrid", newArrivals);
  if (typeof books !== "undefined") renderCardBooks("listBooksGrid", books);
  if (typeof recommendedBooks !== "undefined") renderCardBooks("recommendedGrid", recommendedBooks);
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

document.addEventListener("DOMContentLoaded", initPage);