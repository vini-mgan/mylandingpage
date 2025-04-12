class BullsAndCowsGame {
    constructor() {
        this.secretNumber = this.generateSecretNumber();
        this.guesses = [];
        this.setupEventListeners();
        this.animalsArea = document.getElementById('animals-area');
    }

    generateSecretNumber() {
        const digits = Array.from({length: 10}, (_, i) => i);
        let result = '';
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * digits.length);
            result += digits[randomIndex];
            digits.splice(randomIndex, 1);
        }
        return result;
    }

    checkGuess(guess) {
        let bulls = 0;
        let cows = 0;

        for (let i = 0; i < 4; i++) {
            if (guess[i] === this.secretNumber[i]) {
                bulls++;
            } else if (this.secretNumber.includes(guess[i])) {
                cows++;
            }
        }

        return { bulls, cows };
    }

    isValidGuess(guess) {
        if (guess.length !== 4) return false;
        if (!/^\d+$/.test(guess)) return false;
        return new Set(guess).size === 4;
    }

    updateAnimals(bulls, cows) {
        // Limpa a área dos animais
        this.animalsArea.innerHTML = '';

        const totalAnimals = bulls + cows;
        if (totalAnimals === 0) return;

        // espaço disponível
        const containerWidth = this.animalsArea.offsetWidth;
        const spacing = containerWidth / (totalAnimals + 1);


        const createAnimal = (type, index) => {
            const animal = document.createElement('img');
            animal.src = type === 'bull' ? '../images/bull.png' : '../images/cow.png';
            animal.className = 'animal';

            //atraso aleatório para cada animal
            const delay = Math.random() * 0.5;
            animal.style.animation = `bounce 1s infinite ease-in-out ${delay}s`;

            // efeito de fade in
            setTimeout(() => animal.classList.add('visible'), 50);

            return animal;
        };

        // bulls
        for (let i = 0; i < bulls; i++) {
            const bull = createAnimal('bull', i);
            this.animalsArea.appendChild(bull);
        }

        // cows
        for (let i = 0; i < cows; i++) {
            const cow = createAnimal('cow', bulls + i);
            this.animalsArea.appendChild(cow);
        }
    }

    celebrateWin() {
        // animação: 3s
        const end = Date.now() + 3000;

        const colors = ['#8B4513', '#F4D03F', '#795548', '#2ecc71', '#87CEEB', '#D35400'];

        const frame = () => {
            confetti({
                particleCount: 100,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 100,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        // Inicia animacao
        frame();

        //confetes no centro
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: colors
        });
    }

    setupEventListeners() {
        const guessInput = document.getElementById('guess');
        const submitButton = document.getElementById('submit-guess');
        const newGameButton = document.getElementById('new-game');
        const showCombinationButton = document.getElementById('show-combination');
        const messageElement = document.getElementById('message');

        submitButton.addEventListener('click', () => {
            const guess = guessInput.value;

            if (!this.isValidGuess(guess)) {
                messageElement.textContent = 'Por favor, digite 4 dígitos diferentes';
                messageElement.style.backgroundColor = '#ffebee';
                return;
            }

            const result = this.checkGuess(guess);
            this.guesses.unshift({ guess, result });
            this.updateHistory();
            this.updateAnimals(result.bulls, result.cows);
            guessInput.value = '';

            if (result.bulls === 4) {
                messageElement.textContent = '🎉 Parabéns! Você venceu! 🎉';
                messageElement.style.backgroundColor = '#e8f5e9';
                guessInput.disabled = true;
                submitButton.disabled = true;
                this.celebrateWin();
            }
        });

        newGameButton.addEventListener('click', () => {
            this.secretNumber = this.generateSecretNumber();
            this.guesses = [];
            this.updateHistory();
            this.updateAnimals(0, 0);
            guessInput.value = '';
            guessInput.disabled = false;
            submitButton.disabled = false;
            messageElement.textContent = '';
            messageElement.style.backgroundColor = 'transparent';
        });

        showCombinationButton.addEventListener('click', () => {
            alert(`A combinação secreta é: ${this.secretNumber}`);
        });

        guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitButton.click();
            }
        });
    }

    updateHistory() {
        const guessesList = document.getElementById('guesses-list');
        guessesList.innerHTML = '';

        this.guesses.forEach((guessData, index) => {
            const guessItem = document.createElement('div');
            guessItem.className = 'guess-item';

            // número da tentativa
            const attemptNumber = document.createElement('span');
            attemptNumber.className = 'attempt-number';
            attemptNumber.textContent = `#${this.guesses.length - index}`;

            const guessNumber = document.createElement('span');
            guessNumber.className = 'guess-number';
            guessNumber.textContent = guessData.guess;

            const bullsCows = document.createElement('div');
            bullsCows.className = 'bulls-cows';

            //ícones de bull
            for (let i = 0; i < guessData.result.bulls; i++) {
                const bullIcon = document.createElement('img');
                bullIcon.src = '../images/bull.png';
                bullIcon.className = 'bull-icon';
                bullsCows.appendChild(bullIcon);
            }

            //ícones de cow
            for (let i = 0; i < guessData.result.cows; i++) {
                const cowIcon = document.createElement('img');
                cowIcon.src = '../images/cow.png';
                cowIcon.className = 'cow-icon';
                bullsCows.appendChild(cowIcon);
            }

            guessItem.appendChild(attemptNumber);
            guessItem.appendChild(guessNumber);
            guessItem.appendChild(bullsCows);
            guessesList.appendChild(guessItem);

            // entrada da nova tentativa
            if (index === 0) {
                guessItem.style.animation = 'slideIn 0.3s ease-out';
            }
        });
    }
}

// Inicia jogo
document.addEventListener('DOMContentLoaded', () => {
    new BullsAndCowsGame();
});