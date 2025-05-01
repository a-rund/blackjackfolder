import {MoneyFunction} from "./moneyFunc.js";

class Blackjack {

    constructor() {
        this.player = [];
        this.dealer = [];
        this.cards = [];
        this.lost = "tie";

        this.startButton = document.getElementById("startButton");
        this.hitButton = document.getElementById("hit");
        this.standButton = document.getElementById("stand");
        this.resetButton = document.getElementById("reset");
        this.dealerScore = document.getElementById("dealer-score");
        this.playerScore = document.getElementById("player-score");
        this.winnerMessage = document.getElementById("message");
        this.playerHand = document.getElementById("player-hand");
        this.dealerHand = document.getElementById("dealer-hand");
        this.popup = document.getElementById("popup")

        this.suits = ["hearts", "diamonds", "clubs", "spades"];
        this.values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];

        this.hitButton.onclick = () => this.playerHit();
        this.standButton.onclick = () => this.endGame();
        this.resetButton.onclick = () => this.startGame();

        this.startButton.onclick = () =>{
        moneyManager.moneyInitial();
        this.startGame(); }
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
        this.playerHand.innerHTML = "";
        this.dealerHand.innerHTML = "";

        this.player.forEach(card => {
            const img = document.createElement("img");
            img.src = this.getCardImage(card);
            img.alt = `${card.value} of ${card.suit}`;
            img.classList.add("card");
            this.playerHand.appendChild(img);
        });

        this.dealer.forEach(card => {
            const img = document.createElement("img");
            img.src = this.getCardImage(card);
            img.alt = `${card.value} of ${card.suit}`;
            img.classList.add("card");
            this.dealerHand.appendChild(img);
        });
    }

    starterCards() {
        this.player = [this.cards.pop(), this.cards.pop()];
        this.dealer = [this.cards.pop(), this.cards.pop()];
        this.updateHandsDisplay();
    }

    playerHit() {
        this.player.push(this.cards.pop());
        this.updateHandsDisplay();
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
        let playerTotal = this.calculateHandTotal(this.player);
        let dealerTotal = this.dealerHandCheck(playerTotal);
        

        this.dealerScore.textContent = dealerTotal;
        this.playerScore.textContent = playerTotal;

        let message = "";
        if (playerTotal > 21) {
            message = "You busted! Dealer wins.";
            this.lost = "true";
        } else if (dealerTotal > 21) {
            message = "Dealer busted! You win!";
            this.lost = "false";
        } else if (playerTotal > dealerTotal) {
            this.lost = "false";
            message = "You win!";
        } else if (playerTotal < dealerTotal) {
            message = "Dealer wins!";
            this.lost = "true";
        } else {
            message = "It's a tie!";
            
        }
        this.winnerMessage.textContent = message;

    if(this.lost != "tie"){
        if(this.lost === "true"){
            moneyManager.moneyDeductor();
        }
        else if(this.lost === "false"){
            moneyManager.moneyAdder();
        }
    }
    }

    endGame() {
        this.compareScores();
        this.updateHandsDisplay();
    }

    startGame() {
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
