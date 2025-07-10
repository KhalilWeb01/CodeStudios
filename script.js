// ===== SIDEBAR NAVIGATION =====
const sidebar = document.getElementById('sidebar');
const openSidebarBtn = document.getElementById('openSidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');

if (sidebar && openSidebarBtn && closeSidebarBtn) {
  openSidebarBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
  });
  closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
  });
  // Закрытие по клику вне меню
  document.addEventListener('click', (e) => {
    if (
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      e.target !== openSidebarBtn
    ) {
      sidebar.classList.remove('open');
    }
  });
}

// ===== PRODUCT TOOLBAR INTERACTIONS =====

document.addEventListener('DOMContentLoaded', function() {
  // --- ФИЛЬТР ---
  const filterBtn = document.querySelector('.toolbar-filter');
  const filterModal = document.getElementById('filterModal');
  const closeFilterBtn = document.getElementById('closeFilterBtn');
  const applyFilterBtn = document.getElementById('applyFilterBtn');
  const resetFilterBtn = document.getElementById('resetFilterBtn');
  const filterColorsForm = document.getElementById('filterColorsForm');

  let activeColors = [];
  let searchQuery = '';
  let sortOrder = null; // null: popular, 'asc': по возрастанию, 'desc': по убыванию

  function showFilterModal() {
    filterModal.style.display = 'flex';
  }
  function hideFilterModal() {
    filterModal.style.display = 'none';
  }
  if (filterBtn && filterModal) {
    filterBtn.addEventListener('click', showFilterModal);
  }
  if (closeFilterBtn) {
    closeFilterBtn.addEventListener('click', hideFilterModal);
  }
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', function() {
      filterColorsForm.reset();
      activeColors = [];
      filterAndRender();
      hideFilterModal();
    });
  }
  if (applyFilterBtn) {
    applyFilterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const checked = filterColorsForm.querySelectorAll('input[type="checkbox"]:checked');
      activeColors = Array.from(checked).map(cb => cb.value);
      filterAndRender();
      hideFilterModal();
    });
  }

  // --- ПОИСК С ПОДСКАЗКАМИ НА product.html ---
  const searchBoxWrap = document.querySelector('.search-box-wrap');
  let searchIconBtn = document.querySelector('.search-btn');
  const searchInput = document.getElementById('searchInputBox');
  const searchSuggestions = document.getElementById('searchSuggestions');
  let allProducts = [];

  async function loadAllProducts() {
    try {
      const res = await fetch('products.json');
      allProducts = await res.json();
    } catch { allProducts = []; }
  }
  loadAllProducts();

  function showSearchInput() {
    if (searchInput) {
      searchInput.style.display = 'block';
      searchInput.value = '';
      searchInput.focus();
    }
    if (searchSuggestions) {
      searchSuggestions.style.display = 'none';
      searchSuggestions.innerHTML = '';
    }
    if (searchIconBtn) searchIconBtn.style.display = 'none';
  }
  function hideSearchInput() {
    if (searchInput) searchInput.style.display = 'none';
    if (searchSuggestions) {
      searchSuggestions.style.display = 'none';
      searchSuggestions.innerHTML = '';
    }
    if (searchIconBtn) searchIconBtn.style.display = 'block';
  }
  if (searchIconBtn && searchInput) {
    searchIconBtn.addEventListener('click', showSearchInput);
  }
  document.addEventListener('mousedown', function(e) {
    if (searchInput && searchInput.style.display === 'block') {
      if (!searchBoxWrap.contains(e.target)) {
        hideSearchInput();
      }
    }
  });
  if (searchInput) {
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') hideSearchInput();
    });
  }
  if (searchInput && searchSuggestions) {
    searchInput.addEventListener('input', function() {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
        searchSuggestions.style.display = 'none';
        searchSuggestions.innerHTML = '';
        return;
      }
      const matches = allProducts.filter(p => p.title.toLowerCase().includes(query));
      if (matches.length === 0) {
        searchSuggestions.innerHTML = '<div class="search-suggestion-item">No results</div>';
        searchSuggestions.style.display = 'block';
        return;
      }
      searchSuggestions.innerHTML = matches.map(p =>
        `<div class="search-suggestion-item" data-id="${p.id}">${p.title}</div>`
      ).join('');
      searchSuggestions.style.display = 'block';
    });
    searchSuggestions.addEventListener('mousedown', function(e) {
      if (e.target.classList.contains('search-suggestion-item')) {
        const id = e.target.getAttribute('data-id');
        if (id) window.location.href = `product.html?id=${id}`;
        hideSearchInput();
      }
    });
    // Навигация по подсказкам клавишами
    let suggestionIndex = -1;
    searchInput.addEventListener('keydown', function(e) {
      const items = Array.from(searchSuggestions.querySelectorAll('.search-suggestion-item'));
      if (!items.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        suggestionIndex = (suggestionIndex + 1) % items.length;
        items.forEach((item, i) => item.classList.toggle('active', i === suggestionIndex));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        suggestionIndex = (suggestionIndex - 1 + items.length) % items.length;
        items.forEach((item, i) => item.classList.toggle('active', i === suggestionIndex));
      } else if (e.key === 'Enter') {
        if (suggestionIndex >= 0 && suggestionIndex < items.length) {
          const id = items[suggestionIndex].getAttribute('data-id');
          if (id) window.location.href = `product.html?id=${id}`;
          hideSearchInput();
        }
      } else {
        suggestionIndex = -1;
        items.forEach(item => item.classList.remove('active'));
      }
    });
  }

  // --- СОРТИРОВКА ---
  const sortBtn = document.querySelector('.toolbar-sort-label');
  const priceBtn = document.querySelector('.toolbar-price');
  const sortActive = document.querySelector('.toolbar-sort-active');
  function updateSortVisuals() {
    if (sortOrder === null) {
      if (sortActive) sortActive.classList.add('active');
      if (priceBtn) priceBtn.classList.remove('active');
      if (priceBtn) priceBtn.querySelector('.toolbar-price-arrows').textContent = '⇅';
    } else if (sortOrder === 'asc') {
      if (sortActive) sortActive.classList.remove('active');
      if (priceBtn) priceBtn.classList.add('active');
      if (priceBtn) priceBtn.querySelector('.toolbar-price-arrows').textContent = '↑';
    } else if (sortOrder === 'desc') {
      if (sortActive) sortActive.classList.remove('active');
      if (priceBtn) priceBtn.classList.add('active');
      if (priceBtn) priceBtn.querySelector('.toolbar-price-arrows').textContent = '↓';
    }
  }
  if (sortBtn) {
    sortBtn.addEventListener('click', function() {
      sortOrder = null;
      filterAndRender();
      updateSortVisuals();
    });
  }
  if (priceBtn) {
    priceBtn.addEventListener('click', function() {
      if (sortOrder === 'asc') sortOrder = 'desc';
      else sortOrder = 'asc';
      filterAndRender();
      updateSortVisuals();
    });
  }
  // При первом запуске — выставить визуализацию
  updateSortVisuals();

  // --- ФИЛЬТРАЦИЯ, СОРТИРОВКА, ПОИСК ---
  function filterAndRender() {
    const cards = Array.from(document.querySelectorAll('.product-card'));
    // Сохраняем оригинальный порядок для popular
    cards.forEach((card, i) => { card.dataset.originalIndex = i; });
    let filtered = cards;
    // Поиск
    if (searchQuery) {
      filtered = filtered.filter(card => {
        const title = card.querySelector('.product-title');
        return title && title.textContent.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    // Фильтр по цвету
    if (activeColors.length > 0) {
      filtered = filtered.filter(card => {
        const dots = Array.from(card.querySelectorAll('.color-dot'));
        return dots.some(dot => activeColors.includes(dot.style.background));
      });
    }
    // Сортировка
    if (sortOrder === 'asc' || sortOrder === 'desc') {
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.product-price')?.textContent || '0');
        const priceB = parseFloat(b.querySelector('.product-price')?.textContent || '0');
        return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
      });
    } else {
      // popular: вернуть исходный порядок
      filtered.sort((a, b) => a.dataset.originalIndex - b.dataset.originalIndex);
    }
    // Скрыть все, показать только отфильтрованные
    cards.forEach(card => { card.style.display = 'none'; });
    filtered.forEach(card => { card.style.display = ''; });
    // Если ничего не найдено
    if (filtered.length === 0) {
      alert('Ничего не найдено');
    }
  }

  // Сброс поиска по двойному клику на Most Popular
  if (sortActive) {
    sortActive.addEventListener('dblclick', function() {
      searchQuery = '';
      filterAndRender();
    });
  }

  // Клик вне модалки — закрыть
  window.addEventListener('mousedown', function(e) {
    if (filterModal && filterModal.style.display !== 'none' && !filterModal.contains(e.target) && !e.target.closest('.toolbar-filter')) {
      hideFilterModal();
    }
  });

  // === PROMO SLIDER ===
  const slider = document.getElementById('promoSlider');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.promo-slide'));
    slides.forEach(slide => {
      const bg = slide.getAttribute('data-bg');
      if (bg) slide.style.backgroundImage = `url('${bg}')`;
    });
    const dotsWrap = document.getElementById('promoSliderDots');
    let current = 0;
    let autoTimer = null;

    function showSlide(idx) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === idx);
      });
      if (dotsWrap) {
        Array.from(dotsWrap.children).forEach((dot, i) => {
          dot.classList.toggle('active', i === idx);
        });
      }
      current = idx;
    }
    function nextSlide() {
      showSlide((current + 1) % slides.length);
    }
    function prevSlide() {
      showSlide((current - 1 + slides.length) % slides.length);
    }
    // Dots
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'promo-slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', () => showSlide(i));
        dotsWrap.appendChild(dot);
      });
    }
    // Auto (4 секунды)
    function startAuto() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = setInterval(nextSlide, 4000);
    }
    slider.addEventListener('mouseenter', () => clearInterval(autoTimer));
    slider.addEventListener('mouseleave', startAuto);
    startAuto();
    // Swipe (touch)
    let touchStartX = null;
    slider.addEventListener('touchstart', function(e) {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
      }
    });
    slider.addEventListener('touchend', function(e) {
      if (touchStartX === null) return;
      const touchEndX = e.changedTouches[0].clientX;
      const dx = touchEndX - touchStartX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) nextSlide();
        else prevSlide();
      }
      touchStartX = null;
    });
    // Таймеры
    function updateTimers() {
      slides.forEach(slide => {
        const timer = slide.querySelector('.promo-slide-timer');
        if (!timer) return;
        const deadline = timer.getAttribute('data-deadline');
        if (!deadline) return;
        const end = new Date(deadline);
        const now = new Date();
        let diff = Math.floor((end - now) / 1000);
        if (diff < 0) diff = 0;
        const d = Math.floor(diff / 86400);
        const h = Math.floor((diff % 86400) / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        timer.textContent =
          (d > 0 ? d + 'd ' : '') +
          (h < 10 ? '0' : '') + h + ':' +
          (m < 10 ? '0' : '') + m + ':' +
          (s < 10 ? '0' : '') + s +
          ' left';
      });
    }
    updateTimers();
    setInterval(updateTimers, 1000);
  }
}); 