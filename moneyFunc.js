class MoneyFunction {
    constructor() {
        this.money = 0;  
        this.counter = document.getElementById("counter");
    }

    printLost() {
        console.log("you lost");
    }

    animateMoneyChange(targetMoney) {
        const step = Math.ceil(Math.abs(targetMoney - this.money) / 20); //here im caluclating the steps needed to get to final number, bigger = more time
        const increment = targetMoney > this.money ? step : -step;

        const interval = setInterval(() => {
            if ((increment > 0 && this.money >= targetMoney) || (increment < 0 && this.money <= targetMoney)) {
                this.money = targetMoney;  // Ensure exact final value
                this.updateMoneyUI(this.money);
                clearInterval(interval);
            } else {
                this.money += increment;
                this.updateMoneyUI(this.money);
            }
        }, 50); // Update every 50ms for smooth effect
    }

    updateMoneyUI(money) {
        this.counter.textContent = money;
    }

    moneyInitial() {
        let startingMoney = parseInt(document.getElementById("startingMoney").value) || 0;
        this.money = startingMoney; 
        this.updateMoneyUI(this.money); 
        document.getElementById("popup").style.animation = "fade 1s forwards";

    setTimeout(() => {
    document.getElementById("popup").style.display = "none";
    }, 1000); 

    }

    moneyDeductor() {
        let targetMoney = Math.floor(this.money / 1.5);
        this.animateMoneyChange(targetMoney);
    }

    moneyAdder() {
        let targetMoney = Math.floor(this.money * 1.5);
        this.animateMoneyChange(targetMoney);
    }
}

export { MoneyFunction };

