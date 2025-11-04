// Questions about integer addition
const questionsData = [
    { id: 1, question: "Câu 1: Kết quả của phép tính 25 + 15 + 150 là:", answers: ["190", "100", "150", "130"], correct: 0 },
    { id: 2, question: "Câu 2: Kết quả của phép tính (– 100) + (– 50) + (– 150) là:", answers: ["– 150", "150", "300", "– 300"], correct: 3 },
    { id: 3, question: "Câu 3: Tổng của hai số – 313 và – 211 là:", answers: ["534", "524", "– 524", "– 534"], correct: 2 },
    { id: 4, question: "Câu 4: Tổng của – 161 và – 810 là:", answers: ["– 971", "971", "– 649", "649"], correct: 0 },
    { id: 5, question: "Câu 5: Kết quả của phép tính (– 167) + 69 là:", answers: ["– 89", "98", "– 98", "89"], correct: 2 },
    { id: 6, question: "Câu 6: Số nguyên nào dưới dây là kết quả của phép tính 52 + (– 122)?", answers: ["– 70", "70", "60", "– 60"], correct: 0 },
    { id: 7, question: "Câu 7: Tính (– 909) + 909.", answers: ["1818", "1", "0", "– 1818"], correct: 2 },
    { id: 8, question: "Câu 8: Tổng của hai số nguyên dương là số?", answers: ["Số nguyên dương", "Số nguyên âm", "0", "Kết quả khác"], correct: 0 },
    { id: 9, question: "Câu 9: Tổng của hai số nguyên âm luôn … mỗi số hạng.", answers: ["Nhỏ hơn", "Lớn hơn", "Bằng", "Tất cả đáp án trên"], correct: 0 },
    { id: 10, question: "Câu 10: Kết quả của phép tính (–75) + 1250 là:", answers: ["1175", "–1150", "1150", "–1175"], correct: 0 },
    { id: 11, question: "Câu 11: Cho hai số nguyên –45 và 60. Tổng của hai số này là:", answers: ["–105", "105", "15", "–15"], correct: 2 },
    { id: 12, question: "Câu 12: Hai số nguyên đối nhau có tổng bằng…?", answers: ["0", "-1", "-2", "Kết quả khác"], correct: 0 }
];

// Game state
let gameState = {
    opened: [],
    currentSquare: null
};

let timer = null;
let timeLeft = 10;

// Load game state from localStorage
function loadGameState() {
    const saved = localStorage.getItem('gameState');
    if (saved) {
        gameState = JSON.parse(saved);
    }
}

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

// Initialize game
function initGame() {
    loadGameState();
    const gridContainer = document.querySelector('#imageContainer .grid');
    
    // Create 12 squares
    for (let i = 0; i < 12; i++) {
        const square = document.createElement('div');
        square.className = 'bg-gradient-to-br from-purple-500 to-blue-500 cursor-pointer hover:scale-105 transition-all flex items-center justify-center';
        square.dataset.index = i;
        
        // Check if square is already opened
        if (gameState.opened.includes(i)) {
            square.classList.add('opacity-0', 'pointer-events-none');
        } else {
            const text = document.createElement('div');
            text.className = 'text-white font-bold text-4xl';
            text.textContent = i + 1;
            square.appendChild(text);
            
            square.addEventListener('click', () => openQuestion(i));
        }
        
        gridContainer.appendChild(square);
    }
    
    updateProgress();
}

// Open question modal
function openQuestion(index) {
    gameState.currentSquare = index;
    const question = questionsData[index];
    
    const modal = document.getElementById('questionModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalQuestion = document.getElementById('modalQuestion');
    const answerOptions = document.getElementById('answerOptions');
    
    modalTitle.textContent = `Câu hỏi #${index + 1}`;
    modalQuestion.textContent = question.question;
    
    // Start timer
    startTimer();
    
    // Clear previous options
    answerOptions.innerHTML = '';
    
    // Create answer buttons with A, B, C, D labels
    const labels = ['A', 'B', 'C', 'D'];
    question.answers.forEach((answer, idx) => {
        const button = document.createElement('button');
        button.className = 'w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-white rounded-xl transition transform hover:scale-105 text-left font-semibold border-2 border-yellow-600 shadow-lg flex items-center gap-4';
        
        // Create label badge
        const labelBadge = document.createElement('span');
        labelBadge.className = 'bg-blue-900 text-yellow-400 font-bold px-3 py-1 rounded-lg text-lg';
        labelBadge.textContent = labels[idx];
        
        // Create answer text
        const answerText = document.createElement('span');
        answerText.className = 'flex-1 text-lg';
        answerText.textContent = answer;
        answerText.style.textShadow = '1px 1px 2px rgba(0,0,0,0.3)';
        
        button.appendChild(labelBadge);
        button.appendChild(answerText);
        button.addEventListener('click', () => checkAnswer(idx, question.correct, index));
        answerOptions.appendChild(button);
    });
    
    modal.classList.remove('hidden');
}

// Start timer
function startTimer() {
    timeLeft = 10;
    updateTimerDisplay();
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            stopTimer();
            alert('⏱️ Hết giờ! Thử lại nhé.');
            closeModal();
        }
    }, 1000);
}

// Stop timer
function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

// Update timer display
function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent = timeLeft;
        
        // Change color based on time left
        if (timeLeft <= 3) {
            timerElement.className = 'text-6xl font-bold text-red-500';
        } else if (timeLeft <= 5) {
            timerElement.className = 'text-6xl font-bold text-yellow-400';
        } else {
            timerElement.className = 'text-6xl font-bold text-green-400';
        }
    }
}

// Check answer
function checkAnswer(selected, correct, squareIndex) {
    stopTimer();
    
    if (selected === correct) {
        // Correct answer - remove square
        const square = document.querySelector(`[data-index="${squareIndex}"]`);
        square.classList.add('opacity-0', 'pointer-events-none');
        
        // Add to opened list
        if (!gameState.opened.includes(squareIndex)) {
            gameState.opened.push(squareIndex);
            saveGameState();
        }
        
        updateProgress();
        closeModal();
        
        // Check if game is complete
        if (gameState.opened.length === 12) {
            setTimeout(() => {
                alert('🎉 Chúc mừng! Bạn đã hoàn thành trò chơi!');
            }, 500);
        }
    } else {
        // Wrong answer - show feedback
        alert('❌ Sai rồi! Thử lại nhé.');
    }
}

// Close modal
function closeModal() {
    stopTimer();
    document.getElementById('questionModal').classList.add('hidden');
    gameState.currentSquare = null;
}

// Update progress display
function updateProgress() {
    document.getElementById('progress').textContent = `${gameState.opened.length}/12`;
}

// Reset game
function resetGame() {
    if (confirm('Bạn có chắc muốn chơi lại từ đầu?')) {
        gameState = { opened: [], currentSquare: null };
        saveGameState();
        location.reload();
    }
}

// Event listeners
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('resetBtn').addEventListener('click', resetGame);

// Close modal when clicking outside
document.getElementById('questionModal').addEventListener('click', (e) => {
    if (e.target.id === 'questionModal') {
        closeModal();
    }
});

// Initialize game on load
initGame();
