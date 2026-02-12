let totalQuestions = document.querySelectorAll('.question-box').length;
const scoreDisplay = document.getElementById('scoreDisplay');
const completionMessage = document.getElementById('completionMessage');
const imperfectMessage = document.getElementById('imperfectMessage');
const victorySound = document.getElementById('victorySound');

scoreDisplay.textContent = `Questions: 0/${totalQuestions}`;

// Initialize answers from URL parameters if they exist
window.addEventListener('load', () => {
    loadAnswersFromURL();
});

function selectOption(selectedOption) {
    const questionBox = selectedOption.parentElement;
    if (questionBox.classList.contains('answered')) return;
    
    questionBox.classList.add('answered');
    
    const options = questionBox.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.add('disabled');
        option.style.pointerEvents = 'none'; // Prevent further clicks
    });

    selectedOption.classList.add('selected');

    // Update score display to show progress
    const answeredCount = document.querySelectorAll('.question-box.answered').length;
    scoreDisplay.textContent = `Questions: ${answeredCount}/${totalQuestions}`;

    // Update URL with selected answer
    updateURL();
    
    // Scroll to top when all questions are answered
    if (answeredCount === totalQuestions) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

function updateURL() {
    const answers = [];
    const questionBoxes = document.querySelectorAll('.question-box');
    
    questionBoxes.forEach((box, index) => {
        const selectedOption = box.querySelector('.selected');
        if (selectedOption) {
            // Extract the letter (A, B, C) from the option text
            const optionText = selectedOption.textContent.trim();
            const letter = optionText.charAt(0);
            answers.push(`a${index + 1}=${letter}`);
        }
    });
    
    const baseUrl = window.location.origin + window.location.pathname;
    const newUrl = baseUrl + '?' + answers.join('&');
    history.replaceState(null, '', newUrl);
}

function loadAnswersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const questionBoxes = document.querySelectorAll('.question-box');
    
    questionBoxes.forEach((box, index) => {
        const param = `a${index + 1}`;
        const selectedLetter = urlParams.get(param);
        
        if (selectedLetter) {
            const options = box.querySelectorAll('.option');
            options.forEach(option => {
                const optionText = option.textContent.trim();
                const letter = optionText.charAt(0);
                
                if (letter === selectedLetter) {
                    option.classList.add('selected');
                    box.classList.add('answered');
                    
                    // Disable other options
                    options.forEach(opt => {
                        if (opt !== option) {
                            opt.classList.add('disabled');
                            opt.style.pointerEvents = 'none';
                        }
                    });
                }
            });
        }
    });
    
    // Update score display
    const answeredCount = document.querySelectorAll('.question-box.answered').length;
    scoreDisplay.textContent = `Questions: ${answeredCount}/${totalQuestions}`;
}

function checkPassword() {
    const password = document.getElementById('passwordInput').value;
    const correctPassword = 'mygf143';
    const summaryTitle = document.getElementById('summaryTitle');
    const answerSummary = document.getElementById('answerSummary');
    const passwordError = document.getElementById('passwordError');
    
    if (password === correctPassword) {
        // Password correct - show answers
        summaryTitle.textContent = '🔓 Answer Summary';
        summaryTitle.style.color = '#4CAF50';
        passwordError.style.display = 'none';
        
        // Get all selected answers
        const questionBoxes = document.querySelectorAll('.question-box');
        let summaryText = '<h4>Recipient chose:</h4><ul>';
        
        questionBoxes.forEach((box, index) => {
            const question = box.querySelector('.question').textContent;
            const selectedOption = box.querySelector('.selected');
            
            if (selectedOption) {
                const optionText = selectedOption.textContent.trim();
                summaryText += `<li><strong>Q${index + 1}:</strong> ${optionText}</li>`;
            } else {
                summaryText += `<li><strong>Q${index + 1}:</strong> <em>Not answered</em></li>`;
            }
        });
        
        summaryText += '</ul>';
        answerSummary.innerHTML = summaryText;
        answerSummary.style.display = 'block';
        
        // Add unlock animation
        answerSummary.style.animation = 'pulse 0.5s ease';
        
    } else {
        // Password incorrect
        passwordError.style.display = 'block';
        setTimeout(() => {
            passwordError.style.display = 'none';
        }, 2000);
    }
}

function showCelebration() {
    completionMessage.style.display = 'block';
    imperfectMessage.style.display = 'none';
    victorySound.play();
    
    // Confetti animation
    const duration = 5000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff6699', '#ff3366']
        });
        
        confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff6699', '#ff3366']
        });

        if (Date.now() < end) requestAnimationFrame(frame);
    }());

    // Continuous confetti
    confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        decay: 0.9
    });
}

function showImperfectScoreMessage() {
    completionMessage.style.display = 'none';
    imperfectMessage.style.display = 'block';
}

function toggleAnswers() {
    const options = document.querySelectorAll('.option');
    const hostBtn = document.querySelector('.host-btn');
    
    options.forEach(option => {
        if (option.dataset.correct === 'true') {
            if (option.style.backgroundColor === 'rgba(0, 255, 0, 0.3)') {
                option.style.backgroundColor = '';
                option.style.border = '';
                option.style.fontWeight = '';
                hostBtn.textContent = 'Host: Show/Hide Answers';
            } else {
                option.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';
                option.style.border = '2px solid #4CAF50';
                option.style.fontWeight = 'bold';
                hostBtn.textContent = 'Host: Hide Answers';
            }
        }
    });
}
