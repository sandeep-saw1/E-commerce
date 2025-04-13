// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize shopping cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    // Product filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product');

    // Add event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Show/hide products based on filter
            products.forEach(product => {
                if (filter === 'all' || product.getAttribute('data-category') === filter) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });

    // Shopping Cart Functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCount = document.getElementById('cart-count');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartBtn = document.getElementById('cart-btn');

    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const productName = button.getAttribute('data-name');
            const productPrice = parseFloat(button.getAttribute('data-price'));
            const productImage = button.getAttribute('data-image');
            
            // Check if product is already in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            
            // Save cart to localStorage
            saveCart();
            updateCartCount();
            renderCartItems();
            
            // Show success message
            showNotification(`${productName} added to cart!`);
            
            // Open cart modal
            openCartModal();
        });
    });

    // Open cart modal
    cartBtn.addEventListener('click', openCartModal);

    // Close cart modal
    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.remove('open');
    });

    // Clear cart
    clearCartBtn.addEventListener('click', () => {
        cart = [];
        saveCart();
        updateCartCount();
        renderCartItems();
    });

    // Checkout functionality
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        
        showNotification('Proceeding to checkout...', 'success');
        // In a real application, this would redirect to a checkout page
        setTimeout(() => {
            alert('Thank you for your purchase!');
            cart = [];
            saveCart();
            updateCartCount();
            renderCartItems();
            cartModal.classList.remove('open');
        }, 1500);
    });

    // Navigation smooth scrolling
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#') && targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Category click handlers
    const categories = document.querySelectorAll('.category');
    
    categories.forEach(category => {
        category.addEventListener('click', () => {
            const categoryId = category.id;
            const categoryName = categoryId.replace('category-', '');
            
            // Find and click the corresponding filter button
            const filterBtn = document.querySelector(`.filter-btn[data-filter="${categoryName}"]`);
            if (filterBtn) {
                filterBtn.click();
                
                // Scroll to products section
                const productsSection = document.getElementById('products');
                if (productsSection) {
                    window.scrollTo({
                        top: productsSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Shop Now button
    const shopNowBtn = document.getElementById('shop-now-btn');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', () => {
            const productsSection = document.getElementById('products');
            if (productsSection) {
                window.scrollTo({
                    top: productsSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Special Offers button
    const specialOffersBtn = document.getElementById('special-offers-btn');
    if (specialOffersBtn) {
        specialOffersBtn.addEventListener('click', () => {
            const dealsSection = document.getElementById('deals');
            if (dealsSection) {
                window.scrollTo({
                    top: dealsSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }

    // View All Deals button
    const viewAllDealsBtn = document.getElementById('view-all-deals-btn');
    if (viewAllDealsBtn) {
        viewAllDealsBtn.addEventListener('click', () => {
            // In a real application, this would redirect to a deals page
            showNotification('Viewing all deals...', 'success');
        });
    }

    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // In a real application, this would send the email to a server
            showNotification(`Thank you for subscribing with ${email}!`, 'success');
            emailInput.value = '';
        });
    }

    // Footer button handlers
    const contactBtn = document.getElementById('contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            showNotification('Contact page coming soon!', 'info');
        });
    }

    const aboutBtn = document.getElementById('about-btn');
    if (aboutBtn) {
        aboutBtn.addEventListener('click', () => {
            showNotification('About page coming soon!', 'info');
        });
    }

    // Social media links
    const socialLinks = document.querySelectorAll('.footer-col a[id$="-link"]');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.id.replace('-link', '');
            showNotification(`Redirecting to ${platform}...`, 'info');
        });
    });

    // Search button
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            showNotification('Search functionality coming soon!', 'info');
        });
    }

    // Helper Functions
    function openCartModal() {
        renderCartItems();
        cartModal.classList.add('open');
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotalPrice.textContent = '$0.00';
            return;
        }
        
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        cartTotalPrice.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners to quantity buttons
        const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
        const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
        const removeButtons = document.querySelectorAll('.cart-item-remove');
        
        decreaseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const itemId = button.getAttribute('data-id');
                decreaseQuantity(itemId);
            });
        });
        
        increaseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const itemId = button.getAttribute('data-id');
                increaseQuantity(itemId);
            });
        });
        
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const itemId = button.getAttribute('data-id');
                removeFromCart(itemId);
            });
        });
    }

    function decreaseQuantity(itemId) {
        const item = cart.find(item => item.id === itemId);
        
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                removeFromCart(itemId);
                return;
            }
            
            saveCart();
            updateCartCount();
            renderCartItems();
        }
    }

    function increaseQuantity(itemId) {
        const item = cart.find(item => item.id === itemId);
        
        if (item) {
            item.quantity += 1;
            saveCart();
            updateCartCount();
            renderCartItems();
        }
    }

    function removeFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        saveCart();
        updateCartCount();
        renderCartItems();
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = count;
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            z-index: 1001;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.3s, transform 0.3s;
        }
        
        .notification.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .notification.success {
            background-color: #10b981;
        }
        
        .notification.error {
            background-color: #ef4444;
        }
        
        .notification.info {
            background-color: #3b82f6;
        }
        
        .empty-cart {
            text-align: center;
            padding: 2rem;
            color: #6b7280;
        }
    `;
    
    document.head.appendChild(style);
});
