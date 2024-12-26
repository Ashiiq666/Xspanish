// Add scroll effect to navigation
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        nav.style.boxShadow = 'none';
    }
});

// Initialize cart count
let cartCount = 0;
const cartCountElement = document.querySelector('.cart-count');

// Cart icon click handler
document.querySelector('.cart-icon').addEventListener('click', () => {
    cartCount++;
    cartCountElement.textContent = cartCount;
});

// CTA button click handler
document.addEventListener('DOMContentLoaded', () => {
    // Get all shop links (including those in navigation and CTA button)
    const shopLinks = document.querySelectorAll('a[href="#shop"], a[href="#shop-section"], .cta-button');
    
    shopLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Find the shop section
            const shopSection = document.querySelector('#shop-section');
            
            if (shopSection) {
                // Get the navigation height for offset
                const navHeight = document.querySelector('nav').offsetHeight;
                
                // Calculate the final scroll position
                const offsetTop = shopSection.offsetTop - navHeight;
                
                // Smooth scroll to shop section
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});


// Chat widget functionality
const chatWidget = document.querySelector('.chat-widget');
chatWidget.addEventListener('click', () => {
    // Add your chat functionality here
    alert('Chat feature coming soon!');
});

// Mobile menu functionality (can be expanded based on your needs)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// Contact form functionality
document.addEventListener('DOMContentLoaded', () => {
    const contactLink = document.getElementById('contactLink');
    const contactOverlay = document.getElementById('contactOverlay');
    const closeContact = document.getElementById('closeContact');

    // Open contact form
    
    document.addEventListener('DOMContentLoaded', () => {
        // Contact menu link functionality
        const contactLink = document.getElementById('contactLink'); // Contact link in navigation
        const footerSection = document.querySelector('.footer'); // Footer section
    
        contactLink.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior
    
            // Smooth scroll to the footer section
            footerSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    

    // Close contact form
    closeContact.addEventListener('click', () => {
        contactOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close on outside click
    contactOverlay.addEventListener('click', (e) => {
        if (e.target === contactOverlay) {
            contactOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Form submission
    document.addEventListener('DOMContentLoaded', () => {
        const contactForm = document.querySelector('.contact-form form');
    
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
    
            const name = document.querySelector('input[name="name"]').value;
            const email = document.querySelector('input[name="email"]').value;
            const message = document.querySelector('textarea[name="message"]').value;
    
            const formData = { name, email, message };
    
            try {
                const response = await fetch('contact.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
    
                if (response.ok) {
                    alert('Your message has been sent!');
                    contactForm.reset();
                } else {
                    alert('There was an error sending your message. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting contact form:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    });
    
});


document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling for Shop Link
    document.querySelector('.shop-link').addEventListener('click', (e) => {
        e.preventDefault();
        const shopSection = document.querySelector('#shop-section');
        shopSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Quick View Modal Functionality
    const modal = document.querySelector('.quick-view-modal');
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    const closeModal = document.querySelector('.close-modal');

    quickViewButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Add fade-in animation
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }, 300);
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    });

    // Color Selection
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            colorButtons.forEach(btn => btn.style.border = '2px solid transparent');
            // Add active class to clicked button
            button.style.border = '2px solid #333';
        });
    });

    // Image Dots Navigation
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Remove active class from all dots
            dots.forEach(d => d.classList.remove('active'));
            // Add active class to clicked dot
            dot.classList.add('active');
            // Here you would typically change the main image
            // mainImage.src = `product-image-${index + 1}.jpg`;
        });
    });
});


// script.js
document.getElementById("menuToggle").addEventListener("click", function () {
    const navLinks = document.getElementById("navLinks");
    navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
});
