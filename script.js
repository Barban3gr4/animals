let animals = [
    { en: "cat", pt: "gato", img: "img/cat.png" },
    { en: "dog", pt: "cachorro", img: "img/dog.png" },
    { en: "elephant", pt: "elefante", img: "img/Elephant.png" },
    { en: "horse", pt: "cavalo", img: "img/horse.png" },
    { en: "lion", pt: "leão", img: "img/lion.png" },
    { en: "tiger", pt: "tigre", img: "img/tiger.png" },
    { en: "bat", pt: "morcego", img: "img/bat.png" },
    { en: "bear", pt: "urso", img: "img/bear.png" },
    { en: "cow", pt: "vaca", img: "img/cow.png" },
    { en: "eagle", pt: "águia", img: "img/eagle.png" },
    { en: "falcon", pt: "falcão", img: "img/falcon.png" },
    { en: "fox", pt: "raposa", img: "img/fox.png" },
    { en: "giraffe", pt: "girafa", img: "img/giraffe.png" },
    { en: "rabbit", pt: "coelho", img: "img/habbit.png" },
    { en: "kangaroo", pt: "canguru", img: "img/kangaroo.png" },
    { en: "owl", pt: "coruja", img: "img/owl.png" },
    { en: "panda", pt: "panda", img: "img/panda.png" },
    { en: "scorpion", pt: "escorpião", img: "img/scorpion.png" },
    { en: "shark", pt: "tubarão", img: "img/shark.png" },
    { en: "snake", pt: "cobra", img: "img/snake.png" },
    { en: "turtle", pt: "tartaruga", img: "img/turtle.png" },
    { en: "wolf", pt: "lobo", img: "img/wolf.png" },
    { en: "zebra", pt: "zebra", img: "img/zebra.png" },
    { en: "ant", pt: "formiga", img: "img/ant.png" },
    { en: "butterfly", pt: "borboleta", img: "img/butterfy.png" },
    { en: "chicken", pt: "galinha", img: "img/chicken.png" },
    { en: "crocodile", pt: "crocodilo", img: "img/crocodile.png" },
    { en: "duck", pt: "pato", img: "img/duck.png" },
    { en: "frog", pt: "rã", img: "img/frog.png" },
    { en: "lizard", pt: "lagarto", img: "img/lizard.png" },
    { en: "parrot", pt: "papagaio", img: "img/parrot.png" },
    { en: "penguin", pt: "pinguim", img: "img/penguin.png" },
    { en: "rooster", pt: "galo", img: "img/rooster.png" },
    { en: "salmon", pt: "salmão", img: "img/salmon.png" },
    { en: "toad", pt: "sapo", img: "img/Toad.png" },
    { en: "rhinoceros", pt: "rinoceronte", img: "img/Rhinoceros.png" },
    { en: "crow", pt: "corvo", img: "img/crow.png" },
    { en: "gorilla", pt: "gorila", img: "img/gorilla.png" },
    { en: "hippopotamus", pt: "hipopótamo", img: "img/hippopotamus.png" },
    { en: "hyena", pt: "hiena", img: "img/hyena.png" },
    { en: "toucan", pt: "tucano", img: "img/toucan.png" }
];

let currentIndex = 0;
let hits = 0;
let misses = 0;
let learnedAnimals = JSON.parse(localStorage.getItem('learnedAnimals')) || [];

// UI Elements
const animalImage = document.getElementById('animal-image');
const portugueseName = document.getElementById('portuguese-name');
const englishInput = document.getElementById('english-input');
const feedback = document.getElementById('feedback');
const submitBtn = document.getElementById('submit-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const quizCard = document.getElementById('quiz-card');
const resultsScreen = document.getElementById('results-screen');
const historyList = document.getElementById('history-list');
const resetBtn = document.getElementById('reset-btn');
const hintBtn = document.getElementById('hint-btn');
const translationBox = document.getElementById('translation-box');
const translationText = document.getElementById('translation-text');
const hitsDisplay = document.getElementById('hits-count');
const missesDisplay = document.getElementById('misses-count');

function init() {
    shuffleAnimals();
    loadProgress();
    hits = learnedAnimals.length;
    updateScoreUI();
    if (currentIndex < animals.length) {
        showAnimal();
    } else {
        showResults();
    }
    updateHistory();
}

function loadProgress() {
    currentIndex = learnedAnimals.length;
    updateProgress();
}

function showAnimal() {
    if (currentIndex >= animals.length) {
        showResults();
        return;
    }

    const animal = animals[currentIndex];
    animalImage.src = animal.img;
    animalImage.alt = animal.en;
    portugueseName.textContent = animal.pt;
    englishInput.value = '';
    englishInput.focus();
    feedback.textContent = '';
    feedback.className = 'feedback';
    
    // Reset hint state
    translationBox.classList.add('hidden');
    hintBtn.classList.remove('hidden');
}

function shuffleAnimals() {
    for (let i = animals.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [animals[i], animals[j]] = [animals[j], animals[i]];
    }
}

function showHint() {
    const animal = animals[currentIndex];
    translationText.textContent = animal.en;
    translationBox.classList.remove('hidden');
    hintBtn.classList.add('hidden');
    speak(animal.en);
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
}

function checkAnswer() {
    const userAnswer = englishInput.value.trim().toLowerCase();
    const correctAnswer = animals[currentIndex].en.toLowerCase();

    if (userAnswer === correctAnswer) {
        handleSuccess();
    } else if (userAnswer !== "") {
        handleError();
    }
}

function handleSuccess() {
    speak(animals[currentIndex].en);
    feedback.textContent = "EXCELLENT! ✨";
    feedback.className = "feedback correct";
    
    if (!learnedAnimals.find(a => a.en === animals[currentIndex].en)) {
        const animalData = { ...animals[currentIndex], status: 'correct' };
        learnedAnimals.push(animalData);
        localStorage.setItem('learnedAnimals', JSON.stringify(learnedAnimals));
        hits++;
        updateScoreUI();
    }

    currentIndex++;
    updateProgress();
    updateHistory();

    setTimeout(() => {
        if (currentIndex < animals.length) {
            showAnimal();
        } else {
            showResults();
        }
    }, 1200);
}

function handleError() {
    const correctAnswer = animals[currentIndex].en.toUpperCase();
    feedback.textContent = `INCORRECT ❌ IT WAS: ${correctAnswer}`;
    feedback.className = "feedback error";
    misses++;
    updateScoreUI();
    
    // Bloquear input durante a transição
    englishInput.disabled = true;
    submitBtn.disabled = true;

    // Adicionar ao histórico como erro
    if (!learnedAnimals.find(a => a.en === animals[currentIndex].en)) {
        const animalData = { ...animals[currentIndex], status: 'wrong' };
        learnedAnimals.push(animalData);
        localStorage.setItem('learnedAnimals', JSON.stringify(learnedAnimals));
    }

    currentIndex++;
    updateProgress();
    updateHistory();

    setTimeout(() => {
        englishInput.disabled = false;
        submitBtn.disabled = false;
        if (currentIndex < animals.length) {
            showAnimal();
        } else {
            showResults();
        }
    }, 2000); // 2 segundos para o usuário ler a correção
}

function updateScoreUI() {
    hitsDisplay.textContent = hits;
    missesDisplay.textContent = misses;
}

function updateProgress() {
    const percent = (currentIndex / animals.length) * 100;
    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${currentIndex} / ${animals.length}`;
}

function showResults() {
    quizCard.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
}

function updateHistory() {
    historyList.innerHTML = '';
    learnedAnimals.forEach((animal, index) => {
        const item = document.createElement('div');
        item.className = `history-item ${animal.status || 'correct'}`;
        item.style.animationDelay = `${index * 0.1}s`;
        item.innerHTML = `
            <img src="${animal.img}" alt="${animal.en}">
            <p>${animal.en}</p>
            <div class="history-actions">
                <span class="status-badge">${animal.status === 'wrong' ? '❌' : '✅'}</span>
                <button class="audio-btn" onclick="speak('${animal.en}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                </button>
            </div>
        `;
        historyList.appendChild(item);
    });
}

function resetGame() {
    learnedAnimals = [];
    hits = 0;
    misses = 0;
    localStorage.removeItem('learnedAnimals');
    location.reload();
}

function playAgain() {
    learnedAnimals = [];
    hits = 0;
    misses = 0;
    localStorage.removeItem('learnedAnimals');
    currentIndex = 0;
    quizCard.classList.remove('hidden');
    resultsScreen.classList.add('hidden');
    init();
}

// Event Listeners
submitBtn.addEventListener('click', checkAnswer);
englishInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});
resetBtn.addEventListener('click', resetGame);
hintBtn.addEventListener('click', showHint);

init();
