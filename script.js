document.addEventListener('DOMContentLoaded', function() {
    // Hamburger Menu Toggle
    const hamburgerButton = document.getElementById('hamburger-button');
    const header = document.querySelector('header');

    hamburgerButton.addEventListener('click', function() {
        header.classList.toggle('nav-active');
    });

    // Smooth scrolling for all on-page anchor links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    for (const link of smoothScrollLinks) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            // Use a fallback for href="#" to scroll to top
            const targetElement = document.getElementById(targetId) || document.body;
            
            if (targetElement) {
                // Calculate scroll position, accounting for the fixed header
                const offsetTop = (targetId === 'hero' || targetId === '') ? 0 : targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Close the mobile menu if it's active
            if (header.classList.contains('nav-active')) {
                header.classList.remove('nav-active');
            }
        });
    }

    // Modal handling
    const modal = document.getElementById("responseModal");
    const modalMessage = document.getElementById("modal-message");
    const closeButton = document.querySelector(".close-button");

    function showModal(message) {
        modalMessage.textContent = message;
        modal.style.display = "block";
    }

    function closeModal() {
        modal.style.display = "none";
        // Scroll to top after closing the modal
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    closeButton.addEventListener("click", closeModal);
    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            closeModal();
        }
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    const scriptURL = 'http://127.0.0.1:5000/submit';

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Envoi en cours...';
        submitButton.disabled = true;

        const formData = new FormData(contactForm);
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        fetch(scriptURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                console.log('Server Response Object:', response);
                return response.text(); // Get response as TEXT first for debugging
            })
            .then(text => {
                console.log('Server Response Body (as text):', text);
                try {
                    const data = JSON.parse(text); // Manually try to parse the text
                    if (data.result === 'success') {
                        showModal('Merci ! Votre demande de réservation a été envoyée avec succès. Nous vous contacterons bientôt pour confirmer.');
                    } else {
                        console.error('Error from Google Script logic:', data.error);
                        showModal('Une erreur s\'est produite lors du traitement de votre demande.');
                    }
                } catch (e) {
                    // This will catch errors if the response text is not valid JSON (e.g., an HTML error page from Google)
                    console.error("Failed to parse server response as JSON:", e);
                    showModal("Le serveur a renvoyé une réponse inattendue. Veuillez contacter le support technique.");
                }
            })
            .catch(error => {
                // This will catch network errors (CORS, DNS, etc.)
                console.error('Fetch Communication Error!', error.message);
                showModal('Une erreur de communication s\'est produite. Veuillez vérifier votre connexion ou nous appeler directement.');
            })
            .finally(() => {
                contactForm.reset();
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
    });

    // Initialize Flatpickr for the appointment field
    if (typeof flatpickr !== 'undefined') {
        flatpickr("#appointment", {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            "locale": "fr",
            altInput: true,
            altFormat: "j F Y, H:i",
            minuteIncrement: 15,
            theme: "dark"
        });
    }

    // Background Slideshow
    const slideshowImages = document.querySelectorAll('#background-slideshow img');
    let currentImageIndex = 0;

    function startSlideshow() {
        if (slideshowImages.length === 0) return;
        slideshowImages[currentImageIndex].classList.add('active');
        setInterval(() => {
            slideshowImages[currentImageIndex].classList.remove('active');
            currentImageIndex = (currentImageIndex + 1) % slideshowImages.length;
            slideshowImages[currentImageIndex].classList.add('active');
        }, 5000);
    }

    startSlideshow();

    // Initialize Interactive Map
    function initMap() {
        if(typeof L === 'undefined') return; // Don't run if Leaflet is not loaded

        const map = L.map('map').setView([48.8566, 2.3522], 10);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        // Custom Icon
        const goldIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        // Markers
        L.marker([49.0097, 2.5479], {icon: goldIcon}).addTo(map)
            .bindPopup('<b>Aéroport Charles de Gaulle (CDG)</b>');

        L.marker([48.7233, 2.3795], {icon: goldIcon}).addTo(map)
            .bindPopup('<b>Aéroport d\'Orly (ORY)</b>');

        L.marker([48.8566, 2.3522], {icon: goldIcon}).addTo(map)
            .bindPopup('<b>Paris Centre</b>');

        // Service Area Circle
        L.circle([48.8566, 2.3522], {
            color: '#FFD700',
            fillColor: '#FFD700',
            fillOpacity: 0.1,
            radius: 20000 // 20km radius
        }).addTo(map);
    }

    initMap();

    // Fetch and display visitor count
    function fetchVisitorCount() {
        // The same script URL is used for GET requests to the doGet function
        fetch(scriptURL)
            .then(response => response.json())
            .then(data => {
                if (data.count) {
                    const countElement = document.querySelector('#visitor-counter .count');
                    if (countElement) {
                        countElement.textContent = data.count;
                    }
                } else if (data.error) {
                    console.error('Error fetching visitor count:', data.error);
                }
            })
            .catch(error => {
                console.error('Fetch Error for visitor count:', error.message);
            });
    }

    fetchVisitorCount();
});
