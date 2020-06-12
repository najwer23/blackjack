
class Card {
    constructor(params) {
        this.name = params.name;
        this.value = params.value;
        this.suit = params.suit;
        this.srcPath = null;
    }
}

window.onload = function () {
    initOnLoad();  
}

function initOnLoad() {
    let deckArrJson = [].concat(
        load13JsonCards("Clubs"),
        load13JsonCards("Diamonds"),
        load13JsonCards("Hearts"),
        load13JsonCards("Spades"),
    )

    let deckArrObj = loadDeckObj(deckArrJson);

    // deckArrObj = fisherShuffle()
}

function loadDeckObj(deckArrJson) {
    let deckArrObj = new Array();
    let cardObj;

    for (let i=0; i<deckArrJson.length; i++) {
        cardObj = new Card(deckArrJson[i])
        deckArrObj.push(cardObj)
    }

    return deckArrObj;
}

function load13JsonCards(suit) {
    let cardsJson = [
        {
            "suit": suit,
            "name": "Ace",
            "value": 1 
        },
        {
            "suit": suit,
            "name": "2",
            "value": 2   
        },
        {
            "suit": suit,
            "name": "3",
            "value": 3   
        },
        {
            "suit": suit,
            "name": "4",
            "value": 4  
        },
        {
            "suit": suit,
            "name": "5",
            "value": 5  
        },
        {
            "suit": suit,
            "name": "6",
            "value": 6  
        },
        {
            "suit": suit,
            "name": "7",
            "value": 7  
        },
        {
            "suit": suit,
            "name": "8",
            "value": 8  
        },
        {
            "suit": suit,
            "name": "9",
            "value": 9  
        },
        {
            "suit": suit,
            "name": "10",
            "value": 10  
        },
        {
            "suit": suit,
            "name": "Jack",
            "value": 10 
        },
        {
            "suit": suit,
            "name": "Queen",
            "value": 10 
        },
        {
            "suit": suit,
            "name": "King",
            "value": 10 
        },        
    ]

    return cardsJson;
}

