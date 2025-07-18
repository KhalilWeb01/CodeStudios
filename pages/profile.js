// Profile Page JavaScript
class ProfileManager {
    constructor() {
        this.currentUser = this.loadUserData();
        this.cart = this.loadCart();
        this.favorites = this.loadFavorites();
        this.orders = this.loadOrders();
        this.currentTab = 'personal';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserProfile();
        this.updateCartDisplay();
        this.loadOrdersList();
        this.loadFavoritesList();
        this.setupAnimations();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Profile form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile();
            });
        }

        // Cart functionality
        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                this.clearCart();
            });
        }

        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.checkout();
            });
        }

        // Profile actions
        const editProfileBtn = document.getElementById('editProfileBtn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                this.switchTab('personal');
            });
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Avatar edit
        const avatarEdit = document.querySelector('.avatar-edit');
        if (avatarEdit) {
            avatarEdit.addEventListener('click', () => {
                this.editAvatar();
            });
        }

        // Settings
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => {
                this.changePassword();
            });
        }

        // Bottom navigation
        const bottomCartLink = document.getElementById('bottomCartLink');
        if (bottomCartLink) {
            bottomCartLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab('cart');
            });
        }
    }

    switchTab(tabName) {
        // Remove active class from all tabs and panes
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });

        // Add active class to selected tab and pane
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        const activePane = document.getElementById(tabName);
        
        if (activeTab && activePane) {
            activeTab.classList.add('active');
            activePane.classList.add('active');
            this.currentTab = tabName;

            // Load content for specific tabs
            if (tabName === 'cart') {
                this.loadCartItems();
            } else if (tabName === 'orders') {
                this.loadOrdersList();
            } else if (tabName === 'favorites') {
                this.loadFavoritesList();
            }
        }
    }

    loadUserProfile() {
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
            document.getElementById('userEmail').textContent = this.currentUser.email;
            document.getElementById('orderCount').textContent = this.currentUser.orderCount || 0;
            document.getElementById('totalSpent').textContent = this.formatPrice(this.currentUser.totalSpent || 0);
            document.getElementById('loyaltyPoints').textContent = this.currentUser.loyaltyPoints || 0;

            // Fill form fields
            if (this.currentUser.firstName) {
                document.getElementById('firstName').value = this.currentUser.firstName;
            }
            if (this.currentUser.lastName) {
                document.getElementById('lastName').value = this.currentUser.lastName;
            }
            if (this.currentUser.email) {
                document.getElementById('email').value = this.currentUser.email;
            }
            if (this.currentUser.phone) {
                document.getElementById('phone').value = this.currentUser.phone;
            }
            if (this.currentUser.birthDate) {
                document.getElementById('birthDate').value = this.currentUser.birthDate;
            }
            if (this.currentUser.address) {
                document.getElementById('address').value = this.currentUser.address;
            }
        }
    }

    saveProfile() {
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            birthDate: document.getElementById('birthDate').value,
            address: document.getElementById('address').value
        };

        // Update user data
        this.currentUser = { ...this.currentUser, ...formData };
        this.currentUser.name = `${formData.firstName} ${formData.lastName}`;
        
        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify(this.currentUser));
        
        // Update display
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('userEmail').textContent = this.currentUser.email;

        this.showNotification('Профиль успешно обновлен!', 'success');
    }

    loadCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartSummary = document.getElementById('cartSummary');
        
        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <h4>Корзина пуста</h4>
                    <p>Добавьте товары в корзину для покупки</p>
                    <a href="../index.html" class="btn btn-primary">
                        <i class="fas fa-shopping-bag"></i>
                        Перейти к покупкам
                    </a>
                </div>
            `;
            cartSummary.style.display = 'none';
            return;
        }

        cartSummary.style.display = 'block';
        
        let totalPrice = 0;
        let totalItems = 0;

        const cartHTML = this.cart.map(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            totalItems += item.quantity;

            return `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${this.formatPrice(item.price)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="profileManager.updateQuantity('${item.id}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="profileManager.updateQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="profileManager.removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }).join('');

        cartItemsContainer.innerHTML = cartHTML;

        // Update summary
        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('totalPrice').textContent = this.formatPrice(totalPrice);
        
        // Update cart badge
        this.updateCartBadge();
    }

    updateQuantity(itemId, change) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                this.saveCart();
                this.loadCartItems();
            }
        }
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.loadCartItems();
        this.updateCartDisplay();
    }

    clearCart() {
        if (confirm('Вы уверены, что хотите очистить корзину?')) {
            this.cart = [];
            this.saveCart();
            this.loadCartItems();
            this.updateCartDisplay();
            this.showNotification('Корзина очищена', 'info');
        }
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Корзина пуста', 'warning');
            return;
        }

        // Create order
        const order = {
            id: Date.now(),
            items: [...this.cart],
            total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            date: new Date().toISOString(),
            status: 'processing'
        };

        this.orders.unshift(order);
        this.saveOrders();

        // Clear cart
        this.cart = [];
        this.saveCart();
        this.loadCartItems();
        this.updateCartDisplay();

        // Update user stats
        this.currentUser.orderCount = (this.currentUser.orderCount || 0) + 1;
        this.currentUser.totalSpent = (this.currentUser.totalSpent || 0) + order.total;
        this.currentUser.loyaltyPoints = (this.currentUser.loyaltyPoints || 0) + Math.floor(order.total / 100);
        this.saveUserData();

        // Switch to orders tab
        this.switchTab('orders');
        this.showNotification('Заказ успешно оформлен!', 'success');
    }

    loadOrdersList() {
        const ordersContainer = document.getElementById('ordersList');
        
        if (this.orders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <h4>Заказов пока нет</h4>
                    <p>Сделайте свой первый заказ</p>
                    <a href="../index.html" class="btn btn-primary">
                        <i class="fas fa-shopping-bag"></i>
                        Перейти к покупкам
                    </a>
                </div>
            `;
            return;
        }

        const ordersHTML = this.orders.map(order => {
            const statusClass = this.getStatusClass(order.status);
            const statusText = this.getStatusText(order.status);
            const date = new Date(order.date).toLocaleDateString('ru-RU');

            return `
                <div class="order-item">
                    <div class="order-header">
                        <div>
                            <div class="order-number">Заказ #${order.id}</div>
                            <div class="order-date">${date}</div>
                        </div>
                        <span class="order-status ${statusClass}">${statusText}</span>
                    </div>
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item-detail">
                                <span>${item.name} x${item.quantity}</span>
                                <span>${this.formatPrice(item.price * item.quantity)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-total">
                        Итого: ${this.formatPrice(order.total)}
                    </div>
                </div>
            `;
        }).join('');

        ordersContainer.innerHTML = ordersHTML;
    }

    loadFavoritesList() {
        const favoritesContainer = document.getElementById('favoritesGrid');
        
        if (this.favorites.length === 0) {
            favoritesContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart"></i>
                    <h4>Избранное пусто</h4>
                    <p>Добавьте товары в избранное</p>
                    <a href="../index.html" class="btn btn-primary">
                        <i class="fas fa-shopping-bag"></i>
                        Перейти к покупкам
                    </a>
                </div>
            `;
            return;
        }

        const favoritesHTML = this.favorites.map(item => `
            <div class="favorite-item">
                <img src="${item.image}" alt="${item.name}" class="favorite-item-image">
                <div class="favorite-item-details">
                    <div class="favorite-item-name">${item.name}</div>
                    <div class="favorite-item-price">${this.formatPrice(item.price)}</div>
                    <div class="favorite-item-actions">
                        <button class="btn btn-primary" onclick="profileManager.addToCart('${item.id}')">
                            <i class="fas fa-shopping-cart"></i>
                            В корзину
                        </button>
                        <button class="btn btn-secondary" onclick="profileManager.removeFromFavorites('${item.id}')">
                            <i class="fas fa-heart-broken"></i>
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        favoritesContainer.innerHTML = favoritesHTML;
    }

    addToCart(itemId) {
        const item = this.favorites.find(item => item.id === itemId);
        if (item) {
            const existingItem = this.cart.find(cartItem => cartItem.id === itemId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.push({ ...item, quantity: 1 });
            }
            this.saveCart();
            this.updateCartDisplay();
            this.showNotification('Товар добавлен в корзину', 'success');
        }
    }

    removeFromFavorites(itemId) {
        this.favorites = this.favorites.filter(item => item.id !== itemId);
        this.saveFavorites();
        this.loadFavoritesList();
        this.showNotification('Товар удален из избранного', 'info');
    }

    updateCartDisplay() {
        const cartCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.getElementById('cartCount');
        const cartBadgeElement = document.getElementById('cartBadge');
        
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
        if (cartBadgeElement) {
            cartBadgeElement.textContent = cartCount;
        }
    }

    updateCartBadge() {
        const cartCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartBadgeElement = document.getElementById('cartBadge');
        if (cartBadgeElement) {
            cartBadgeElement.textContent = cartCount;
        }
    }

    editAvatar() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('userAvatar').src = e.target.result;
                    this.showNotification('Аватар обновлен', 'success');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    changePassword() {
        const newPassword = prompt('Введите новый пароль:');
        if (newPassword) {
            const confirmPassword = prompt('Подтвердите новый пароль:');
            if (newPassword === confirmPassword) {
                this.currentUser.password = newPassword;
                this.saveUserData();
                this.showNotification('Пароль изменен', 'success');
            } else {
                this.showNotification('Пароли не совпадают', 'error');
            }
        }
    }

    logout() {
        if (confirm('Вы уверены, что хотите выйти?')) {
            localStorage.removeItem('userData');
            window.location.href = 'login.html';
        }
    }

    getStatusClass(status) {
        const statusMap = {
            'processing': 'processing',
            'shipped': 'shipped',
            'completed': 'completed'
        };
        return statusMap[status] || 'processing';
    }

    getStatusText(status) {
        const statusMap = {
            'processing': 'В обработке',
            'shipped': 'Отправлен',
            'completed': 'Выполнен'
        };
        return statusMap[status] || 'В обработке';
    }

    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-from-top, .animate-from-left, .animate-from-right').forEach(el => {
            observer.observe(el);
        });
    }

    // Data persistence methods
    loadUserData() {
        const data = localStorage.getItem('userData');
        return data ? JSON.parse(data) : {
            name: 'Иван Дмитриев',
            email: 'ivan.dmitriev@example.com',
            firstName: 'Иван',
            lastName: 'Дмитриев',
            phone: '+7 (999) 123-45-67',
            birthDate: '1990-05-15',
            address: 'г. Москва, ул. Тверская, д. 1, кв. 15',
            orderCount: 12,
            totalSpent: 45600,
            loyaltyPoints: 1250
        };
    }

    saveUserData() {
        localStorage.setItem('userData', JSON.stringify(this.currentUser));
    }

    loadCart() {
        const data = localStorage.getItem('cart');
        return data ? JSON.parse(data) : [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    loadFavorites() {
        const data = localStorage.getItem('favorites');
        return data ? JSON.parse(data) : [];
    }

    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    loadOrders() {
        const data = localStorage.getItem('orders');
        return data ? JSON.parse(data) : [
            {
                id: 1001,
                items: [
                    { id: 1, name: 'Футболка хлопковая', price: 1200, quantity: 2, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDE1MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNGE5MGUyIi8+Cjx0ZXh0IHg9Ijc1IiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlQtU2hpcnQ8L3RleHQ+Cjwvc3ZnPgo=' }
                ],
                total: 2400,
                date: '2024-01-15T10:30:00Z',
                status: 'completed'
            },
            {
                id: 1002,
                items: [
                    { id: 5, name: 'Джинсы классические', price: 3500, quantity: 1, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDE1MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMjhhNzQ1Ii8+Cjx0ZXh0IHg9Ijc1IiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkplYW5zPC90ZXh0Pgo8L3N2Zz4K' }
                ],
                total: 3500,
                date: '2024-01-10T14:20:00Z',
                status: 'shipped'
            }
        ];
    }

    saveOrders() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    }
}

// Initialize profile manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
});

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        padding: 1rem 1.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: 'Courier New', monospace;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        border-left: 4px solid #28a745;
        color: #155724;
    }

    .notification-error {
        border-left: 4px solid #dc3545;
        color: #721c24;
    }

    .notification-warning {
        border-left: 4px solid #ffc107;
        color: #856404;
    }

    .notification-info {
        border-left: 4px solid #17a2b8;
        color: #0c5460;
    }

    .notification i {
        font-size: 1.2rem;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet); 