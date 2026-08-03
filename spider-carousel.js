document.addEventListener('DOMContentLoaded', () => {
    const ring = document.getElementById('event-carousel');
    const cards = document.querySelectorAll('.holo-card');
    const nextBtn = document.getElementById('carousel-next');
    const prevBtn = document.getElementById('carousel-prev');
    
    if (!ring || cards.length === 0) return;

    let currentAngle = 0;
    const numCards = cards.length;
    const theta = 360 / numCards;
    const cardWidth = 320; // Increased size
    const radius = Math.round((cardWidth / 2) / Math.tan(Math.PI / numCards)) + 50; // Added padding

    function setupCarousel() {
        if (window.innerWidth <= 768) {
            cards.forEach(card => card.style.transform = '');
            ring.style.transform = '';
            return;
        }
        cards.forEach((card, i) => {
            const angle = theta * i;
            card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        });
        updateCarousel();
    }

    function updateCarousel() {
        if (window.innerWidth > 768) {
            ring.style.transform = `translateZ(-${radius}px) rotateY(${currentAngle}deg)`;
        }
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            currentAngle -= theta;
            updateCarousel();
        });
        prevBtn.addEventListener('click', () => {
            currentAngle += theta;
            updateCarousel();
        });
    }

    // Auto-Rotate Logic
    let autoRotateInterval = setInterval(() => {
        if (window.innerWidth > 768 && !isDragging) {
            currentAngle -= (theta / 300); // Super slow continuous rotation
            updateCarousel();
        }
    }, 16);

    // Pause auto-rotate on hover
    ring.addEventListener('mouseenter', () => clearInterval(autoRotateInterval));
    ring.addEventListener('mouseleave', () => {
        clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(() => {
            if (window.innerWidth > 768 && !isDragging) {
                currentAngle -= (theta / 300);
                updateCarousel();
            }
        }, 16);
    });

    // Smooth Dragging
    let startX = 0;
    let isDragging = false;
    let startAngle = 0;

    ring.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        startAngle = currentAngle;
        ring.style.transition = 'none'; // Disable CSS transition for smooth drag
    });

    window.addEventListener('mouseup', () => {
        if(isDragging) {
            isDragging = false;
            ring.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            // Snap to nearest card
            currentAngle = Math.round(currentAngle / theta) * theta;
            updateCarousel();
        }
    });

    ring.addEventListener('mousemove', (e) => {
        if(!isDragging) return;
        const delta = e.pageX - startX;
        currentAngle = startAngle + (delta * 0.2); // Sensitivity
        updateCarousel();
    });

    ring.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        startAngle = currentAngle;
        ring.style.transition = 'none';
    }, {passive: true});

    ring.addEventListener('touchend', () => {
        if(isDragging) {
            isDragging = false;
            ring.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            currentAngle = Math.round(currentAngle / theta) * theta;
            updateCarousel();
        }
    });

    ring.addEventListener('touchmove', (e) => {
        if(!isDragging) return;
        const delta = e.touches[0].clientX - startX;
        currentAngle = startAngle + (delta * 0.2);
        updateCarousel();
    }, {passive: true});

    window.addEventListener('resize', () => {
        setupCarousel();
    });

    setupCarousel();
});
