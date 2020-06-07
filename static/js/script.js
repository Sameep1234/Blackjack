let blackjackVariables = {
    'you': {'scoreSpan': '#yourScoreSpan', 'div': '#yourBox', 'score': 0},
    'dealer': {'scoreSpan': '#dealerScoreSpan', 'div': '#dealerBox', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardsScore': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1,11]},
    'clickedStandButton': false,
    'allCompleted': false,
    'wins': 0,
    'loses': 0,
    'draws': 0,
};

const YOU = blackjackVariables['you']
const DEALER = blackjackVariables['dealer']

const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lossSound = new Audio('static/sounds/aww.mp3');

document.querySelector('#buttonHit').addEventListener('click', blackjackHit);
document.querySelector('#buttonStand').addEventListener('click', botsTurn);
document.querySelector('#buttonDeal').addEventListener('click', blackjackDeal);

function blackjackDeal(){
    if(blackjackVariables['allCompleted'] === true){
        blackjackVariables['clickedStandButton'] = false;
        let playerImages = document.querySelector('#yourBox').querySelectorAll('img');
        let botImages = document.querySelector('#dealerBox').querySelectorAll('img');
        for(i=0;i<playerImages.length;i++){
            playerImages[i].remove();
        }
        for(i=0;i<botImages.length;i++){
            botImages[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#yourScoreSpan').textContent = 0;        
        document.querySelector('#dealerScoreSpan').textContent = 0;  
        
        document.querySelector('#yourScoreSpan').style.color = '#ffffff'; 
        document.querySelector('#dealerScoreSpan').style.color = '#ffffff'; 
    
        document.querySelector('#resultSpan').textContent = "Let's Play!";
        document.querySelector('#resultSpan').style.color = "black";

        blackjackVariables['allCompleted'] = false;
    }
}

function blackjackHit() {
    if(blackjackVariables['clickedStandButton'] === false){
        let card = randomCard();
        showCard(card, YOU);
        scoreUpdate(card, YOU);
        printScore(YOU);
    }
}

function randomCard(){
    let randomIndex =  Math.floor(Math.random() * 12);
    return blackjackVariables['cards'][randomIndex];
}

function showCard(card, activePlayer){
    let cardImage = document.createElement('img');
    cardImage.src = `static/images/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
}

function scoreUpdate(card, activePlayer){
    if(card === 'A'){
        if(activePlayer['score'] + blackjackVariables['cardsScore'][card][1] <= 21){
            activePlayer['score'] += blackjackVariables['cardsScore'][card][1];
        }else{
            activePlayer['score'] += blackjackVariables['cardsScore'][card][0];
        }
    }else{
        activePlayer['score'] += blackjackVariables['cardsScore'][card];
    }

}

function printScore(activePlayer){
    if(activePlayer['score'] > 21){
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';

        blackjackVariables['clickedStandButton'] = true;
    } else{
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function winner(){
    let result;
    if(YOU['score'] <= 21){
        if(YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)){
            console.log('You Won!');
            blackjackVariables['wins']++;
            result = YOU;
        }
        else if(YOU['score'] < DEALER['score']){
            console.log('You lost!');
            blackjackVariables['loses']++;
            result = DEALER;
        }
        else if(YOU['score'] === DEALER['score']){
            console.log('You Drew!');
            blackjackVariables['draws']++;
        }
    }else if(YOU['score'] > 21 && DEALER['score'] <= 21) {
        console.log('You Lost!');
        blackjackVariables['loses']++;
        result = DEALER;
    } else if(YOU['score'] > 21 && DEALER['score'] > 21){
        console.log('You Drew!');
        blackjackVariables['draws']++;
    }

    return result;
}

async function botsTurn(){
    blackjackVariables['clickedStandButton'] = true;
    while(DEALER['score'] < 16 && blackjackVariables['clickedStandButton'] == true){
        let card = randomCard();
        showCard(card, DEALER);
        scoreUpdate(card, DEALER);
        printScore(DEALER);
        await sleep(1000);
    }
    blackjackVariables['allCompleted'] = true;
    let result = winner();
    printResult(result);
}

function printResult(result){
    let message, colorMessage;
    if(blackjackVariables['allCompleted'] === true){
        if(result === YOU){
            document.querySelector('#wins').textContent = blackjackVariables['wins'];
            message = 'You Won!';
            colorMessage = 'green';
            winSound.play();
        }else if(result === DEALER){
            document.querySelector('#loses').textContent = blackjackVariables['loses'];
            message = 'You Lost!';
            colorMessage = 'red';
            lossSound.play();
        }else{
            document.querySelector('#draws').textContent = blackjackVariables['draws'];
            message = 'You Drew!';
            colorMessage = 'black';
        }

        document.querySelector('#resultSpan').textContent = message;
        document.querySelector('#resultSpan').style.color = colorMessage;

    }
}