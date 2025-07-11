document.addEventListener('DOMContentLoaded', function() {
  const burger = document.getElementById('burgerMenu');
  const sidebar = document.querySelector('.sidebar');
  if (burger && sidebar) {
    burger.addEventListener('click', function() {
      sidebar.classList.toggle('open');
    });
  }
});

document.querySelector(".jsFilter").addEventListener("click", function () {
  document.querySelector(".filter-menu").classList.toggle("active");
});

document.querySelector(".grid").addEventListener("click", function () {
  document.querySelector(".list").classList.remove("active");
  document.querySelector(".grid").classList.add("active");
  document.querySelector(".products-area-wrapper").classList.add("gridView");
  document
    .querySelector(".products-area-wrapper")
    .classList.remove("tableView");
});

document.querySelector(".list").addEventListener("click", function () {
  document.querySelector(".list").classList.add("active");
  document.querySelector(".grid").classList.remove("active");
  document.querySelector(".products-area-wrapper").classList.remove("gridView");
  document.querySelector(".products-area-wrapper").classList.add("tableView");
});

var modeSwitch = document.querySelector('.mode-switch');
modeSwitch.addEventListener('click', function () {                      document.documentElement.classList.toggle('light');
 modeSwitch.classList.toggle('active');
});

// SPA logic for sidebar
function hideAllSections() {
  document.querySelectorAll('.dashboard-section').forEach(section => {
    section.style.display = 'none';
  });
}
function setActiveSidebarItem(activeItem) {
  document.querySelectorAll('.sidebar-list-item').forEach(item => item.classList.remove('active'));
  activeItem.classList.add('active');
}
document.querySelectorAll('.sidebar-list-item').forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    const section = item.getAttribute('data-section');
    if (!section) return;
    hideAllSections();
    const sectionDiv = document.getElementById('section-' + section);
    if (sectionDiv) sectionDiv.style.display = '';
    setActiveSidebarItem(item);
  });
});
// Show home by default
hideAllSections();
const homeSection = document.getElementById('section-home');
if (homeSection) homeSection.style.display = '';
// Profile logic
function getProfile() {
  const data = localStorage.getItem('userProfile');
  if (!data) return { firstName: '', lastName: '', email: '', phone: '' };
  return JSON.parse(data);
}
function setProfile(profile) {
  localStorage.setItem('userProfile', JSON.stringify(profile));
}
function updateProfileUI() {
  const { firstName, lastName, email, phone } = getProfile();
  document.getElementById('profileFirstName').value = firstName || '';
  document.getElementById('profileLastName').value = lastName || '';
  document.getElementById('profileEmail').value = email || '';
  document.getElementById('profilePhone').value = phone || '';
}
const profileForm = document.getElementById('profileForm');
if (profileForm) {
  updateProfileUI();
  profileForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const firstName = document.getElementById('profileFirstName').value.trim();
    const lastName = document.getElementById('profileLastName').value.trim();
    const email = document.getElementById('profileEmail').value.trim();
    const phone = document.getElementById('profilePhone').value.trim();
    setProfile({ firstName, lastName, email, phone });
    updateProfileUI();
    const msg = document.getElementById('profileSaveMsg');
    if (msg) {
      msg.style.display = 'inline';
      setTimeout(() => { msg.style.display = 'none'; }, 2000);
    }
  });
}

// --- Add Product Modal Logic ---
const openAddProductModalBtn = document.getElementById('openAddProductModal');
const addProductModal = document.getElementById('addProductModal');
const closeAddProductModalBtn = document.getElementById('closeAddProductModal');
if (openAddProductModalBtn && addProductModal && closeAddProductModalBtn) {
  openAddProductModalBtn.addEventListener('click', () => {
    addProductModal.style.display = 'flex';
  });
  closeAddProductModalBtn.addEventListener('click', () => {
    addProductModal.style.display = 'none';
  });
  addProductModal.addEventListener('click', (e) => {
    if (e.target === addProductModal) addProductModal.style.display = 'none';
  });
}
// --- Add Product Form Logic ---
function getProducts() {
  const data = localStorage.getItem('products');
  if (!data) return [];
  return JSON.parse(data);
}
function setProducts(products) {
  localStorage.setItem('products', JSON.stringify(products));
}
function generateProductId() {
  return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
function migrateExistingProducts() {
  const products = getProducts();
  let needsUpdate = false;
  products.forEach(product => {
    if (!product.id) {
      product.id = generateProductId();
      needsUpdate = true;
    }
  });
  if (needsUpdate) {
    setProducts(products);
  }
}
function addDemoProducts() {
  const products = getProducts();
  if (products.length === 0) {
    const demoProducts = [
      {
        id: generateProductId(),
        name: "Classic White T-Shirt",
        price: 45.00,
        oldPrice: 65.00,
        description: "Premium cotton classic white t-shirt with comfortable fit.",
        colors: ["#ffffff", "#000000", "#808080"],
        quantity: 25,
        category: "tshirt",
        rating: 4.5,
        photos: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80"]
      },
      {
        id: generateProductId(),
        name: "Oversized Black Tee",
        price: 55.00,
        oldPrice: 75.00,
        description: "Trendy oversized black t-shirt perfect for casual wear.",
        colors: ["#000000", "#333333"],
        quantity: 18,
        category: "tshirt",
        rating: 4.8,
        photos: ["https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=400&q=80"]
      },
      {
        id: generateProductId(),
        name: "Striped Summer Tee",
        price: 35.00,
        description: "Lightweight striped t-shirt perfect for summer days.",
        colors: ["#0000ff", "#ff0000", "#00ff00"],
        quantity: 30,
        category: "tshirt",
        rating: 4.2,
        photos: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80"]
      },
      {
        id: generateProductId(),
        name: "Premium Cotton V-Neck",
        price: 65.00,
        oldPrice: 85.00,
        description: "High-quality cotton v-neck t-shirt with elegant design.",
        colors: ["#ffffff", "#000000", "#8B4513"],
        quantity: 15,
        category: "tshirt",
        rating: 4.7,
        photos: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=400&q=80"]
      },
      {
        id: generateProductId(),
        name: "Classic Black Trousers",
        price: 89.99,
        oldPrice: 129.99,
        description: "Elegant black trousers perfect for formal occasions.",
        colors: ["#000000", "#333333", "#666666"],
        quantity: 20,
        category: "trousers",
        rating: 4.6,
        photos: ["https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80"]
      },
      {
        id: generateProductId(),
        name: "Casual Summer Shorts",
        price: 49.99,
        oldPrice: 79.99,
        description: "Comfortable summer shorts for casual wear.",
        colors: ["#ffffff", "#000000", "#808080"],
        quantity: 35,
        category: "shorts",
        rating: 4.3,
        photos: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"]
      },
      {
        id: generateProductId(),
        name: "Sport Running Shoes",
        price: 129.99,
        oldPrice: 189.99,
        description: "High-performance running shoes for athletes.",
        colors: ["#ffffff", "#000000", "#ff0000"],
        quantity: 15,
        category: "shoes",
        rating: 4.9,
        photos: ["https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80"]
      }
    ];
    setProducts(demoProducts);
  }
}
function renderProducts() {
  const wrapper = document.querySelector('#section-product .products-area-wrapper');
  if (!wrapper) return;
  const products = getProducts();
  let html = '';
  html += `<div class="products-header">
    <div class="product-cell image">Items<button class="sort-button"></button></div>
    <div class="product-cell category">Category<button class="sort-button"></button></div>
    <div class="product-cell sizes">Sizes<button class="sort-button"></button></div>
    <div class="product-cell status-cell">Status<button class="sort-button"></button></div>
    <div class="product-cell sales">Sales<button class="sort-button"></button></div>
    <div class="product-cell stock">Stock<button class="sort-button"></button></div>
    <div class="product-cell price">Price<button class="sort-button"></button></div>
    <div class="product-cell actions">Actions</div>
  </div>`;
  products.forEach((product, idx) => {
    html += `<div class="products-row">
      <button class="cell-more-button"></button>
      <div class="product-cell image">
        ${(product.photos && product.photos[0]) ? `<img src="${product.photos[0]}" alt="product" style="max-width:60px;max-height:60px;margin:2px;">` : ''}
        <span>${product.name}</span>
      </div>
      <div class="product-cell category"><span class="cell-label">Category:</span>${product.category}</div>
      <div class="product-cell sizes"><span class="cell-label">Sizes:</span>${(product.sizes||[]).join(', ')}</div>
      <div class="product-cell status-cell"><span class="cell-label">Status:</span><span class="status active">Active</span></div>
      <div class="product-cell sales"><span class="cell-label">Sales:</span>0</div>
      <div class="product-cell stock"><span class="cell-label">Stock:</span>${product.quantity}</div>
      <div class="product-cell price"><span class="cell-label">Price:</span>${product.price} AED${product.oldPrice ? ` <span style='text-decoration:line-through;color:#888;'>${product.oldPrice} AED</span>` : ''}</div>
      <div class="product-cell actions">
        <button class="edit-product-btn" data-idx="${idx}" style="margin-right:8px;">✏️</button>
        <button class="delete-product-btn" data-idx="${idx}">🗑️</button>
      </div>
    </div>`;
  });
  wrapper.innerHTML = html;
  // Delete logic
  wrapper.querySelectorAll('.delete-product-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      const products = getProducts();
      products.splice(idx, 1);
      setProducts(products);
      renderProducts();
    });
  });
  // Edit logic
  wrapper.querySelectorAll('.edit-product-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      const products = getProducts();
      const product = products[idx];
      // Открыть модалку и заполнить поля
      addProductModal.style.display = 'flex';
      document.getElementById('productName').value = product.name;
      document.getElementById('productPrice').value = product.price;
      document.getElementById('productOldPrice').value = product.oldPrice || '';
      document.getElementById('productDiscount').value = '';
      document.getElementById('productDescription').value = product.description;
      document.getElementById('productColor').value = (product.colors||[]).join(',');
      document.getElementById('productSize').value = (product.sizes||[]).join(',');
      document.getElementById('productQuantity').value = product.quantity;
      document.getElementById('productCategory').value = product.category;
      document.getElementById('productRating').value = product.rating || '';
      // При сабмите заменить товар
      addProductForm.onsubmit = function(e) {
        e.preventDefault();
        const files = document.getElementById('productPhotos').files;
        const name = document.getElementById('productName').value.trim();
        const price = parseFloat(document.getElementById('productPrice').value);
        const oldPrice = parseFloat(document.getElementById('productOldPrice').value) || null;
        const discount = null;
        const description = document.getElementById('productDescription').value.trim();
        const colorRaw = document.getElementById('productColor').value.trim();
        const colors = colorRaw.split(',').map(c=>c.trim()).filter(Boolean);
        const sizeRaw = document.getElementById('productSize').value.trim();
        const sizes = sizeRaw.split(',').map(s=>s.trim()).filter(Boolean);
        const quantity = parseInt(document.getElementById('productQuantity').value);
        const category = document.getElementById('productCategory').value;
        const rating = parseFloat(document.getElementById('productRating').value) || null;
        // Если выбраны новые фото — заменить, иначе оставить старые
        const photoPromises = [];
        if (files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            photoPromises.push(new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = e => resolve(e.target.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            }));
          }
        }
        Promise.all(photoPromises).then(photos => {
          const updated = { id: product.id || generateProductId(), name, price, oldPrice, discount, description, colors, sizes, quantity, category, rating, photos: (files.length > 0 ? photos : product.photos) };
          const products = getProducts();
          products[idx] = updated;
          setProducts(products);
          renderProducts();
          addProductModal.style.display = 'none';
          addProductForm.reset();
          addProductForm.onsubmit = null;
        });
        if (files.length === 0) {
          // Если фото не менялись
          const updated = { id: product.id || generateProductId(), name, price, oldPrice, discount, description, colors, sizes, quantity, category, rating, photos: product.photos };
          const products = getProducts();
          products[idx] = updated;
          setProducts(products);
          renderProducts();
          addProductModal.style.display = 'none';
          addProductForm.reset();
          addProductForm.onsubmit = null;
        }
      };
    });
  });
}
const addProductForm = document.getElementById('addProductForm');
if (addProductForm) {
  addProductForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const files = document.getElementById('productPhotos').files;
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const oldPrice = parseFloat(document.getElementById('productOldPrice').value) || null;
    const discount = parseInt(document.getElementById('productDiscount').value) || null;
    const description = document.getElementById('productDescription').value.trim();
    const colorRaw = document.getElementById('productColor').value.trim();
    const colors = colorRaw.split(',').map(c=>c.trim()).filter(Boolean);
    const sizeRaw = document.getElementById('productSize').value.trim();
    const sizes = sizeRaw.split(',').map(s=>s.trim()).filter(Boolean);
    const quantity = parseInt(document.getElementById('productQuantity').value);
    const category = document.getElementById('productCategory').value;
    const rating = parseFloat(document.getElementById('productRating').value) || null;
    // Read all images as base64
    const photoPromises = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      photoPromises.push(new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }));
    }
    Promise.all(photoPromises).then(photos => {
      const products = getProducts();
      products.push({ id: generateProductId(), name, price, oldPrice, discount, description, colors, sizes, quantity, category, rating, photos });
      setProducts(products);
      renderProducts();
      addProductModal.style.display = 'none';
      addProductForm.reset();
    });
  });
}
// Автоматический рендер при загрузке
if (document.querySelector('#section-product')) {
  migrateExistingProducts();
  addDemoProducts();
  renderProducts();
}