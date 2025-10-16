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

// Challenge Detail Modal
const challengeData = {
    'analog-drift': {
        title: 'Analog Drift Vol.3',
        type: 'SOUND PACK EXPLORATION',
        status: 'ACTIVE',
        description: 'Build a 16-bar loop using tape-saturated samples from the Analog Drift collection. Minimum 3 layers.',
        timeLeft: '2 DAYS LEFT',
        participants: 342,
        submissions: 289,
        requirements: [
            'Use samples from Analog Drift collection only',
            'Minimum 3 layers required',
            'Loop must be exactly 16 bars',
            'Include tape saturation effects'
        ],
        examples: [
            { username: '@kai_beats', title: 'Tape Hiss Dreams', likes: 247, remixes: 18 },
            { username: '@maya_music', title: 'Vintage Vibes', likes: 189, remixes: 12 }
        ]
    },
    'vinyl-archaeology': {
        title: 'Vinyl Archaeology #12',
        type: 'SAMPLE DECONSTRUCTION',
        status: 'UPCOMING',
        description: 'Deconstruct a 1974 jazz recording into something unrecognizable. Pitch, time-stretch, destroy.',
        timeLeft: 'STARTS IN 3 DAYS',
        participants: 0,
        submissions: 0,
        requirements: [
            'Use only the provided 1974 jazz sample',
            'Must be completely unrecognizable from original',
            'Include pitch manipulation',
            'Include time-stretching effects',
            'Add destructive processing'
        ],
        examples: [
            { username: '@sample_destroyer', title: 'Jazz Deconstruction', likes: 156, remixes: 8 },
            { username: '@vinyl_alchemist', title: 'Time Warp', likes: 203, remixes: 15 }
        ]
    },
    '300-seconds': {
        title: '300 Seconds: No Edits',
        type: 'TIMED EXPERIMENT',
        status: 'ACTIVE',
        description: '5 minutes. One take. No undo. Capture the imperfect magic of real-time creation.',
        timeLeft: '1 DAY LEFT',
        participants: 567,
        submissions: 445,
        requirements: [
            'Exactly 5 minutes of recording',
            'No undo or editing allowed',
            'One continuous take only',
            'Must be recorded live'
        ],
        examples: [
            { username: '@live_looper', title: 'One Take Wonder', likes: 312, remixes: 24 },
            { username: '@imperfect_beats', title: 'Raw Magic', likes: 278, remixes: 19 }
        ]
    }
};

function openChallengeDetail(challengeId, element) {
    const challenge = challengeData[challengeId];
    if (!challenge) return;

    const modal = document.getElementById('challenge-detail-modal');
    
    // Update modal content
    document.getElementById('challenge-detail-name').textContent = challenge.title;
    document.getElementById('challenge-detail-type').textContent = challenge.type;
    document.getElementById('challenge-detail-description').textContent = challenge.description;
    document.getElementById('challenge-detail-time').textContent = challenge.timeLeft;
    document.getElementById('challenge-detail-participants').textContent = challenge.participants;
    document.getElementById('challenge-detail-submissions').textContent = challenge.submissions;
    
    // Update status
    const statusIndicator = document.getElementById('challenge-detail-status-indicator');
    const statusText = document.getElementById('challenge-detail-status-text');
    if (challenge.status === 'ACTIVE') {
        statusIndicator.textContent = '●';
        statusIndicator.style.color = 'var(--accent-orange)';
        statusText.textContent = 'ACTIVE';
    } else {
        statusIndicator.textContent = '○';
        statusIndicator.style.color = 'var(--text-secondary)';
        statusText.textContent = 'UPCOMING';
    }
    
    // Update requirements
    const requirementsList = document.getElementById('challenge-detail-requirements');
    requirementsList.innerHTML = '';
    challenge.requirements.forEach(req => {
        const li = document.createElement('li');
        li.textContent = req;
        requirementsList.appendChild(li);
    });
    
    // Update examples
    const exampleGrid = document.querySelector('.example-grid');
    exampleGrid.innerHTML = '';
    challenge.examples.forEach(example => {
        const exampleItem = document.createElement('div');
        exampleItem.className = 'example-item';
        exampleItem.innerHTML = `
            <div class="example-avatar">${example.username.charAt(1).toUpperCase()}</div>
            <div class="example-info">
                <div class="example-username">${example.username}</div>
                <div class="example-title">${example.title}</div>
                <div class="example-stats">❤️ ${example.likes} • 🔄 ${example.remixes}</div>
            </div>
        `;
        exampleGrid.appendChild(exampleItem);
    });
    
    // Update join button
    const joinBtn = document.getElementById('join-challenge-btn');
    if (challenge.status === 'ACTIVE') {
        joinBtn.textContent = 'JOIN CHALLENGE';
        joinBtn.onclick = () => joinChallenge(challengeId);
    } else {
        joinBtn.textContent = 'NOTIFY WHEN LIVE';
        joinBtn.onclick = () => notifyWhenLive(challengeId);
    }
    
    modal.classList.add('active');
}

function closeChallengeDetail() {
    const modal = document.getElementById('challenge-detail-modal');
    modal.classList.remove('active');
}

function joinChallenge(challengeId) {
    // In production, this would sync with hardware and backend
    alert(`🎵 Joining ${challengeData[challengeId].title} challenge!`);
    closeChallengeDetail();
    // Could redirect to recording screen or start jam session
}

function notifyWhenLive(challengeId) {
    // In production, this would set up push notifications
    alert(`🔔 We'll notify you when ${challengeData[challengeId].title} goes live!`);
    closeChallengeDetail();
}

function viewAllSubmissions() {
    // In production, this would open a submissions feed
    alert('📋 Opening all submissions...');
    closeChallengeDetail();
}

// Profile Edit Functions
function openProfileEdit() {
    const modal = document.getElementById('profile-edit-modal');
    modal.classList.add('active');
    
    // Initialize genre tags
    initGenreTags();
}

function closeProfileEdit() {
    const modal = document.getElementById('profile-edit-modal');
    modal.classList.remove('active');
}

function initGenreTags() {
    const genreTags = document.querySelectorAll('.genre-tag');
    genreTags.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('active');
        });
    });
}

function changeAvatar() {
    // In production, this would open an avatar picker or upload interface
    const avatars = ['YOU', '🎵', '🎧', '🎤', '🎹', '🎸', '🥁', '🎺'];
    const currentAvatar = document.getElementById('avatarPreview').textContent;
    const currentIndex = avatars.indexOf(currentAvatar);
    const nextIndex = (currentIndex + 1) % avatars.length;
    document.getElementById('avatarPreview').textContent = avatars[nextIndex];
}

function saveProfile() {
    const username = document.getElementById('editUsername').value;
    const bio = document.getElementById('editBio').value;
    const location = document.getElementById('editLocation').value;
    const avatar = document.getElementById('avatarPreview').textContent;
    
    // Get selected genres
    const selectedGenres = Array.from(document.querySelectorAll('.genre-tag.active'))
        .map(tag => tag.textContent);
    
    // Get privacy settings
    const publicProfile = document.getElementById('publicProfile').checked;
    const showActivity = document.getElementById('showActivity').checked;
    const allowRemixes = document.getElementById('allowRemixes').checked;
    
    // Update profile display
    document.querySelector('.profile-name').textContent = username;
    document.querySelector('.profile-bio').textContent = bio;
    document.querySelector('.profile-avatar').textContent = avatar;
    
    // In production, this would save to backend
    console.log('Profile saved:', {
        username, bio, location, avatar, selectedGenres,
        privacy: { publicProfile, showActivity, allowRemixes }
    });
    
    closeProfileEdit();
    alert('✅ Profile updated successfully!');
}

// Community Interaction Functions
function toggleLike(button, initialCount) {
    const likeCount = button.querySelector('.like-count');
    const currentCount = parseInt(likeCount.textContent);
    const isLiked = button.classList.contains('liked');
    
    if (isLiked) {
        likeCount.textContent = currentCount - 1;
        button.classList.remove('liked');
        button.style.color = 'var(--text-secondary)';
    } else {
        likeCount.textContent = currentCount + 1;
        button.classList.add('liked');
        button.style.color = 'var(--accent-orange)';
    }
}

function openComments(postId) {
    const modal = document.getElementById('comments-modal');
    modal.classList.add('active');
}

function closeComments() {
    const modal = document.getElementById('comments-modal');
    modal.classList.remove('active');
}

function likeComment(button) {
    const currentText = button.textContent;
    const currentCount = parseInt(currentText.split(' ')[1]);
    
    if (button.classList.contains('liked')) {
        button.textContent = `❤️ ${currentCount - 1}`;
        button.classList.remove('liked');
        button.style.color = 'var(--text-secondary)';
    } else {
        button.textContent = `❤️ ${currentCount + 1}`;
        button.classList.add('liked');
        button.style.color = 'var(--accent-orange)';
    }
}

function replyToComment(commentId) {
    const textarea = document.getElementById('newComment');
    textarea.focus();
    textarea.placeholder = 'Replying to comment...';
}

function postComment() {
    const textarea = document.getElementById('newComment');
    const commentText = textarea.value.trim();
    
    if (!commentText) return;
    
    const commentsList = document.getElementById('commentsList');
    const newComment = document.createElement('div');
    newComment.className = 'comment-item';
    newComment.innerHTML = `
        <div class="user-avatar small you">Y</div>
        <div class="comment-content">
            <div class="comment-header">
                <span class="username">@your_username</span>
                <span class="comment-time">now</span>
            </div>
            <div class="comment-text">${commentText}</div>
            <div class="comment-actions">
                <button class="comment-action" onclick="likeComment(this)">❤️ 0</button>
                <button class="comment-action" onclick="replyToComment('new-comment')">Reply</button>
            </div>
        </div>
    `;
    
    commentsList.insertBefore(newComment, commentsList.firstChild);
    textarea.value = '';
    textarea.placeholder = 'Add a comment...';
    
    // Update comment count in the main post
    const commentCounts = document.querySelectorAll('.comment-count');
    commentCounts.forEach(count => {
        const currentCount = parseInt(count.textContent);
        count.textContent = currentCount + 1;
    });
    
    alert('✅ Comment posted!');
}

function startRemix(postId) {
    // In production, this would open the remix creation interface
    alert(`🔄 Starting remix of post ${postId}! Opening remix interface...`);
    // Could redirect to a remix creation screen or open hardware sync
}

// Progress Detail Functions
const progressData = {
    'streak': {
        title: 'STREAK ANALYSIS',
        value: '3 days',
        description: 'Your current streak and historical performance',
        chart: [
            { day: 'Mon', value: 45, height: '45%' },
            { day: 'Tue', value: 60, height: '60%' },
            { day: 'Wed', value: 30, height: '30%' },
            { day: 'Thu', value: 0, height: '10%' },
            { day: 'Fri', value: 0, height: '10%' },
            { day: 'Sat', value: 0, height: '10%' },
            { day: 'Sun', value: 0, height: '10%' }
        ],
        insights: [
            { icon: '🔥', text: 'Best streak: 7 days (2 weeks ago)' },
            { icon: '📈', text: 'You\'re on track to beat your record!' },
            { icon: '⏰', text: 'Most active time: 8-10 PM' }
        ]
    },
    'loops': {
        title: 'LOOP CREATION',
        value: '12 loops',
        description: 'Your creative output and loop diversity',
        chart: [
            { day: 'Mon', value: 2, height: '40%' },
            { day: 'Tue', value: 1, height: '20%' },
            { day: 'Wed', value: 3, height: '60%' },
            { day: 'Thu', value: 0, height: '10%' },
            { day: 'Fri', value: 0, height: '10%' },
            { day: 'Sat', value: 0, height: '10%' },
            { day: 'Sun', value: 0, height: '10%' }
        ],
        insights: [
            { icon: '🎵', text: 'Average loop length: 1:43' },
            { icon: '🎧', text: 'Most used genre: Lofi' },
            { icon: '⭐', text: 'Community favorites: 3 loops' }
        ]
    },
    'time': {
        title: 'JAM TIME',
        value: '2h 30m',
        description: 'Time spent creating and practicing',
        chart: [
            { day: 'Mon', value: 25, height: '50%' },
            { day: 'Tue', value: 15, height: '30%' },
            { day: 'Wed', value: 35, height: '70%' },
            { day: 'Thu', value: 0, height: '10%' },
            { day: 'Fri', value: 0, height: '10%' },
            { day: 'Sat', value: 0, height: '10%' },
            { day: 'Sun', value: 0, height: '10%' }
        ],
        insights: [
            { icon: '⏱️', text: 'Goal: 4 hours this week (73% complete)' },
            { icon: '🏆', text: 'Personal best: 6h 15m (last month)' },
            { icon: '📊', text: 'Above average for your level!' }
        ]
    },
    'shared': {
        title: 'SOCIAL SHARING',
        value: '5 shared',
        description: 'Your community engagement and sharing activity',
        chart: [
            { day: 'Mon', value: 1, height: '50%' },
            { day: 'Tue', value: 0, height: '10%' },
            { day: 'Wed', value: 2, height: '100%' },
            { day: 'Thu', value: 0, height: '10%' },
            { day: 'Fri', value: 0, height: '10%' },
            { day: 'Sat', value: 0, height: '10%' },
            { day: 'Sun', value: 0, height: '10%' }
        ],
        insights: [
            { icon: '❤️', text: 'Total likes received: 89' },
            { icon: '🔄', text: 'Remixes of your work: 7' },
            { icon: '👥', text: 'New followers this week: 12' }
        ]
    }
};

const badgeData = {
    'quick-start': {
        title: 'Quick Start',
        icon: '⚡',
        status: 'earned',
        description: 'Created your first loop within 24 hours of joining',
        requirements: [
            { text: 'Create first loop', completed: true },
            { text: 'Complete within 24 hours', completed: true },
            { text: 'Use at least 2 samples', completed: true }
        ],
        earnedDate: '3 days ago',
        rarity: 'Common'
    },
    'first-loop': {
        title: 'First Loop',
        icon: '🎵',
        status: 'earned',
        description: 'Successfully created and saved your very first loop',
        requirements: [
            { text: 'Create a loop', completed: true },
            { text: 'Save the loop', completed: true },
            { text: 'Give it a name', completed: true }
        ],
        earnedDate: '3 days ago',
        rarity: 'Common'
    },
    'collaborator': {
        title: 'Collaborator',
        icon: '👥',
        status: 'locked',
        description: 'Work together with other creators on collaborative projects',
        requirements: [
            { text: 'Join a collaboration', completed: false, progress: '0/1' },
            { text: 'Contribute to 3 collaborative loops', completed: false, progress: '0/3' },
            { text: 'Get 5 likes on collaborative work', completed: false, progress: '0/5' }
        ],
        rarity: 'Rare'
    }
};

function openProgressDetail(metricType) {
    const data = progressData[metricType];
    if (!data) return;

    const modal = document.getElementById('progress-detail-modal');
    
    // Update title
    document.getElementById('progress-detail-title').textContent = data.title;
    
    // Update summary
    const summary = document.getElementById('progress-summary');
    summary.innerHTML = `
        <h3>${data.value}</h3>
        <p>${data.description}</p>
    `;
    
    // Update chart
    const chart = document.getElementById('progress-chart');
    chart.innerHTML = `
        <div class="chart-bars">
            ${data.chart.map(bar => `
                <div class="chart-bar" style="height: ${bar.height}" title="${bar.day}: ${bar.value}"></div>
            `).join('')}
        </div>
        <div class="chart-labels">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
        </div>
    `;
    
    // Update insights
    const insights = document.getElementById('progress-insights');
    insights.innerHTML = data.insights.map(insight => `
        <div class="insight-item">
            <div class="insight-icon">${insight.icon}</div>
            <div class="insight-text">${insight.text}</div>
        </div>
    `).join('');
    
    modal.classList.add('active');
}

function closeProgressDetail() {
    const modal = document.getElementById('progress-detail-modal');
    modal.classList.remove('active');
}

function setGoal() {
    alert('🎯 Opening goal setting interface...');
    closeProgressDetail();
}

function shareProgress() {
    alert('📤 Sharing your progress to the community...');
    closeProgressDetail();
}

// Badge Detail Functions
function openBadgeDetail(badgeId) {
    const data = badgeData[badgeId];
    if (!data) return;

    const modal = document.getElementById('badge-detail-modal');
    
    // Update title
    document.getElementById('badge-detail-title').textContent = 'BADGE DETAILS';
    
    // Update badge display
    const display = document.getElementById('badge-display');
    display.className = `badge-display ${data.status}`;
    display.innerHTML = `
        <div class="badge-icon">${data.icon}</div>
        <h3>${data.title}</h3>
        ${data.status === 'earned' ? `<p>Earned ${data.earnedDate}</p>` : '<p>Locked</p>'}
        <p style="font-size: 12px; color: var(--text-secondary); margin-top: 8px;">${data.rarity} Badge</p>
    `;
    
    // Update description
    document.getElementById('badge-description').innerHTML = `
        <p>${data.description}</p>
    `;
    
    // Update requirements
    const requirements = document.getElementById('badge-requirements');
    requirements.innerHTML = `
        <h4>REQUIREMENTS</h4>
        ${data.requirements.map(req => `
            <div class="requirement-item">
                <div class="requirement-icon">${req.completed ? '✓' : '○'}</div>
                <div class="requirement-text">${req.text}</div>
                ${req.progress ? `<div class="requirement-progress">${req.progress}</div>` : ''}
            </div>
        `).join('')}
    `;
    
    // Update actions
    const actions = document.getElementById('badge-actions');
    if (data.status === 'earned') {
        actions.innerHTML = `
            <button class="btn-primary" onclick="shareBadge('${badgeId}')">SHARE BADGE</button>
            <button class="btn-secondary" onclick="closeBadgeDetail()">CLOSE</button>
        `;
    } else {
        actions.innerHTML = `
            <button class="btn-secondary" onclick="viewProgress()">VIEW PROGRESS</button>
            <button class="btn-secondary" onclick="closeBadgeDetail()">CLOSE</button>
        `;
    }
    
    modal.classList.add('active');
}

function closeBadgeDetail() {
    const modal = document.getElementById('badge-detail-modal');
    modal.classList.remove('active');
}

function shareBadge(badgeId) {
    alert(`🏆 Sharing your ${badgeData[badgeId].title} badge!`);
    closeBadgeDetail();
}

function viewProgress() {
    alert('📊 Opening progress tracker...');
    closeBadgeDetail();
}

// Idea Roulette Functions - User's Saved Ideas
const ideaRouletteData = [
    {
        title: "MIDNIGHT BLUES",
        description: "slow moody thing with minor chords, lots of reverb. late night vibes",
        tags: ["BLUES", "MINOR", "REVERB"],
        duration: 5,
        savedDate: "2 days ago"
    },
    {
        title: "SYNTHWAVE DREAMS",
        description: "80s style with arps and that gated reverb sound. neon colors in my head",
        tags: ["SYNTHWAVE", "ARPEGGIATOR", "GATED"],
        duration: 8,
        savedDate: "1 week ago"
    },
    {
        title: "LO-FI STUDY SESSION",
        description: "chill beat for studying. vinyl crackle + piano. keep it simple",
        tags: ["LO-FI", "STUDY", "PIANO"],
        duration: 6,
        savedDate: "3 days ago"
    },
    {
        title: "SPACE EXPLORATION",
        description: "ambient pads and delays. floating in space feeling",
        tags: ["AMBIENT", "SPACE", "PADS"],
        duration: 10,
        savedDate: "5 days ago"
    },
    {
        title: "FUNK REVOLUTION",
        description: "funky bassline, tight drums, make people dance",
        tags: ["FUNK", "GROOVE", "STACCATO"],
        duration: 7,
        savedDate: "4 days ago"
    },
    {
        title: "TAPE DECAY",
        description: "tape saturation, pitch wobble, analog warmth. embrace the imperfections",
        tags: ["TAPE", "ANALOG", "SATURATION"],
        duration: 5,
        savedDate: "1 day ago"
    },
    {
        title: "GLITCH HOPPER",
        description: "glitchy drums, bit crush everything, break the rules",
        tags: ["GLITCH", "BIT-CRUSH", "CHAOS"],
        duration: 6,
        savedDate: "6 days ago"
    },
    {
        title: "JAZZ FUSION",
        description: "jazz chords + electronic stuff. complex but smooth",
        tags: ["JAZZ", "FUSION", "COMPLEX"],
        duration: 8,
        savedDate: "2 weeks ago"
    }
];

let currentRouletteIdea = null;

function spinIdeaRoulette() {
    const modal = document.getElementById('idea-roulette-modal');
    const dice = document.getElementById('rouletteDice');
    const result = document.getElementById('rouletteResult');
    const startBtn = document.getElementById('startJamBtn');
    
    // Open modal
    modal.classList.add('active');
    
    // Start rolling animation
    dice.classList.add('rolling');
    result.innerHTML = '<p>🎲 Selecting from your ideas...</p>';
    startBtn.style.display = 'none';
    
    // Simulate rolling for 1.5 seconds
    setTimeout(() => {
        // Stop rolling animation
        dice.classList.remove('rolling');
        
        // Select random idea from user's saved ideas
        const randomIndex = Math.floor(Math.random() * ideaRouletteData.length);
        currentRouletteIdea = ideaRouletteData[randomIndex];
        
        // Display result
        result.innerHTML = `
            <h3>${currentRouletteIdea.title}</h3>
            <p>${currentRouletteIdea.description}</p>
            <div class="roulette-tags">
                ${currentRouletteIdea.tags.map(tag => `<span class="roulette-tag">#${tag}</span>`).join('')}
            </div>
            <p style="font-size: 12px; color: var(--text-secondary); margin-top: 12px;">Saved ${currentRouletteIdea.savedDate}</p>
        `;
        
        // Show start button
        startBtn.style.display = 'block';
        startBtn.textContent = `START ${currentRouletteIdea.duration} MIN JAM`;
        
    }, 1500);
}

function closeIdeaRoulette() {
    const modal = document.getElementById('idea-roulette-modal');
    modal.classList.remove('active');
    currentRouletteIdea = null;
}

function startRouletteJam() {
    if (!currentRouletteIdea) return;
    
    closeIdeaRoulette();
    
    // Start jam session with the user's selected idea
    alert(`🎵 Starting jam session with your idea: "${currentRouletteIdea.title}"!\n\n${currentRouletteIdea.description}\n\nDuration: ${currentRouletteIdea.duration} minutes`);
    
    // In production, this would start the actual jam session
    // For now, we'll start a regular jam session
    startJam(currentRouletteIdea.duration);
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



