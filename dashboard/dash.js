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

function showSection(sectionName) {
  hideAllSections();
  const sectionDiv = document.getElementById('section-' + sectionName);
  if (sectionDiv) {
    sectionDiv.style.display = '';
    // Update active sidebar item
    setActiveSidebarItem(document.querySelector(`[data-section="${sectionName}"]`));
  }
}

function setActiveSidebarItem(activeItem) {
  document.querySelectorAll('.sidebar-list-item').forEach(item => item.classList.remove('active'));
  if (activeItem) {
    activeItem.classList.add('active');
  }
}

document.querySelectorAll('.sidebar-list-item').forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    const section = item.getAttribute('data-section');
    if (!section) return;
    showSection(section);
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

// --- Enhanced Add Product Modal Logic ---
const openAddProductModalBtn = document.getElementById('openAddProductModal');
const addProductModal = document.getElementById('addProductModal');
const closeAddProductModalBtn = document.getElementById('closeAddProductModal');
const cancelAddProductBtn = document.getElementById('cancelAddProduct');
const fileUploadArea = document.getElementById('fileUploadArea');
const uploadedFiles = document.getElementById('uploadedFiles');

if (openAddProductModalBtn && addProductModal && closeAddProductModalBtn) {
  openAddProductModalBtn.addEventListener('click', () => {
    addProductModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  });
  
  closeAddProductModalBtn.addEventListener('click', closeModal);
  cancelAddProductBtn.addEventListener('click', closeModal);
  
  addProductModal.addEventListener('click', (e) => {
    if (e.target === addProductModal) closeModal();
  });
  
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && addProductModal.style.display === 'flex') {
      closeModal();
    }
  });
}

function closeModal() {
  addProductModal.style.display = 'none';
  document.body.style.overflow = ''; // Restore scrolling
  resetForm();
}

function resetForm() {
  document.getElementById('addProductForm').reset();
  uploadedFiles.innerHTML = '';
  resetStars();
  
  // Restore original submit button text
  const submitBtn = document.querySelector('#addProductForm button[type="submit"]');
  if (submitBtn) {
    submitBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 12l2 2 4-4"/>
        <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
      </svg>
      Add Product
    `;
    submitBtn.disabled = false;
  }
}

// File Upload Functionality
if (fileUploadArea) {
  const fileInput = document.getElementById('productPhotos');
  
  // Drag and drop functionality
  fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
  });
  
  fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.classList.remove('dragover');
  });
  
  fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleFiles(files);
  });
  
  // File input change
  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });
}

// Compress image function
function compressImage(file) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions (max 800px width/height)
      const maxSize = 800;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
      resolve(compressedDataUrl);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

function handleFiles(files) {
  uploadedFiles.innerHTML = '';
  
  Array.from(files).forEach((file, index) => {
    if (file.type.startsWith('image/')) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('File too large. Please select images under 5MB.', 'error');
        return;
      }
      
      // Compress and preview
      compressImage(file).then(compressedDataUrl => {
        const preview = document.createElement('div');
        preview.className = 'file-preview';
        preview.innerHTML = `
          <img src="${compressedDataUrl}" alt="Preview">
          <button class="remove-file" onclick="removeFile(${index})">×</button>
        `;
        uploadedFiles.appendChild(preview);
      });
    } else {
      showNotification('Please select only image files (JPG, PNG, GIF).', 'error');
    }
  });
}

function removeFile(index) {
  const fileInput = document.getElementById('productPhotos');
  const dt = new DataTransfer();
  const files = fileInput.files;
  
  for (let i = 0; i < files.length; i++) {
    if (i !== index) {
      dt.items.add(files[i]);
    }
  }
  
  fileInput.files = dt.files;
  handleFiles(fileInput.files);
}

// Star Rating Functionality
const stars = document.querySelectorAll('.star');
const ratingInput = document.getElementById('productRating');

stars.forEach(star => {
  star.addEventListener('click', () => {
    const value = parseInt(star.getAttribute('data-value'));
    setRating(value);
  });
  
  star.addEventListener('mouseenter', () => {
    const value = parseInt(star.getAttribute('data-value'));
    highlightStars(value);
  });
});

document.querySelector('.stars').addEventListener('mouseleave', () => {
  const currentRating = parseFloat(ratingInput.value) || 0;
  highlightStars(currentRating);
});

function setRating(value) {
  ratingInput.value = value;
  highlightStars(value);
}

function highlightStars(value) {
  stars.forEach((star, index) => {
    if (index < value) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

function resetStars() {
  stars.forEach(star => star.classList.remove('active'));
}

// Enhanced form validation
const addProductForm = document.getElementById('addProductForm');
if (addProductForm) {
  addProductForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
      Adding...
    `;
    submitBtn.disabled = true;
    
    // Simulate processing delay
    setTimeout(() => {
      const files = document.getElementById('productPhotos').files;
      const name = document.getElementById('productName').value.trim();
      const price = parseFloat(document.getElementById('productPrice').value);
      const oldPrice = parseFloat(document.getElementById('productOldPrice').value) || null;
      const discount = parseInt(document.getElementById('productDiscount').value) || null;
      const description = document.getElementById('productDescription').value.trim();
      const colorRaw = document.getElementById('productColor').value.trim();
      const colors = colorRaw.split(',').map(c => c.trim()).filter(Boolean);
      const sizeRaw = document.getElementById('productSize').value.trim();
      const sizes = sizeRaw.split(',').map(s => s.trim()).filter(Boolean);
      const quantity = parseInt(document.getElementById('productQuantity').value);
      const category = document.getElementById('productCategory').value;
      const rating = parseFloat(document.getElementById('productRating').value) || null;
      
      // Compress all images
      const photoPromises = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        photoPromises.push(compressImage(file));
      }
      
      Promise.all(photoPromises).then(photos => {
        try {
          const products = getProducts();
          const newProduct = { 
            id: generateProductId(), 
            name, 
            price, 
            oldPrice, 
            discount, 
            description, 
            colors, 
            sizes, 
            quantity, 
            category, 
            rating, 
            photos 
          };
          
          products.push(newProduct);
          setProducts(products);
          renderProducts();
          
          // Show success message
          showNotification('Product added successfully!', 'success');
          
          // Reset form and close modal
          closeModal();
          
          // Reset button
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        } catch (error) {
          console.error('Error saving product:', error);
          showNotification('Error saving product. Please try again.', 'error');
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      }).catch(error => {
        console.error('Error processing images:', error);
        showNotification('Error processing images. Please try again.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
    }, 1000);
  });
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  // Add notification styles if not exists
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
      }
      .notification-content {
        background: white;
        border-radius: 8px;
        padding: 16px 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
      }
      .notification-success .notification-content {
        border-left: 4px solid #48bb78;
      }
      .notification-error .notification-content {
        border-left: 4px solid #f56565;
      }
      .notification button {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #718096;
      }
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 3000);
}

// --- Add Product Form Logic ---
function getProducts() {
  const data = localStorage.getItem('products');
  if (!data) return [];
  return JSON.parse(data);
}
function setProducts(products) {
  try {
    // Check if data is too large
    const dataString = JSON.stringify(products);
    const dataSize = new Blob([dataString]).size;
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    
    if (dataSize > maxSize) {
      showNotification('Too much data. Please remove some products or use smaller images.', 'error');
      return false;
    }
    
    localStorage.setItem('products', dataString);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    if (error.name === 'QuotaExceededError') {
      showNotification('Storage full. Please remove some products or use smaller images.', 'error');
    } else {
      showNotification('Error saving data. Please try again.', 'error');
    }
    return false;
  }
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
// Clear localStorage function
function clearAllProducts() {
  if (confirm('Are you sure you want to delete all products? This action cannot be undone.')) {
    try {
      localStorage.removeItem('products');
      renderProducts();
      showNotification('All products cleared successfully!', 'success');
    } catch (error) {
      console.error('Error clearing products:', error);
      showNotification('Error clearing products. Please try again.', 'error');
    }
  }
}

// Add clear button to the product section
function addClearButton() {
  const productSection = document.getElementById('section-product');
  if (productSection) {
    const header = productSection.querySelector('.app-content-header');
    if (header && !header.querySelector('.clear-all-btn')) {
      const clearBtn = document.createElement('button');
      clearBtn.className = 'clear-all-btn';
      clearBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3,6 5,6 21,6"/>
          <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
        </svg>
        Clear All
      `;
      clearBtn.style.marginLeft = '12px';
      clearBtn.addEventListener('click', clearAllProducts);
      header.appendChild(clearBtn);
    }
  }
}

// Call addClearButton when rendering products
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
  
  if (products.length === 0) {
    html += `<div class="no-products">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 1-1.73z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
      <h3>No products yet</h3>
      <p>Start by adding your first product using the "Add Product" button above.</p>
    </div>`;
  } else {
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
  }
  
  wrapper.innerHTML = html;
  
  // Add clear button
  addClearButton();
  
  // Delete logic
  wrapper.querySelectorAll('.delete-product-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      const products = getProducts();
      products.splice(idx, 1);
      if (setProducts(products)) {
        renderProducts();
        showNotification('Product deleted successfully!', 'success');
      }
    });
  });
  
  // Edit logic
  wrapper.querySelectorAll('.edit-product-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      const products = getProducts();
      const product = products[idx];
      
      // Open modal and fill fields
      addProductModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Fill form fields
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
      
      // Show existing photos if available
      if (product.photos && product.photos.length > 0) {
        uploadedFiles.innerHTML = '';
        product.photos.forEach((photo, photoIndex) => {
          const preview = document.createElement('div');
          preview.className = 'file-preview';
          preview.innerHTML = `
            <img src="${photo}" alt="Preview">
            <button class="remove-file" onclick="removeFile(${photoIndex})">×</button>
          `;
          uploadedFiles.appendChild(preview);
        });
      }
      
      // Set rating stars
      if (product.rating) {
        setRating(product.rating);
      }
      
      // Update submit button text
      const submitBtn = document.querySelector('#addProductForm button[type="submit"]');
      submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Update Product
      `;
      
      // Override form submission for editing
      const originalSubmitHandler = addProductForm.onsubmit;
      addProductForm.onsubmit = function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
          <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
          Updating...
        `;
        submitBtn.disabled = true;
        
        setTimeout(() => {
          const files = document.getElementById('productPhotos').files;
          const name = document.getElementById('productName').value.trim();
          const price = parseFloat(document.getElementById('productPrice').value);
          const oldPrice = parseFloat(document.getElementById('productOldPrice').value) || null;
          const discount = parseInt(document.getElementById('productDiscount').value) || null;
          const description = document.getElementById('productDescription').value.trim();
          const colorRaw = document.getElementById('productColor').value.trim();
          const colors = colorRaw.split(',').map(c => c.trim()).filter(Boolean);
          const sizeRaw = document.getElementById('productSize').value.trim();
          const sizes = sizeRaw.split(',').map(s => s.trim()).filter(Boolean);
          const quantity = parseInt(document.getElementById('productQuantity').value);
          const category = document.getElementById('productCategory').value;
          const rating = parseFloat(document.getElementById('productRating').value) || null;
          
          // Handle photos
          const photoPromises = [];
          if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              photoPromises.push(compressImage(file));
            }
          }
          
          Promise.all(photoPromises).then(photos => {
            try {
              const updated = { 
                id: product.id || generateProductId(), 
                name, 
                price, 
                oldPrice, 
                discount, 
                description, 
                colors, 
                sizes, 
                quantity, 
                category, 
                rating, 
                photos: (files.length > 0 ? photos : product.photos) 
              };
              
              const products = getProducts();
              products[idx] = updated;
              
              if (setProducts(products)) {
                renderProducts();
                
                // Show success message
                showNotification('Product updated successfully!', 'success');
                
                // Reset form and close modal
                closeModal();
                
                // Restore original submit handler
                addProductForm.onsubmit = originalSubmitHandler;
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
              } else {
                // If save failed, don't close modal
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
              }
            } catch (error) {
              console.error('Error updating product:', error);
              showNotification('Error updating product. Please try again.', 'error');
              submitBtn.innerHTML = originalText;
              submitBtn.disabled = false;
            }
          }).catch(error => {
            console.error('Error processing images:', error);
            showNotification('Error processing images. Please try again.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          });
        }, 1000);
      };
    });
  });
}
// Автоматический рендер при загрузке
if (document.querySelector('#section-product')) {
  migrateExistingProducts();
  addDemoProducts();
  renderProducts();
}