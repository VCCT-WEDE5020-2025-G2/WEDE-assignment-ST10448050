// main.js – interactive features for Urban Threads website

document.addEventListener('DOMContentLoaded', () => {
    initAccordion();
    initSearch();
    initDynamicContent();
    initGallery();
    initMap();
    initEnquiryForm();
    initContactForm();
});

// Accordion toggle for collections
function initAccordion() {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const open = content.classList.contains('open');
            if (open) {
                content.classList.remove('open');
                content.style.maxHeight = null;
            } else {
                content.classList.add('open');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

// Search filter for collections
function initSearch() {
    const searchInput = document.getElementById('searchBox');
    const list = document.getElementById('itemList');
    if (!searchInput || !list) return;
    const items = Array.from(list.children);
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? '' : 'none';
        });
    });
}

// Load dynamic events/news into the home page
function initDynamicContent() {
    const container = document.getElementById('dynamicContent');
    if (!container) return;
    const data = [
        { title: 'Summer Clearance Sale', description: 'Up to 60% off selected items. Ends 31 December.' },
        { title: 'New Denim Drop', description: 'Our latest denim collection has arrived. Shop now for new styles.' },
        { title: 'Exclusive Collab', description: 'Urban Threads × Local Artist limited collection launching next month.' },
        { title: 'Student Discount', description: 'Students get 10% off all purchases with valid student ID.' }
    ];
    const listEl = document.createElement('ul');
    data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<h3>${item.title}</h3><p>${item.description}</p>`;
        listEl.appendChild(li);
    });
    container.appendChild(listEl);
}

// Gallery lightbox
function initGallery() {
    const gallery = document.querySelector('.gallery');
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<img class="lightbox-image" src="" alt="" />';
    document.body.appendChild(overlay);
    const lightboxImg = overlay.querySelector('.lightbox-image');
    if (gallery) {
        gallery.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                lightboxImg.src = e.target.src;
                lightboxImg.alt = e.target.alt;
                overlay.classList.add('show');
            }
        });
    }
    overlay.addEventListener('click', () => {
        overlay.classList.remove('show');
    });
}

// Initialise Leaflet map
function initMap() {
    const mapDiv = document.getElementById('map');
    if (!mapDiv) return;
    // Coordinates for East London, Eastern Cape (example location)
    const lat = -33.0153;
    const lng = 27.9116;
    const map = L.map('map').setView([lat, lng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    L.marker([lat, lng]).addTo(map)
        .bindPopup('Urban Threads – 123 Fashion Street, City Hub')
        .openPopup();
}

// Enquiry form handling
function initEnquiryForm() {
    const form = document.getElementById('enquiryForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearMessages(form);
        const data = new FormData(form);
        const name = data.get('name').trim();
        const email = data.get('email').trim();
        const phone = data.get('phone').trim();
        const type = data.get('type');
        const message = data.get('message').trim();
        let valid = true;
        if (!name) {
            showError(form, 'name', 'Name is required.');
            valid = false;
        }
        if (!email || !validateEmail(email)) {
            showError(form, 'email', 'Please enter a valid email address.');
            valid = false;
        }
        if (!phone || !/^[+]?\\d{6,15}$/.test(phone)) {
            showError(form, 'phone', 'Please enter a valid phone number.');
            valid = false;
        }
        if (!message) {
            showError(form, 'message', 'Message cannot be empty.');
            valid = false;
        }
        if (!valid) return;
        const resultDiv = document.getElementById('enquiryResult');
        resultDiv.textContent = 'Submitting…';
        setTimeout(() => {
            let response;
            switch (type) {
                case 'product':
                    response = 'Thank you for your interest in our products. We will respond shortly.';
                    break;
                case 'service':
                    response = 'Thanks for enquiring about our services. We will get back to you soon.';
                    break;
                case 'collaboration':
                    response = 'We appreciate your collaboration proposal! Our team will reach out shortly.';
                    break;
                default:
                    response = 'Thank you for contacting us.';
            }
            resultDiv.textContent = response;
            resultDiv.className = 'success-message';
            form.reset();
        }, 1000);
    });
}

// Contact form handling
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearMessages(form);
        const data = new FormData(form);
        const name = data.get('name').trim();
        const email = data.get('email').trim();
        const type = data.get('type');
        const subject = data.get('subject').trim();
        const message = data.get('message').trim();
        let valid = true;
        if (!name) {
            showError(form, 'name', 'Name is required.');
            valid = false;
        }
        if (!email || !validateEmail(email)) {
            showError(form, 'email', 'Please enter a valid email address.');
            valid = false;
        }
        if (!subject) {
            showError(form, 'subject', 'Subject is required.');
            valid = false;
        }
        if (!message) {
            showError(form, 'message', 'Message cannot be empty.');
            valid = false;
        }
        if (!valid) return;
        const resultDiv = document.getElementById('contactResult');
        const recipient = 'info@urbanthreads.co.za';
        const mailSubject = encodeURIComponent(`${type}: ${subject}`);
        const body = encodeURIComponent(`Name: ${name}\\nEmail: ${email}\\n\\n${message}`);
        const mailto = `mailto:${recipient}?subject=${mailSubject}&body=${body}`;
        resultDiv.innerHTML = `Your message is ready. <a href="${mailto}">Click here to open your email client.</a>`;
        resultDiv.className = 'success-message';
        form.reset();
    });
}

// Utility functions
function showError(form, fieldName, message) {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (field) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        field.insertAdjacentElement('afterend', error);
    }
}

function clearMessages(form) {
    form.querySelectorAll('.error-message, .success-message').forEach(el => el.remove());
    const resultEnquiry = document.getElementById('enquiryResult');
    const resultContact = document.getElementById('contactResult');
    if (resultEnquiry) {
        resultEnquiry.textContent = '';
        resultEnquiry.className = '';
    }
    if (resultContact) {
        resultContact.textContent = '';
        resultContact.className = '';
    }
}

function validateEmail(email) {
    const re = /^[\\w.-]+@[\\w.-]+\\.\\w{2,}$/;
    return re.test(email);
}
