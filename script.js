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

  // --- ПОИСК С ПОДСКАЗКАМИ ---
  // Вставляем иконку поиска в .search-box-wrap
  const searchBoxWrap = document.querySelector('.search-box-wrap');
  let searchIconBtn = null;
  if (searchBoxWrap) {
    searchIconBtn = document.createElement('button');
    searchIconBtn.className = 'search-btn';
    searchIconBtn.setAttribute('aria-label', 'Search');
    searchIconBtn.innerHTML = '<svg class="search-icon" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7" /><line x1="18" y1="18" x2="15.5" y2="15.5" /></svg>';
    searchBoxWrap.appendChild(searchIconBtn);
  }
  const searchInput = document.getElementById('searchInputBox');
  const searchSuggestions = document.getElementById('searchSuggestions');

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
  // Клик вне поиска — скрыть
  document.addEventListener('mousedown', function(e) {
    if (searchInput && searchInput.style.display === 'block') {
      if (!searchBoxWrap.contains(e.target)) {
        hideSearchInput();
      }
    }
  });
  // Esc — скрыть
  if (searchInput) {
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        hideSearchInput();
      }
    });
  }
  // Поиск по мере ввода
  if (searchInput && searchSuggestions) {
    searchInput.addEventListener('input', function() {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
        searchSuggestions.style.display = 'none';
        searchSuggestions.innerHTML = '';
        return;
      }
      const cards = Array.from(document.querySelectorAll('.product-card'));
      const matches = cards.filter(card => {
        const title = card.querySelector('.product-title');
        return title && title.textContent.toLowerCase().includes(query);
      });
      if (matches.length === 0) {
        searchSuggestions.innerHTML = '<div class="search-suggestion-item">No results</div>';
        searchSuggestions.style.display = 'block';
        return;
      }
      searchSuggestions.innerHTML = matches.map(card => {
        const title = card.querySelector('.product-title').textContent;
        return `<div class="search-suggestion-item">${title}</div>`;
      }).join('');
      searchSuggestions.style.display = 'block';
    });
    // Клик по подсказке
    searchSuggestions.addEventListener('mousedown', function(e) {
      if (e.target.classList.contains('search-suggestion-item')) {
        const text = e.target.textContent;
        searchInput.value = text;
        // Показать только выбранную карточку
        const cards = Array.from(document.querySelectorAll('.product-card'));
        let found = false;
        cards.forEach(card => {
          const title = card.querySelector('.product-title');
          if (title && title.textContent === text) {
            card.style.display = '';
            found = true;
          } else {
            card.style.display = 'none';
          }
        });
        if (!found) alert('Ничего не найдено');
        searchSuggestions.style.display = 'none';
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
          items[suggestionIndex].dispatchEvent(new MouseEvent('mousedown'));
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
}); 