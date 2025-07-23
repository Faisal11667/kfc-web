document.addEventListener('DOMContentLoaded', () => {
    // Get all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    // Get the cart count element in the header
    const cartCountElement = document.querySelector('.cart-count');

    let cartItemCount = 0; // Initialize cart count. In a real app, this would come from local storage or a backend.

    // Function to update the cart count display
    const updateCartCount = () => {
        cartCountElement.textContent = cartItemCount;
        // Optionally, make the cart icon visible or animated if it starts at 0
        if (cartItemCount > 0) {
            cartCountElement.style.display = 'inline-block'; // Show the count
            // You could add a subtle animation here, e.g., scale up briefly
            cartCountElement.animate(
                [{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }],
                { duration: 200, easing: 'ease-out' }
            );
        } else {
            cartCountElement.style.display = 'none'; // Hide if cart is empty
        }
    };

    // Initialize cart count on page load (e.g., if you later add persistence)
    updateCartCount();

    // Add event listener to each "Add to Cart" button
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Prevent default form submission behavior (if the button were inside a form)
            event.preventDefault();

            // Get the item ID from the data-item-id attribute
            const itemId = button.dataset.itemId;
            const itemCard = button.closest('.item-card');
            const itemName = itemCard.querySelector('h3').textContent;
            const itemPriceText = itemCard.querySelector('.price').textContent;
            const itemPrice = parseFloat(itemPriceText.replace('PKR ', '')); // Convert price text to number

            // In a real application, you would add the item to a more complex cart array
            // For now, we'll just increment the count and log the item.
            cartItemCount++;
            updateCartCount();

            console.log(`Added to cart: ${itemName} (ID: ${itemId}, Price: PKR ${itemPrice})`);

            // Optional: Provide visual feedback to the user
            button.textContent = 'Added!';
            button.style.backgroundColor = '#218838'; // Darker green
            button.disabled = true; // Disable button temporarily

            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.backgroundColor = '#28a745'; // Original green
                button.disabled = false;
            }, 1000); // Reset button text after 1 second
        });
    });

    // You might also want to add JS for a responsive navigation menu later if you want a mobile hamburger icon.
});


// Add this to your existing script.js, outside the DOMContentLoaded listener
// or inside if you prefer to keep all event listeners grouped within it.

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});




// manu page 


document.addEventListener('DOMContentLoaded', () => {
    // --- Common Cart Functionality (for both Home & Menu pages) ---
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    const cartCountElement = document.querySelector('.cart-count');

    // Load cart items from localStorage if available, otherwise start fresh
    let cartItems = JSON.parse(localStorage.getItem('kfcCart')) || [];

    // Function to update the cart count display
    const updateCartCount = () => {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        if (totalItems > 0) {
            cartCountElement.style.display = 'inline-block';
            cartCountElement.animate(
                [{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }],
                { duration: 200, easing: 'ease-out' }
            );
        } else {
            cartCountElement.style.display = 'none';
        }
    };

    // Add item to cart logic
    const addItemToCart = (itemId, itemName, itemPrice) => {
        const existingItem = cartItems.find(item => item.id === itemId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({ id: itemId, name: itemName, price: itemPrice, quantity: 1 });
        }
        localStorage.setItem('kfcCart', JSON.stringify(cartItems)); // Save to localStorage
        updateCartCount();
    };

    // Initialize cart count on page load
    updateCartCount();

    // Add event listener to each "Add to Cart" button
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default form submission

            const itemId = button.dataset.itemId;
            // Find the closest parent that contains item details (either .item-card or .menu-item-card)
            const parentCard = button.closest('.item-card') || button.closest('.menu-item-card');
            const itemName = parentCard.querySelector('h3').textContent;
            const itemPriceText = parentCard.querySelector('.price').textContent;
            const itemPrice = parseFloat(itemPriceText.replace('PKR ', ''));

            addItemToCart(itemId, itemName, itemPrice);

            // Provide visual feedback
            button.textContent = 'Added!';
            button.style.backgroundColor = '#218838'; // Darker green
            button.disabled = true;

            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.backgroundColor = '#28a745'; // Original green
                button.disabled = false;
            }, 1000);
        });
    });

    // --- Menu Page Specific Functionality ---
    // Check if we are on the menu page before applying menu-specific JS
    if (document.body.classList.contains('menu-page')) { // We will add this class to the body of menu.html
        const categoryButtons = document.querySelectorAll('.category-btn');
        const menuItems = document.querySelectorAll('.menu-item-card');
        const menuSearchInput = document.getElementById('menuSearch');
        const searchBtn = document.getElementById('searchBtn');

        // Function to filter items by category
        const filterItems = (category) => {
            menuItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'flex'; // Show the item
                } else {
                    item.style.display = 'none'; // Hide the item
                }
            });
        };

        // Event listener for category buttons
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove 'active' class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                // Add 'active' class to the clicked button
                button.classList.add('active');

                const category = button.dataset.category;
                filterItems(category);
                menuSearchInput.value = ''; // Clear search when changing category
            });
        });

        // Function to search items
        const searchItems = () => {
            const searchTerm = menuSearchInput.value.toLowerCase();
            menuItems.forEach(item => {
                const itemName = item.querySelector('h3').textContent.toLowerCase();
                const itemDescription = item.querySelector('p').textContent.toLowerCase();

                if (itemName.includes(searchTerm) || itemDescription.includes(searchTerm)) {
                    item.style.display = 'flex'; // Show item if it matches search
                } else {
                    item.style.display = 'none'; // Hide item
                }
            });
            // Remove active state from category buttons when searching
            categoryButtons.forEach(btn => btn.classList.remove('active'));
        };

        // Event listeners for search input and button
        searchBtn.addEventListener('click', searchItems);
        menuSearchInput.addEventListener('keyup', (event) => {
            // Optional: Search on Enter key press or live typing
            // if (event.key === 'Enter') {
                searchItems();
            // }
            // You can also call searchItems() directly here for live search as user types
        });

        // Initially show all items when menu page loads
        filterItems('all');
    }

    // --- Smooth Scrolling (from previous step, reusable) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});




// deals page k Order This Deal

document.addEventListener('DOMContentLoaded', () => {
    // --- Common Cart Functionality (for Home, Menu, & Deals pages) ---
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart, .btn-add-deal'); // Select both types of buttons
    const cartCountElement = document.querySelector('.cart-count');

    // Load cart items from localStorage if available, otherwise start fresh
    let cartItems = JSON.parse(localStorage.getItem('kfcCart')) || [];

    // Function to update the cart count display
    const updateCartCount = () => {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        if (totalItems > 0) {
            cartCountElement.style.display = 'inline-block';
            cartCountElement.animate(
                [{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }],
                { duration: 200, easing: 'ease-out' }
            );
        } else {
            cartCountElement.style.display = 'none';
        }
    };

    // Add item to cart logic
    const addItemToCart = (itemId, itemName, itemPrice) => {
        const existingItem = cartItems.find(item => item.id === itemId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({ id: itemId, name: itemName, price: itemPrice, quantity: 1 });
        }
        localStorage.setItem('kfcCart', JSON.stringify(cartItems)); // Save to localStorage
        updateCartCount();
    };

    // Initialize cart count on page load
    updateCartCount();

    // Add event listener to each "Add to Cart" and "Order This Deal" button
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default form submission

            const itemId = button.dataset.itemId || button.dataset.dealId; // Get ID from either data-item-id or data-deal-id
            let itemName, itemPrice;

            // Determine if it's a regular item or a deal
            if (button.classList.contains('btn-add-to-cart')) {
                // For regular menu items (from Home or Menu page)
                const parentCard = button.closest('.item-card') || button.closest('.menu-item-card');
                itemName = parentCard.querySelector('h3').textContent;
                const itemPriceText = parentCard.querySelector('.price').textContent;
                itemPrice = parseFloat(itemPriceText.replace('PKR ', ''));
            } else if (button.classList.contains('btn-add-deal')) {
                // For deals (from Deals page)
                const parentCard = button.closest('.deal-card-full');
                itemName = parentCard.querySelector('h3').textContent + ' (Deal)'; // Add "(Deal)" to name for clarity
                const itemPriceText = parentCard.querySelector('.deal-price').textContent;
                itemPrice = parseFloat(itemPriceText.replace('PKR ', ''));
            }

            addItemToCart(itemId, itemName, itemPrice);

            // Provide visual feedback
            button.textContent = 'Added!';
            button.style.backgroundColor = '#218838'; // Darker green
            button.disabled = true;

            setTimeout(() => {
                // Reset button text based on its original class
                if (button.classList.contains('btn-add-to-cart')) {
                    button.textContent = 'Add to Cart';
                } else if (button.classList.contains('btn-add-deal')) {
                    button.textContent = 'Order This Deal';
                }
                button.style.backgroundColor = '#28a745'; // Original green
                button.disabled = false;
            }, 1000);
        });
    });

    // --- Menu Page Specific Functionality ---
    if (document.body.classList.contains('menu-page')) {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const menuItems = document.querySelectorAll('.menu-item-card');
        const menuSearchInput = document.getElementById('menuSearch');
        const searchBtn = document.getElementById('searchBtn');

        const filterItems = (category) => {
            menuItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'flex'; // Show the item
                } else {
                    item.style.display = 'none'; // Hide the item
                }
            });
        };

        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const category = button.dataset.category;
                filterItems(category);
                menuSearchInput.value = ''; // Clear search when changing category
            });
        });

        const searchItems = () => {
            const searchTerm = menuSearchInput.value.toLowerCase();
            menuItems.forEach(item => {
                const itemName = item.querySelector('h3').textContent.toLowerCase();
                const itemDescription = item.querySelector('p').textContent.toLowerCase();

                if (itemName.includes(searchTerm) || itemDescription.includes(searchTerm)) {
                    item.style.display = 'flex'; // Show item if it matches search
                } else {
                    item.style.display = 'none'; // Hide item
                }
            });
            categoryButtons.forEach(btn => btn.classList.remove('active'));
        };

        searchBtn.addEventListener('click', searchItems);
        menuSearchInput.addEventListener('keyup', searchItems); // Live search as user types

        filterItems('all'); // Initially show all items
    }

    // --- Smooth Scrolling (from previous step, reusable) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});