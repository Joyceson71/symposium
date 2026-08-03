document.addEventListener('DOMContentLoaded', () => {
    const ring = document.getElementById('event-carousel');
    const cards = document.querySelectorAll('.holo-card');
    const nextBtn = document.getElementById('carousel-next');
    const prevBtn = document.getElementById('carousel-prev');
    
    if (!ring || cards.length === 0) return;

    let currentAngle = 0;
    const numCards = cards.length;
    const theta = 360 / numCards;
    // Calculate radius to fit cards (approximate)
    const cardWidth = 280;
    const radius = Math.round((cardWidth / 2) / Math.tan(Math.PI / numCards));

    function setupCarousel() {
        if (window.innerWidth <= 768) {
            // Mobile fallback handles positioning natively via CSS
            cards.forEach(card => card.style.transform = '');
            ring.style.transform = '';
            return;
        }

        // Desktop 3D Ring
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

    // Swipe/Drag support
    let startX = 0;
    let isDragging = false;

    ring.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    ring.addEventListener('mousemove', (e) => {
        if(!isDragging) return;
        const delta = e.pageX - startX;
        if(Math.abs(delta) > 50) {
            if(delta > 0) currentAngle += theta;
            else currentAngle -= theta;
            updateCarousel();
            isDragging = false; // Reset to prevent multiple spins
        }
    });

    ring.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, {passive: true});

    ring.addEventListener('touchend', (e) => {
        const delta = e.changedTouches[0].clientX - startX;
        if(Math.abs(delta) > 50) {
            if(delta > 0) currentAngle += theta;
            else currentAngle -= theta;
            updateCarousel();
        }
    });

    // Handle resize
    window.addEventListener('resize', () => {
        setupCarousel();
    });

    // Init
    setupCarousel();
});
