class Card {
    constructor(params) {
        this.name = params.name;
        this.value = params.value;
        this.suit = params.suit;
        this.srcName = params.srcName;
    }
}

class Player {
    constructor(name,money) {
        this.name = name;
        this.isSplit = false;
        this.money = money;
        this.moneyOnTable = 0;
        this.handCards = [ 
            { 
                "cards": new Array(), 
                "isPass": false,
                "sumCards": 0,
                "isWin": false
            },
            { 
                "cards": new Array(), 
                "isPass": false,
                "sumCards": 0,
                "isWin": false
            }
        ]
    }
}

class GameTable {
    constructor(players) {
        this.deck = null;
        this.players = players;
        this.blackjack = 21;
        this.minSumCardsForCroupier = 16
    }

    fisherShuffleDeck() {
        let randomNumber;
        let cardObj;
        
        for (let i=0; i<this.deck.length; i++) {
            randomNumber = Math.floor(Math.random() * this.deck.length);
            cardObj = this.deck[randomNumber];
            this.deck[randomNumber] = this.deck[i];
            this.deck[i] = cardObj;
        }
    }

    loadObjCards(suit) {
        let cardsJson = [
            { "suit": suit, "name": "Ace", "value": 1, "srcName": suit+"_Ace.png"},
            { "suit": suit, "name": "2", "value": 2, "srcName": suit+"_2.png" },
            { "suit": suit, "name": "3", "value": 3, "srcName": suit+"_3.png" },
            { "suit": suit, "name": "4", "value": 4, "srcName": suit+"_4.png" },
            { "suit": suit, "name": "5", "value": 5, "srcName": suit+"_5.png" },
            { "suit": suit, "name": "6", "value": 6, "srcName": suit+"_6.png" },
            { "suit": suit, "name": "7", "value": 7, "srcName": suit+"_7.png" },
            { "suit": suit, "name": "8", "value": 8, "srcName": suit+"_8.png" },
            { "suit": suit, "name": "9", "value": 9, "srcName": suit+"_9.png" },
            { "suit": suit, "name": "10", "value": 10, "srcName": suit+"_10.png" },
            { "suit": suit, "name": "Jack", "value": 10, "srcName": suit+"_Jack.png" },
            { "suit": suit, "name": "Queen", "value": 10, "srcName": suit+"_Queen.png" },
            { "suit": suit, "name": "King", "value": 10, "srcName": suit+"_King.png" }       
        ]
    
        return cardsJson;
    }

    getFullDeck(howManyDecks) {
        let deckArrJson = [].concat(
            this.loadObjCards("Clubs"),
            this.loadObjCards("Diamonds"),
            this.loadObjCards("Hearts"),
            this.loadObjCards("Spades"),
        )

        let decks = new Array();

        for (let i=0; i<howManyDecks; i++) {
            decks.push(deckArrJson);
        }

        return [].concat.apply([], decks);
    }

    loadNewDeck() {
        let deckArrJson = this.getFullDeck(1);

        let deckArrObj = new Array();
        let cardObj;

        for (let i=0; i<deckArrJson.length; i++) {
            cardObj = new Card(deckArrJson[i]);
            deckArrObj.push(cardObj);
        }

        this.deck = deckArrObj;
    }

    getCardFromDeck(playerName, isSplit = false) {
        for (let i=0; i< this.players.length; i++) {
            if (playerName == this.players[i].name) {
                let indexHand = isSplit ? 1 : 0;
                this.players[i].handCards[indexHand].cards.push(this.deck.pop());
            }
        }
    }

    createStartHand() {
        for (let i=0; i< this.players.length; i++) {
            this.players[i].handCards[0].cards = [];
            this.players[i].handCards[1].cards = [];
        }
        
        this.getCardFromDeck(this.players[0].name);

        for (let i=1; i< this.players.length; i++) {
            this.getCardFromDeck(this.players[i].name);
            this.getCardFromDeck(this.players[i].name);
        }
    }

    createBlackjack() {
        this.loadNewDeck();
        this.fisherShuffleDeck();
        this.createStartHand();
    }

    setGameResult() {
        let players = this.players;
        let croupierSumCards = players[0].handCards[0].sumCards;
        let playerSumCards;
        let partClassName;
        let resultText;

    
        for (let i=1; i<players.length; i++) {
            for (let j=0; j<players[i].handCards.length; j++) {
                playerSumCards = players[i].handCards[j].sumCards;
                partClassName = j == 0 ? "left" : "right";
                if (players[i].isSplit || j==0) {
                    if ((croupierSumCards < playerSumCards && playerSumCards <= this.blackjack) || (croupierSumCards > this.blackjack)) {
                        players[i].handCards[j].isWin = true; 
                        players[i].money += 2*players[i].moneyOnTable;
                        players[i].moneyOnTable = 0;
                        resultText = "WINNER"
                    } else if ((croupierSumCards <= this.blackjack && playerSumCards < croupierSumCards) || (playerSumCards > this.blackjack)) {
                        players[i].moneyOnTable = 0;
                        resultText = "DEFEATED"
                    } else if (croupierSumCards == playerSumCards) {
                        players[i].money += players[i].moneyOnTable;
                        players[i].moneyOnTable = 0;
                        resultText = "DRAW"
                    }

                    document.querySelectorAll(".player-cards-column-"+partClassName + " .game-result")[0].innerHTML = resultText;
                }
            }
        }
    }

    croupierMove() {
        let players = this.players;
        let isEveryPlayerPassedArr = new Array();
        let isEveryPlayerLessThanBlackjackArr = new Array();
    
        for (let i=1; i<players.length; i++) {
            isEveryPlayerPassedArr.push(players[i].handCards[0].isPass);
            isEveryPlayerLessThanBlackjackArr.push(players[i].handCards[0].sumCards <= this.blackjack);
            
            if (players[i].isSplit) {
                isEveryPlayerPassedArr.push(players[i].handCards[1].isPass);
                isEveryPlayerLessThanBlackjackArr.push(players[i].handCards[1].sumCards <= this.blackjack);
            }   
        }
    
        let isEveryPlayerPass = isEveryPlayerPassedArr.every(isTrue);
        let isOkToGetCardForCroupier = isEveryPlayerLessThanBlackjackArr.every(isTrue);
    
        if (isEveryPlayerPass && isOkToGetCardForCroupier) {
            let croupierName = players[0].name;
            let croupierSumCards = players[0].handCards[0].sumCards;
    
            while (croupierSumCards <= this.minSumCardsForCroupier) {
                this.getCardFromDeck(croupierName);
                this.updateCardsSumForBlackjack();
                croupierSumCards = players[0].handCards[0].sumCards;
            }
        }
    
        if (isEveryPlayerPass) {
            this.setGameResult();
            this.updateCardsOnTheTableForBlackjack();
        } 
    }

    splitCardsPlayer(player) {
        let card2 = player.handCards[0].cards.pop();
        let card1 = player.handCards[0].cards[0];
        let handleColumnElement = document.querySelector(".player-cards-column-right");
    
        if (card2.name === card1.name) {
            player.isSplit = true;
            document.querySelectorAll(".player-cards-column-left .game-result")[0].innerHTML = "SPLITTED";
            player.handCards[1].cards.push(card2);
            handleColumnElement.style.display = "block";
        } else {
            document.querySelectorAll(".player-cards-column-left .game-result")[0].innerHTML = "CAN'T SPLIT";
            player.handCards[0].cards.push(card2);
        }
    
        return player;
    }

    updateMoneyPlayer1() {
        let players = this.players;

        let playerMoneyOnTheTable = document.querySelectorAll("#player-money-on-table")[0];
        let playerMoney = document.querySelectorAll("#player-money")[0];

        playerMoneyOnTheTable.innerHTML = players[1].moneyOnTable + " $";
        playerMoney.innerHTML = players[1].money + " $";
    }

    updateCardsSumForBlackjack() {
        let cardsValueAceAs1, cardsValueAceAs10, cardsArr, cardValue, selectedCardValue;
        let maxAceValue = 11;
        let players = this.players;
    
        for (let i=0; i<players.length; i++) {
            for (let j=0; j<players[i].handCards.length; j++) {
    
                cardsArr = players[i].handCards[j].cards;
                cardsValueAceAs1 = cardsValueAceAs10 = 0;
    
                for (let k=0; k<cardsArr.length; k++) {
                    cardValue = cardsArr[k].name == "Ace" ? maxAceValue : cardsArr[k].value;
                    cardsValueAceAs10 += cardValue;
                    cardsValueAceAs1 += cardsArr[k].value;
                }
    
                selectedCardValue = cardsValueAceAs10 > this.blackjack ? cardsValueAceAs1 : cardsValueAceAs10;
                players[i].handCards[j].sumCards = selectedCardValue;
                players[i].handCards[j].isPass = selectedCardValue > this.blackjack ? true : players[i].handCards[j].isPass;
            }
        }
    }

    updateCardsOnTheTableForBlackjack() {
        let cardsArr, partClassName, handleColumnElement, cardsToShow, handleCardsValue;
        let players = this.players;

        for (let i=0; i<players.length; i++) {
            for (let j=0; j<players[i].handCards.length; j++) {
                
                partClassName = j == 0 ? "left" : "right";
                cardsToShow = "";
                cardsArr = players[i].handCards[j].cards;
                
                for (let k=0; k<cardsArr.length; k++) {
                    cardsToShow += '<img class="card" src="'+"IMG/cards/"+cardsArr[k].srcName+'">';
                }
    
                if (players[i].name == "Croupier") {
                    handleColumnElement = document.querySelector(".dealer-cards-column-"+partClassName+"-view");
                    handleCardsValue = document.querySelector(".dealer-cards-column-"+partClassName+" .card-value");
                } 
    
                if (players[i].name != "Croupier") {
                    handleColumnElement = document.querySelectorAll(".player-cards-column-"+partClassName+"-view")[i-1];
                    handleCardsValue = document.querySelectorAll(".player-cards-column-"+partClassName+" .card-value")[i-1];
                } 
    
                if (handleColumnElement != null && handleCardsValue != null) {
                    handleColumnElement.innerHTML = cardsToShow;
                    handleCardsValue.innerHTML = players[i].handCards[j].sumCards;
                }
            } 
        }

        this.updateMoneyPlayer1()
    }
}


window.onload = function () {
    let players = [
        new Player("Croupier"),
        new Player("Player", 1000),
    ];

    let gameTable = new GameTable(players);
    runBlackjack(gameTable);


    document.querySelector("#players").addEventListener('click', function (e) {
        if (e.target.className.indexOf('button-new-game') != -1) {
            
            players = [
                new Player("Croupier"),
                new Player("Player", players[1].money),
            ];
            document.querySelectorAll(".player-cards-column-left .game-result")[0].innerHTML = "";
            document.querySelectorAll(".player-cards-column-right .game-result")[0].innerHTML = "";
        
            gameTable = new GameTable(players);
            runBlackjack(gameTable);
        }
    });
}

function runBlackjack(gameTable) {
    gameTable.createBlackjack();
    let players = gameTable.players;
    gameTable.updateCardsSumForBlackjack();
    gameTable.updateCardsOnTheTableForBlackjack();

    document.querySelector("#players").addEventListener('click', function (e) {
        if (e.target.className.indexOf('button-hit') != -1) {
            let buttons = this.querySelectorAll(".player-cards-column-left .button-hit");
            for (let i=0; i<buttons.length; i++) {
                if (e.target == buttons[i] && !players[i+1].handCards[0].isPass) {
                    gameTable.getCardFromDeck(players[i+1].name);
                    gameTable.updateCardsSumForBlackjack();
                    gameTable.updateCardsOnTheTableForBlackjack();
                    gameTable.croupierMove();
                }
            }

            buttons = this.querySelectorAll(".player-cards-column-right .button-hit");
            for (let i=0; i<buttons.length; i++) {
                if (e.target == buttons[i] && !players[i+1].handCards[1].isPass) {
                    gameTable.getCardFromDeck(players[i+1].name, true);
                    gameTable.updateCardsSumForBlackjack();
                    gameTable.updateCardsOnTheTableForBlackjack();
                    gameTable.croupierMove();
                }
            }
        }

        if (e.target.className.indexOf('button-stand') != -1) {
            let buttons = this.querySelectorAll(".player-cards-column-left .button-stand");
            for (let i=0; i<buttons.length; i++) {
                if (e.target == buttons[i] && !players[i+1].handCards[0].isPass) {
                    players[i+1].handCards[0].isPass = true;
                    gameTable.updateCardsSumForBlackjack();
                    gameTable.updateCardsOnTheTableForBlackjack();
                    gameTable.croupierMove();
                }
            }

            buttons = this.querySelectorAll(".player-cards-column-right .button-stand");
            for (let i=0; i<buttons.length; i++) {
                if (e.target == buttons[i] && !players[i+1].handCards[1].isPass) {
                    players[i+1].handCards[1].isPass = true;
                    gameTable.updateCardsSumForBlackjack();
                    gameTable.updateCardsOnTheTableForBlackjack();
                    gameTable.croupierMove();
                }
            }
        }

        if (e.target.className.indexOf('button-split') != -1) {
            let buttons = this.querySelectorAll(".player-cards-column-left .button-split");
            for (let i=0; i<buttons.length; i++) {
                if (e.target == buttons[i] && !players[i+1].isSplit && !players[i+1].handCards[0].isPass) {
                    players[i+1] = gameTable.splitCardsPlayer(players[i+1]);
                    gameTable.updateCardsSumForBlackjack();
                    gameTable.updateCardsOnTheTableForBlackjack();
                }
            }
        }


        // money
        let money = [10,50,100,"all"];
        money.map(m => {
            if (e.target.className.indexOf('button-'+m) != -1) {
                let buttons = this.querySelectorAll(".money .button-"+m);
                for (let i=0; i<buttons.length; i++) {
                    if (e.target == buttons[i] && !players[i+1].handCards[0].isPass) {
                        if (m=="all"){
                            players[i+1].moneyOnTable += players[i+1].money
                            players[i+1].money -= players[i+1].money
                        } else {
                            players[i+1].moneyOnTable += players[i+1].money >= m ? m : 0;
                            players[i+1].money -= players[i+1].money >= m ? m : 0;  
                        }
                        gameTable.updateMoneyPlayer1();
                    }
                }
            }
        })
    });
}

function isTrue(value) {
    return value === true;
}

