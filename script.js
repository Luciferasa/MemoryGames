class Strit {
    constructor(arrLength, onGameFinished) {
        this.easyStritArrForBord = [];
        this.hardStritArrForBord = [];
        this.arrLength = arrLength;
        this.arr = [];
        this.onGameFinished = onGameFinished;
        this.arrOpenCards = [];
        this.countOfMove = document.querySelector(".move-count-counter");
        this.calcMove = 0;
        let k = 1;
        while (this.arr.length < arrLength) {
            this.arr.push(k);
            k++;
        }
    }

    calcCountOfMove() {
        this.calcMove = ++this.calcMove;
        this.countOfMove.innerText = this.calcMove;
    }

    toggleCount() {
        document.querySelector(".count-of-move").classList.toggle("hidden");
    }

    createNewCards() {
        var shuffledArr = this.arr.sort(function() {
            return Math.random() - 0.5;
        });

        this.toggleCount();
        this.countOfMove.innerText = this.calcMove;

        for (let cardNumber = 0; cardNumber < this.arrLength; cardNumber++) {
            new Card(shuffledArr[cardNumber], (card) => this.checkCards(card)).render();
        }
    }

    checkCards(card) {
        this.calcCountOfMove();
        if (this.openCard) {
            this.compare(card);
        } else {
            this.openFirstCard(card);
        }
    }

    openFirstCard(card) {
        this.openCard = card;
        this.arrOpenCards.push(this.openCard);
    }

    compare(card) {
        this.arrOpenCards.push(card);
        let previousCard = this.arrOpenCards[this.arrOpenCards.length - 2];
        if (card.value - previousCard.value !== 1) {
            this.arrOpenCards.pop(card);
            this.closeCard();
            this.arrOpenCards = [];
            this.arrOpenCards.push(card);

            return;
        }

        if (this.arrOpenCards[0].value !== 1 && this.arrOpenCards.length > 1) {
            this.arrOpenCards.pop(card);
            this.closeCard();
            this.arrOpenCards = [];
            this.arrOpenCards.push(card);

            return;
        }

        card.open(card);
        if (card.value == this.arr.length) {
            for (let i = 0; i < this.arrOpenCards.length; i++) {
                this.arrOpenCards[i].remove();
            }

            if (this.arrLength == 10) {
                this.writeDownEasyStrit();
                this.toggleCount();
                this.onGameFinished(this.calcMove, this.easyStritArrForBord);
            }

            if (this.arrLength == 20) {
                this.writeDownHardStrit();
                this.toggleCount();
                this.onGameFinished(this.calcMove, this.hardStritArrForBord);
            }
        }
    }

    writeDownEasyStrit() {
      let userEasyStrit = prompt("введите имя", "");
        if (localStorage.getItem("easyStritArrForBord") !== null) {
            this.easyStritArrForBord = JSON.parse(localStorage.getItem("easyStritArrForBord"));
        }

        this.easyStritArrForBord.push([userEasyStrit, this.calcMove]);
        localStorage.setItem("easyStritArrForBord", JSON.stringify(this.easyStritArrForBord));
    }

    writeDownHardStrit() {
        let userHardStrit = prompt("введите имя", "");
        if (localStorage.getItem("hardStritArrForBord") !== null) {
            this.hardStritArrForBord = JSON.parse(localStorage.getItem("hardStritArrForBord"));
        }

        this.hardStritArrForBord.push([userHardStrit, this.calcMove]);
        localStorage.setItem("hardStritArrForBord", JSON.stringify(this.hardStritArrForBord));
    }

    closeCard() {
        for (let i = 0; i < this.arrOpenCards.length; i++) {
            this.arrOpenCards[i].close();
        }
    }
}




class Card {
    constructor(value, onCardToggled) {
        this.div = document.createElement("div");
        this.value = value;
        this.onCardToggled = onCardToggled;
        this.isOpen = false;
    }

    render() {
        this.div.className = "card card-closed";
        this.div.innerText = this.value;
        document.body.appendChild(this.div);
        this.div.addEventListener("click", () => this.open());
    }

    open() {
        if (this.isOpen) {
            return;
        }

        this.isOpen = true;
        this.div.classList.remove("card-closed");
        this.onCardToggled(this);
    }

    close() {
        this.isOpen = false;
        this.div.classList.add("card-closed");
    }

    remove() {
        this.div.remove();
    }
}



class Memory {
    constructor(arrLength, onGameFinished) {
        this.easyMemoryArrForBord = [];
        this.hardMemoryArrForBord = [];
        this.arr = [];
        this.arrLength = arrLength;
        while (this.arr.length < this.arrLength) {

            let k = Math.round(Math.random() * 100);
            if (!this.arr.includes(k)) {
                this.arr.push(k, k);
            }
        }
        this.onGameFinished = onGameFinished;
        this.countOfMove = document.querySelector(".move-count-counter");
        this.calcMove = 0;
        this.arrForDelete = [];
        this.countOpenCards = 0;
    }

    calcCountOfMove() {
        this.calcMove = ++this.calcMove;
        this.countOfMove.innerText = this.calcMove;
    }

    toggleCount() {
        document.querySelector(".count-of-move").classList.toggle("hidden");
    }

    createNewCards() {
        var shuffledArr = this.arr.sort(function() {
            return Math.random() - 0.5;
        });

        this.toggleCount();

        this.countOfMove.innerText = this.calcMove;
        for (let cardNumber = 0; cardNumber < this.arr.length; cardNumber++) {
            new Card(shuffledArr[cardNumber], (card) => this.cardToggled(card)).render();
        }
    }

    cardToggled(card) {
        if (card.isOpen) {
            this.conditions(card);
            return;
        }
        this.openCard = null;
    }

    conditions(card) {
        if (this.openCard && this.openCard2) {
            this.openCard.close();
            this.openCard2.close();

            this.openCard2 = null;
            this.openCard = card;

            return;
        }
        if (this.openCard) {
            this.calcCountOfMove();
            this.doComparison(card);
        } else {
            this.openFirstCard(card);
        }
    }

    openFirstCard(card) {
        this.openCard = card;
    }

    writeDownEasyMemory() {
        let userEasyMemory = prompt("введите имя", "");
        if (localStorage.getItem("easyMemoryArrForBord") !== null) {
            this.easyMemoryArrForBord = JSON.parse(localStorage.getItem("easyMemoryArrForBord"));
        }

        this.easyMemoryArrForBord.push([userEasyMemory, this.calcMove]);
        localStorage.setItem("easyMemoryArrForBord", JSON.stringify(this.easyMemoryArrForBord));
    }

    writeDownHardMemory() {
        let userHardMemory = prompt("введите имя", "");
        if (localStorage.getItem("hardMemoryArrForBord") !== null) {
            this.hardMemoryArrForBord = JSON.parse(localStorage.getItem("hardMemoryArrForBord"));
        }

        this.hardMemoryArrForBord.push([userHardMemory, this.calcMove]);
        localStorage.setItem("hardMemoryArrForBord", JSON.stringify(this.hardMemoryArrForBord));
    }

    doComparison(card) {
        if (this.openCard.value == card.value) {
            card.div.classList.remove("card-closed");
            this.openCard.div.classList.remove("card-closed");

            this.arrForDelete.push(card, this.openCard);
            this.openCard = null;
            card = null;
            this.openCard2 = null;
            this.countOpenCards += 1;

            if (this.countOpenCards == this.arr.length / 2) {
                for (let i = 0; i < this.arrForDelete.length; i++) {
                    this.arrForDelete[i].remove();
                }

                if (this.arrLength == 10) {
                    this.writeDownEasyMemory();
                    this.toggleCount();
                    this.onGameFinished(this.calcMove, this.easyMemoryArrForBord);
                }
                if (this.arrLength == 20) {
                    this.writeDownHardMemory();
                    this.toggleCount();
                    this.onGameFinished(this.calcMove, this.hardMemoryArrForBord);
                }
            }
            return;
        }
        this.openCard2 = card;
    }
}



class Buttons {
    constructor(onGameFinished, name, calcMove, arrForBord) {
        this.name = name;
        this.container = document.createElement("div");
        this.container.className = "container";
        document.body.appendChild(this.container);

        this.header1 = document.createElement("div");
        this.header1.className = "header-small";
        this.header1.innerText = this.name;
        this.container.appendChild(this.header1);

        let container1 = document.createElement("div");
        container1.className = "container-small";
        this.container.appendChild(container1);


        this.onGameFinished = onGameFinished;
        this.calcMove = calcMove;
        this.arrForBord = arrForBord;

        this.lightButton = document.createElement("input");
        this.lightButton.setAttribute("type", "button");
        this.lightButton.setAttribute("value", "легкий уровень");
        this.lightButton.className = "button";
        container1.appendChild(this.lightButton);

        this.lightArrMemory = 10;

        this.lightArrStrit = 10;

        this.hardButton = document.createElement("input");
        this.hardButton.setAttribute("type", "button");
        this.hardButton.setAttribute("value", "сложный уровень");
        this.hardButton.className = "button";
        container1.appendChild(this.hardButton);

        this.hardArrMemory = 20;

        this.hardArrStrit = 20;
    }

    startLightGameMemory() {
        new Memory(this.lightArrMemory, (calcMove, arrForBord) => this.onGameFinished(calcMove, arrForBord)).createNewCards();
        this.doToggleButtons();
    }

    startHardGameMemory() {
        new Memory(this.hardArrMemory, (calcMove, arrForBord) => this.onGameFinished(calcMove, arrForBord)).createNewCards();
        this.doToggleButtons();
    }

    doToggleButtons() {
        this.container.classList.toggle("hidden");
        this.lightButton.classList.toggle("hidden");
        this.hardButton.classList.toggle("hidden");
    }

    initMemory() {
        this.lightButton.addEventListener("click", () => this.startLightGameMemory());
        this.hardButton.addEventListener("click", () => this.startHardGameMemory());
    }

    startLightGameStrit() {
        new Strit(this.lightArrStrit, (calcMove, arrForBord) => this.onGameFinished(calcMove, arrForBord)).createNewCards();
        this.doToggleButtons();
    }

    startHardGameStrit() {
        new Strit(this.hardArrStrit, (calcMove, arrForBord) => this.onGameFinished(calcMove, arrForBord)).createNewCards();
        this.doToggleButtons();
    }

    initStrit() {
        this.lightButton.addEventListener("click", () => this.startLightGameStrit());
        this.hardButton.addEventListener("click", () => this.startHardGameStrit());
    }
}



class SelectGame {
    constructor() {
        this.container = document.createElement("div");
        this.container.className = "container";
        document.body.appendChild(this.container);

        this.header = document.createElement("div");
        this.header.className = "header";
        this.header.innerText = "Карточные игры";
        this.container.appendChild(this.header);

        let container1 = document.createElement("div");
        container1.className = "container-small";
        this.container.appendChild(container1);

        this.playMemory = document.createElement("input");
        this.playMemory.setAttribute("type", "button");
        this.playMemory.setAttribute("value", "Мемори");
        this.playMemory.className = "button";
        container1.appendChild(this.playMemory);

        this.playStrit = document.createElement("input");
        this.playStrit.setAttribute("type", "button");
        this.playStrit.setAttribute("value", "Стрит");
        this.playStrit.className = "button";
        container1.appendChild(this.playStrit);
    }

    init() {
        this.playMemory.addEventListener("click", () => this.dotoggleButtonsGameMemory());
        this.playStrit.addEventListener("click", () => this.dotoggleButtonsGameStrit());
    }

    dotoggleButtonsGameMemory() {
        new Buttons((calcMove, arrForBord) => this.showLeaderBord(calcMove, arrForBord), this.playMemory.value).initMemory();
        this.hideSelectGameMenu();
    }

    dotoggleButtonsGameStrit() {
        new Buttons((calcMove, arrForBord) => this.showLeaderBord(calcMove, arrForBord), this.playStrit.value).initStrit();
        this.hideSelectGameMenu();
    }

    showLeaderBord(calcMove, arrForBord) {
        new LeaderBord(calcMove, arrForBord, () => this.showSelectGameMenu()).createList();
    }

    showSelectGameMenu() {
        this.container.classList.remove("hidden");
    }

    hideSelectGameMenu() {
        this.container.classList.add("hidden");
    }
}

new SelectGame().init();

class LeaderBord {
    constructor(calcMove, arrForBord, onClose) {
        this.end = document.createElement("div");
        this.end.className = "header";
        this.end.innerText = "Игра закончена! Вы сделали " + calcMove + " ходов";
        document.body.appendChild(this.end);

        this.backMenu = document.createElement("input");
        this.backMenu.setAttribute("type", "button");
        this.backMenu.setAttribute("value", "В главное меню");
        this.backMenu.className = "button";
        document.body.appendChild(this.backMenu);

        this.list = document.createElement("ul");
        document.body.appendChild(this.list);

        this.arrForBord = arrForBord;
        this.onClose = onClose;

        this.backMenu.addEventListener("click", () => this.returnInMainMenu());
    }

    returnInMainMenu() {
        this.hideLeaderBord();
        this.onClose();
    }

    hideLeaderBord() {
        this.end.remove();
        this.backMenu.remove();
        this.list.remove();
    }


    createList() {
        this.arrForBord.sort(function(a, b) {
            return a[1] - b[1];
        });

        for (let i = 0; i < this.arrForBord.length; i++) {
            var user = document.createElement("li");
            user.className = "li";
            user.innerText = this.arrForBord[i][0] + "  " + this.arrForBord[i][1];
            this.list.appendChild(user);
        }
    }
}