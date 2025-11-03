// Sample questions data - User will provide their own later
const questionsData = [
    { id: 1, question: "Câu hỏi mẫu 1: 2 + 2 = ?", answers: ["3", "4", "5", "6"], correct: 1 },
    { id: 2, question: "Câu hỏi mẫu 2: Thủ đô Việt Nam?", answers: ["Hà Nội", "TP.HCM", "Đà Nẵng", "Huế"], correct: 0 },
    { id: 3, question: "Câu hỏi mẫu 3: 5 x 3 = ?", answers: ["10", "15", "20", "25"], correct: 1 },
    { id: 4, question: "Câu hỏi mẫu 4: Màu của lá cây?", answers: ["Đỏ", "Xanh", "Vàng", "Tím"], correct: 1 },
    { id: 5, question: "Câu hỏi mẫu 5: 10 - 3 = ?", answers: ["5", "6", "7", "8"], correct: 2 },
    { id: 6, question: "Câu hỏi mẫu 6: Con vật nào bay được?", answers: ["Cá", "Chim", "Chó", "Mèo"], correct: 1 },
    { id: 7, question: "Câu hỏi mẫu 7: 8 / 2 = ?", answers: ["2", "3", "4", "5"], correct: 2 },
    { id: 8, question: "Câu hỏi mẫu 8: Mặt trời mọc hướng nào?", answers: ["Đông", "Tây", "Nam", "Bắc"], correct: 0 },
    { id: 9, question: "Câu hỏi mẫu 9: 3 + 7 = ?", answers: ["9", "10", "11", "12"], correct: 1 },
    { id: 10, question: "Câu hỏi mẫu 10: Nước có công thức?", answers: ["CO2", "H2O", "O2", "N2"], correct: 1 },
    { id: 11, question: "Câu hỏi mẫu 11: 20 / 4 = ?", answers: ["4", "5", "6", "7"], correct: 1 },
    { id: 12, question: "Câu hỏi mẫu 12: Màu của trời?", answers: ["Đỏ", "Xanh", "Vàng", "Tím"], correct: 1 }
];

// Game state
let gameState = {
    opened: [],
    currentSquare: null
};

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
        square.className = 'bg-gradient-to-br from-purple-500 to-blue-500 cursor-pointer hover:opacity-90 transition-all flex items-center justify-center';
        square.dataset.index = i;
        
        // Check if square is already opened
        if (gameState.opened.includes(i)) {
            square.classList.add('opacity-0', 'pointer-events-none');
        } else {
            const text = document.createElement('div');
            text.className = 'text-white font-bold text-4xl';
            text.textContent = '?';
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
    
    // Clear previous options
    answerOptions.innerHTML = '';
    
    // Create answer buttons
    question.answers.forEach((answer, idx) => {
        const button = document.createElement('button');
        button.className = 'w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition text-left font-medium';
        button.textContent = answer;
        button.addEventListener('click', () => checkAnswer(idx, question.correct, index));
        answerOptions.appendChild(button);
    });
    
    modal.classList.remove('hidden');
}

// Check answer
function checkAnswer(selected, correct, squareIndex) {
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
