import { MoneyFunction } from "./moneyFunc.js";

class Blackjack {
    constructor() {
        this.player = [];
        this.dealer = [];
        this.cards = [];
        this.lost = "tie";
        this.images = [];
        this.gameOver = false;

        this.playerTotal = 0;
        this.dealerTotal = 0;

        this.startButton = document.getElementById("startButton");
        this.hitButton = document.getElementById("hit");
        this.standButton = document.getElementById("stand");
        this.resetButton = document.getElementById("reset");
        this.dealerScore = document.getElementById("dealer-score");
        this.playerScore = document.getElementById("player-score");
        this.winnerMessage = document.getElementById("message");
        this.playerCards = document.getElementById("player-hand");
        this.dealerCards = document.getElementById("dealer-hand");
        this.popup = document.getElementById("popup");

        this.suits = ["hearts", "diamonds", "clubs", "spades"];
        this.values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];

        this.hitButton.onclick = () => this.playerHit();
        this.standButton.onclick = () => this.endGame();
        this.resetButton.onclick = () => this.startGame();
        this.startButton.onclick = () => {
            moneyManager.moneyInitial();
            this.startGame();
        };
    }

    createDeck() {
        this.cards = [];
        for (let suit of this.suits) {
            for (let value of this.values) {
                this.cards.push({ suit, value });
            }
        }
    }

    shuffleDeck() {
        let currentIndex = this.cards.length;
        while (currentIndex !== 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [this.cards[currentIndex], this.cards[randomIndex]] = [this.cards[randomIndex], this.cards[currentIndex]];
        }
    }

    getCardImage(card) {
        return `pictures/${card.value}_of_${card.suit}.png`;
    }

    updateHandsDisplay() {
        // Clear hands
        this.playerCards.innerHTML = "";
        this.dealerCards.innerHTML = "";

        // Player's cards
        this.player.forEach(card => {
            const img = document.createElement("img");
            img.src = this.getCardImage(card);
            img.alt = `${card.value} of ${card.suit}`;
            img.classList.add("card");
            this.playerCards.appendChild(img);
        });

        // Dealer's cards
        this.dealer.forEach((card, index) => {
            const img = document.createElement("img");
            if (index === 0 && !this.gameOver) {
                img.src = "pictures/deckofcards.jpg"; // Face-down card
                img.alt = "Hidden card";
            } else {
                img.src = this.getCardImage(card);
                img.alt = `${card.value} of ${card.suit}`;
            }
            img.classList.add("card");
            this.dealerCards.appendChild(img);
        });
    }

    starterCards() {
        this.player = [this.cards.pop(), this.cards.pop()];
        this.dealer = [this.cards.pop(), this.cards.pop()];
        this.playerTotal = this.calculateHandTotal(this.player);
        this.dealerTotal = this.calculateHandTotal(this.dealer);
        this.gameOver = false;

        this.playerScore.textContent = this.playerTotal;
        this.dealerScore.textContent = "??"; // Hide dealer score

        this.updateHandsDisplay();
    }

    playerHit() {
        if (this.gameOver || this.playerTotal >= 21) return;

        this.player.push(this.cards.pop());
        this.playerTotal = this.calculateHandTotal(this.player);
        this.playerScore.textContent = this.playerTotal;

        this.updateHandsDisplay();

        if (this.playerTotal > 21) {
            this.winnerMessage.textContent = "You busted! Dealer wins.";
            this.lost = "true";
            moneyManager.moneyDeductor();
            this.gameOver = true;
            this.revealDealer();
        }
    }

    calculateHandTotal(hand) {
        let total = 0;
        let aceCount = 0;

        hand.forEach(card => {
            if (["jack", "queen", "king"].includes(card.value)) {
                total += 10;
            } else if (card.value === "ace") {
                total += 11;
                aceCount++;
            } else {
                total += Number(card.value);
            }
        });

        while (total > 21 && aceCount > 0) {
            total -= 10;
            aceCount--;
        }

        return total;
    }

    dealerHandCheck() {
        while (this.calculateHandTotal(this.dealer) < 17) {
            this.dealer.push(this.cards.pop());
        }
        return this.calculateHandTotal(this.dealer);
    }

    compareScores() {
        this.playerTotal = this.calculateHandTotal(this.player);
        this.dealerTotal = this.dealerHandCheck();

        let message = "";

        if (this.playerTotal > 21) {
            message = "You busted! Dealer wins.";
            this.lost = "true";
        } else if (this.dealerTotal > 21) {
            message = "Dealer busted! You win!";
            this.lost = "false";
        } else if (this.playerTotal > this.dealerTotal) {
            message = "You win!";
            this.lost = "false";
        } else if (this.playerTotal < this.dealerTotal) {
            message = "Dealer wins!";
            this.lost = "true";
        } else {
            message = "It's a tie!";
            this.lost = "tie";
        }

        this.playerScore.textContent = this.playerTotal;
        this.dealerScore.textContent = this.dealerTotal;
        this.winnerMessage.textContent = message;

        if (this.lost !== "tie") {
            if (this.lost === "true") {
                moneyManager.moneyDeductor();
            } else {
                moneyManager.moneyAdder();
            }
        }

        this.gameOver = true;
        this.updateHandsDisplay(); // Reveal dealer's hidden card
    }

    revealDealer() {
        this.dealerScore.textContent = this.dealerTotal;
        this.updateHandsDisplay();
    }

    endGame() {
        if (!this.gameOver) {
            this.compareScores();
        }
    }

    startGame() {
        this.images = [];
        this.dealerScore.textContent = 0;
        this.playerScore.textContent = 0;
        this.winnerMessage.textContent = "";
        this.createDeck();
        this.shuffleDeck();
        this.starterCards();
    }
}

// Instantiate the game
const blackjackGame = new Blackjack();
const moneyManager = new MoneyFunction();
