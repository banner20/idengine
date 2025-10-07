// Screen Navigation
function switchScreen(screenName) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // Show selected screen
    const targetScreen = document.getElementById(`${screenName}-screen`);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    
    // Update nav buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    const activeNav = Array.from(navButtons).find(btn => 
        btn.getAttribute('onclick').includes(screenName)
    );
    if (activeNav) {
        activeNav.classList.add('active');
    }
}

// Profile Tabs
function switchTab(tabName) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    const activeTab = Array.from(tabButtons).find(btn => 
        btn.getAttribute('onclick').includes(tabName)
    );
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Update tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    const targetContent = document.getElementById(`${tabName}-tab`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// Jam Session Modal
let jamTimer;
let jamTimeRemaining;

function startJam(minutes) {
    const modal = document.getElementById('jam-modal');
    modal.classList.add('active');
    
    jamTimeRemaining = minutes * 60; // Convert to seconds
    updateTimerDisplay();
    
    // Clear any existing timer
    if (jamTimer) {
        clearInterval(jamTimer);
    }
    
    // Start countdown
    jamTimer = setInterval(() => {
        jamTimeRemaining--;
        updateTimerDisplay();
        
        if (jamTimeRemaining <= 0) {
            clearInterval(jamTimer);
            showJamComplete();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(jamTimeRemaining / 60);
    const seconds = jamTimeRemaining % 60;
    const timerElement = document.getElementById('timer');
    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function showJamComplete() {
    const modal = document.getElementById('jam-modal');
    const modalContent = modal.querySelector('.modal-content');
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>JAM SAVED</h2>
            <button class="close-btn" onclick="closeModal()">×</button>
        </div>
        <div class="jam-complete-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#FF9500" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        </div>
        <div class="jam-complete-text">
            Your loop has been saved!
        </div>
        <div class="jam-name-input">
            <label for="jamName">NAME YOUR JAM</label>
            <input type="text" id="jamName" placeholder="e.g., Morning Vibe" />
        </div>
        <div class="jam-complete-actions">
            <button class="btn-primary" onclick="saveJamName()">SAVE & VIEW JAM</button>
            <button class="btn-secondary" onclick="closeModalAndReload()">SAVE & CONTINUE</button>
        </div>
    `;
}

function closeModal() {
    const modal = document.getElementById('jam-modal');
    modal.classList.remove('active');
    
    if (jamTimer) {
        clearInterval(jamTimer);
    }
    
    // Reset modal content
    resetModalContent();
}

function closeModalAndReload() {
    closeModal();
    switchScreen('profile');
}

function saveJamName() {
    const jamName = document.getElementById('jamName').value || 'Untitled Jam';
    // In production, this would save to backend
    console.log('Saved jam:', jamName);
    closeModal();
    switchScreen('profile');
    // Show a subtle notification (optional)
    alert(`✓ Saved as "${jamName}"`);
}

function resetModalContent() {
    const modal = document.getElementById('jam-modal');
    const modalContent = modal.querySelector('.modal-content');
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>JAM SESSION</h2>
            <button class="close-btn" onclick="closeModal()">×</button>
        </div>
        <div class="timer-display">
            <div class="timer" id="timer">5:00</div>
            <div class="timer-label">REMAINING</div>
        </div>
        <div class="jam-instructions">
            Open your Muse hardware device and start creating!
            The timer will sync automatically when you begin.
        </div>
        <button class="btn-primary" onclick="showJamComplete()">END SESSION</button>
    `;
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Animate waveforms on scroll
const waveformObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.wave-bar');
            bars.forEach((bar, index) => {
                bar.style.animationDelay = `${index * 0.05}s`;
            });
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const waveforms = document.querySelectorAll('.waveform');
    waveforms.forEach(waveform => {
        waveformObserver.observe(waveform);
    });
});

// Add click feedback to buttons
document.addEventListener('click', (e) => {
    if (e.target.matches('button')) {
        e.target.style.transform = 'scale(0.98)';
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 100);
    }
});

// Simulate real-time updates (for demo purposes)
function simulateActivity() {
    // Randomly update stats
    setInterval(() => {
        const loopsCreatedElement = document.querySelector('.stat-card:nth-child(2) .stat-value');
        if (loopsCreatedElement && Math.random() > 0.95) {
            const currentValue = parseInt(loopsCreatedElement.textContent);
            loopsCreatedElement.textContent = currentValue + 1;
        }
    }, 5000);
}

// Challenge Carousel
function initCarousel() {
    const carousel = document.getElementById('challengeCarousel');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    
    if (!carousel) return;
    
    // Update dots on scroll
    carousel.addEventListener('scroll', () => {
        const scrollLeft = carousel.scrollLeft;
        const cardWidth = carousel.offsetWidth;
        const currentIndex = Math.round(scrollLeft / cardWidth);
        
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    });
    
    // Click dots to navigate
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const cardWidth = carousel.offsetWidth;
            carousel.scrollTo({
                left: cardWidth * index,
                behavior: 'smooth'
            });
        });
    });
}

// Play Challenge Sample
function playChallengeSample() {
    // Simulate playing a sample
    alert('🔊 Playing challenge sample...');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    simulateActivity();
    initCarousel();
});



