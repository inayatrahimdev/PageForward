// Book Request Function
function requestBook(bookTitle) {
    // Redirect directly to the Google Form for getting books
    window.open('https://forms.gle/LeDorPLgUH9xrAD46', '_blank');
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }

    // Sticky Header
    const header = document.getElementById('header');
    const scrollThreshold = 50;

    window.addEventListener('scroll', function () {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active Navigation Link
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', function () {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').substring(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            // Scroll Down
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            // Scroll Up
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in animation to elements
    document.querySelectorAll('.counter-item, .program-card, .involvement-card').forEach(el => {
        observer.observe(el);
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;

            // Here you would typically send this to your backend
            // For now, we'll just show a success message
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        });
    }

    // Counter Animation
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16); // ~60fps
        const counter = element.querySelector('.counter');

        function updateCounter() {
            start += increment;
            if (start < target) {
                counter.textContent = Math.floor(start) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        }

        updateCounter();
    }

    // Initialize counters when they come into view
    const counterItems = document.querySelectorAll('.counter-item');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target.querySelector('.counter');
                const textValue = counter.textContent.trim();
                const target = parseInt(textValue.replace('+', '')) || 0;
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counterItems.forEach(item => counterObserver.observe(item));

    // Team member hover effect
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', () => {
            member.querySelector('.member-overlay').style.opacity = '1';
        });

        member.addEventListener('mouseleave', () => {
            member.querySelector('.member-overlay').style.opacity = '0';
        });
    });

    // Form handling with formsubmit.co
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showMessage(form, 'Thank you for your submission!', 'success');
                    form.reset();
                } else {
                    throw new Error('Something went wrong');
                }
            } catch (error) {
                showMessage(form, 'Something went wrong. Please try again.', 'error');
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    });

    // Show success/error message
    function showMessage(form, message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;

        // Remove any existing messages
        const existingMessage = form.querySelector(`.${type}-message`);
        if (existingMessage) {
            existingMessage.remove();
        }

        form.appendChild(messageDiv);

        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.vision-card, .mission-card, .member-card, .program-card');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // Add scroll-to-top button
    const scrollTopButton = document.createElement('button');
    scrollTopButton.innerHTML = '↑';
    scrollTopButton.className = 'scroll-to-top';
    document.body.appendChild(scrollTopButton);

    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/hide scroll-to-top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopButton.classList.add('visible');
        } else {
            scrollTopButton.classList.remove('visible');
        }
    });

    // Add CSS for scroll-to-top button
    const style = document.createElement('style');
    style.textContent = `
            .scroll-to-top {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--primary-color);
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: none;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.3s, transform 0.3s;
                transform: translateY(100px);
                z-index: 1000;
            }
            
            .scroll-to-top.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .scroll-to-top:hover {
                background: var(--secondary-color);
            }
        `;
    document.head.appendChild(style);

    // Modal logic for Get Books
    function openGetBooksModal() {
        document.getElementById('bookCategoriesModal').style.display = 'block';
    }
    function closeGetBooksModal() {
        document.getElementById('bookCategoriesModal').style.display = 'none';
    }
    // Close modal when clicking outside or pressing Escape
    window.addEventListener('click', function (event) {
        const modal = document.getElementById('bookCategoriesModal');
        if (event.target === modal) {
            closeGetBooksModal();
        }
    });
    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeGetBooksModal();
        }
    });

    // AI Chatbot Functionality
    const chatbotData = {
        "about pageforward": {
            response: "PageForward is a student-driven non-profit organization focused on creating a sustainable future through education. We collect, redistribute, and recycle educational materials like books and notebooks, making them accessible to underprivileged students while reducing environmental impact. Our mission extends beyond recycling - we're creating a movement of conscious education that respects both learning and our environment.",
            actions: ["Our Team", "Our Programs", "Environmental Impact"]
        },
        "mission": {
            response: "Our mission is to collect, redistribute, and recycle educational materials, making them accessible to underprivileged students while reducing environmental impact and promoting sustainable practices in education.",
            actions: ["Our Vision", "Programs", "Get Involved"]
        },
        "vision": {
            response: "Our vision is to create a world where every student has access to quality education materials while promoting environmental sustainability through the reuse and recycling of educational resources.",
            actions: ["Our Mission", "Environmental Impact", "Team"]
        },
        "team": {
            response: "Our passionate team includes:\n\n👨‍💼 **Abdul Rahim** - President: Leading the change in sustainable education\n👨‍💼 **Ammar Jaffar** - Vice President: Innovation meets sustainability\n📢 **Ehtisham Niyat** - Lead Communication & Marketing: Connecting hearts through education\n📚 **Zen Ul Aabdin** - Lead Collection Officer: Every book has a story to continue\n💻 **Inayat Rahim** - Tech Lead: Technology for sustainable tomorrow",
            actions: ["Contact Team", "Join Team", "Programs"]
        },
        "programs": {
            response: "We offer four main programs:\n\n📚 **Book Collection**: Donate your used books to help students in need while reducing waste\n♻️ **Notebook Recycling**: We repurpose used notebooks to create new educational materials\n🤝 **Student Support**: Financial assistance and resources for underprivileged students\n👥 **Community Engagement**: Join our volunteer program and make a difference in your community",
            actions: ["Donate Books", "Get Books", "Volunteer"]
        },
        "donate books": {
            response: "Thank you for wanting to donate books! You can donate through our online form. We accept:\n\n📖 Fiction and Non-Fiction books\n📚 Textbooks\n👶 Children's Books\n📖 Reference Books\n\nWe offer both pickup and drop-off options. Your donated books will directly help students in need while promoting sustainability.",
            actions: ["Donation Form", "Pickup Options", "What Books Accepted"]
        },
        "get books": {
            response: "You can request free educational books through our Get Books program! We provide:\n\n📚 School Textbooks\n📓 Notebooks\n📖 Storybooks\n📚 Reference Books\n\nWe offer home delivery and self-pickup options. Simply fill out our request form with your details and book requirements.",
            actions: ["Request Form", "Delivery Options", "Book Categories"]
        },
        "volunteer": {
            response: "Join our volunteer program and make a real difference! Volunteers help with:\n\n📦 Book collection and sorting\n🚚 Distribution logistics\n📢 Community outreach\n💻 Digital initiatives\n🌱 Environmental awareness campaigns\n\nNo experience required - just passion for education and sustainability!",
            actions: ["Volunteer Form", "Volunteer Roles", "Time Commitment"]
        },
        "environmental impact": {
            response: "Our environmental impact includes:\n\n🌳 **Trees Saved**: 20+ trees saved through book reuse\n♻️ **Waste Reduction**: Reducing paper waste significantly\n🌱 **Sustainable Practices**: Promoting eco-friendly education\n🌍 **Awareness**: Building environmental consciousness in communities\n\nEvery book we save contributes to a greener planet!",
            actions: ["Our Stats", "How It Works", "Join Movement"]
        },
        "contact": {
            response: "📧 **Email**: pageforwardnonprofit@gmail.com\n📱 **Phone**: +92 3318955500\n\n**Social Media:**\n📘 Facebook: PageForward\n📷 Instagram: @pageforward.nonprofit\n💼 LinkedIn: PageForward\n\nFeel free to reach out with any questions or to learn more about our initiatives!",
            actions: ["Send Message", "Follow Social Media", "Visit Office"]
        },
        "stats": {
            response: "Our current impact:\n\n📚 **10+** Books Redistributed\n🌳 **20+** Trees Saved\n🎓 **10+** Students Helped\n📓 **10+** Notebooks Recycled\n\nThese numbers grow every day thanks to our amazing community support!",
            actions: ["Environmental Impact", "Help Grow Stats", "Share Impact"]
        },
        "president message": {
            response: "**President Abdul Rahim's Message:**\n\n\"At PageForward, we believe that education is not just about learning; it's about creating a sustainable future for generations to come. Every book we save, every student we help, and every tree we protect contributes to this vision. Join us in this noble cause of making education accessible while preserving our planet.\"\n\n- Abdul Rahim, President PageForward",
            actions: ["Meet Team", "Our Vision", "Join Us"]
        }
    };

    const chatbot = {
        isOpen: false,

        init() {
            this.bindEvents();
        },

        bindEvents() {
            const toggle = document.getElementById('chatbot-toggle');
            const close = document.getElementById('chatbot-close');
            const input = document.getElementById('chatbot-input');
            const send = document.getElementById('chatbot-send');

            toggle.addEventListener('click', () => this.toggleChat());
            close.addEventListener('click', () => this.closeChat());
            send.addEventListener('click', () => this.sendMessage());
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });

            // Close chatbot when clicking outside
            document.addEventListener('click', (e) => {
                const container = document.getElementById('chatbot-container');
                if (!container.contains(e.target) && this.isOpen) {
                    this.closeChat();
                }
            });
        },

        toggleChat() {
            const window = document.getElementById('chatbot-window');
            if (this.isOpen) {
                this.closeChat();
            } else {
                window.classList.add('active');
                this.isOpen = true;
                document.getElementById('chatbot-input').focus();
            }
        },

        closeChat() {
            const window = document.getElementById('chatbot-window');
            window.classList.remove('active');
            this.isOpen = false;
        },

        sendMessage() {
            const input = document.getElementById('chatbot-input');
            const message = input.value.trim();

            if (!message) return;

            this.addMessage(message, 'user');
            input.value = '';

            // Show typing indicator
            this.showTyping();

            // Process message after delay
            setTimeout(() => {
                this.hideTyping();
                this.processMessage(message);
            }, 1000);
        },

        addMessage(content, type) {
            const messages = document.getElementById('chatbot-messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}-message`;

            if (type === 'bot') {
                messageDiv.innerHTML = `
                    <div class="message-content">
                        ${this.formatMessage(content.response || content)}
                        ${content.actions ? this.createQuickActions(content.actions) : ''}
                    </div>
                `;
            } else {
                messageDiv.innerHTML = `
                    <div class="message-content">
                        <p>${content}</p>
                    </div>
                `;
            }

            messages.appendChild(messageDiv);
            messages.scrollTop = messages.scrollHeight;
        },

        formatMessage(text) {
            // Convert markdown-style formatting to HTML
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/\n/g, '<br>')
                .replace(/^/, '<p>')
                .replace(/$/, '</p>');
        },

        createQuickActions(actions) {
            return `
                <div class="quick-actions">
                    ${actions.map(action =>
                `<button class="quick-action-btn" onclick="chatbot.handleQuickAction('${action}')">${action}</button>`
            ).join('')}
                </div>
            `;
        },

        handleQuickAction(action) {
            this.addMessage(action, 'user');
            setTimeout(() => {
                this.processMessage(action);
            }, 500);
        },

        showTyping() {
            const messages = document.getElementById('chatbot-messages');
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot-message';
            typingDiv.id = 'typing-indicator';
            typingDiv.innerHTML = `
                <div class="message-content typing-indicator">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
            messages.appendChild(typingDiv);
            messages.scrollTop = messages.scrollHeight;
        },

        hideTyping() {
            const typing = document.getElementById('typing-indicator');
            if (typing) typing.remove();
        },

        processMessage(message) {
            const lowerMessage = message.toLowerCase();

            // Find matching response
            let response = null;

            for (const [key, value] of Object.entries(chatbotData)) {
                if (lowerMessage.includes(key) || this.fuzzyMatch(lowerMessage, key)) {
                    response = value;
                    break;
                }
            }

            // If no specific match, try broader matching
            if (!response) {
                // Check for general greetings
                if (this.isGreeting(lowerMessage)) {
                    response = {
                        response: "Hello! 👋 Welcome to PageForward! I'm here to help you with any questions about our organization, programs, or how you can get involved. What would you like to know?",
                        actions: ["About PageForward", "Our Programs", "Donate Books", "Get Books", "Volunteer"]
                    };
                }
                // Check for help requests
                else if (this.isHelpRequest(lowerMessage)) {
                    response = {
                        response: "I'm here to help! 🤝 Here's what I can assist you with regarding PageForward:",
                        actions: ["About PageForward", "Our Programs", "Donate Books", "Get Books", "Volunteer", "Contact", "Environmental Impact", "Our Team"]
                    };
                }
                // Check for thank you messages
                else if (this.isThankYou(lowerMessage)) {
                    response = {
                        response: "You're very welcome! 😊 I'm glad I could help. Is there anything else you'd like to know about PageForward?",
                        actions: ["Our Programs", "Get Involved", "Contact"]
                    };
                }
                // Default fallback response
                else {
                    response = {
                        response: "I'd be happy to help you learn more about PageForward! 📚 Here are some topics I can assist with:",
                        actions: ["About PageForward", "Our Programs", "Donate Books", "Get Books", "Volunteer", "Contact", "Environmental Impact", "Our Team"]
                    };
                }
            }

            this.addMessage(response, 'bot');
        },

        isGreeting(message) {
            const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'];
            return greetings.some(greeting => message.includes(greeting));
        },

        isHelpRequest(message) {
            const helpWords = ['help', 'assist', 'support', 'guide', 'information', 'tell me'];
            return helpWords.some(word => message.includes(word));
        },

        isThankYou(message) {
            const thankWords = ['thank', 'thanks', 'appreciate', 'grateful'];
            return thankWords.some(word => message.includes(word));
        },

        fuzzyMatch(input, keyword) {
            // Expanded fuzzy matching for common variations
            const variations = {
                'about pageforward': ['about', 'pageforward', 'what is', 'who are', 'organization', 'company', 'info', 'information'],
                'donate books': ['donate', 'donation', 'give books', 'book donation', 'contribute books', 'share books'],
                'get books': ['get books', 'request books', 'need books', 'free books', 'book request', 'obtain books'],
                'volunteer': ['volunteer', 'join', 'help', 'participate', 'get involved', 'work with'],
                'contact': ['contact', 'email', 'phone', 'reach', 'get in touch', 'communicate'],
                'team': ['team', 'members', 'staff', 'people', 'who works', 'leadership'],
                'programs': ['programs', 'services', 'what do you do', 'activities', 'initiatives', 'projects'],
                'environmental impact': ['environment', 'trees', 'sustainability', 'impact', 'green', 'eco', 'planet'],
                'mission': ['mission', 'purpose', 'goal', 'objective', 'aim'],
                'vision': ['vision', 'future', 'dream', 'aspiration'],
                'stats': ['stats', 'statistics', 'numbers', 'data', 'impact numbers', 'achievements'],
                'president message': ['president', 'abdul rahim', 'leader', 'ceo', 'head']
            };

            if (variations[keyword]) {
                return variations[keyword].some(variation => input.includes(variation));
            }

            return false;
        }
    };

    // Initialize chatbot
    chatbot.init();

    // Make functions globally available
    window.openGetBooksModal = openGetBooksModal;
    window.closeGetBooksModal = closeGetBooksModal;
    window.chatbot = chatbot;
});

