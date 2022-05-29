// login 

document.querySelector(".game-controller span").onclick = function (){
    let theName = prompt("What is your name?");
    
    if(theName == null || theName == ""){
        theName = "unknown";
        document.querySelector(".name span").innerHTML = theName;
    } else {
        document.querySelector(".name span").innerHTML = theName;
    }

    // set a value to the local storage
    localStorage.setItem("player_name",theName);

    document.querySelector(".game-controller").remove();
    timing();
};

// Mains variables
let duration = 1000;
let blocksContainer = document.querySelector(".memory-game-blocks");
let blocks = Array.from(blocksContainer.children);
let orderRange = [...Array(blocks.length).keys()];

// Call shuffle function to randomize orderrange values 
shuffle(orderRange);
// Add css order property to blocks 
blocks.forEach( (block, index) => {
    block.style.order = orderRange[index];

    // call flipBlock function 
    block.addEventListener("click", function(){
        filpblock(block);
    })
});

// flip block function 
function filpblock(selectblock){

    selectblock.classList.add("is-flipped");

    let allFippedBlocks = blocks.filter( block => block.classList.contains("is-flipped"));

    // check if tow blocks flipped
    if( allFippedBlocks.length == 2){
        //call stopClick function to stop click event on other blocks
        stopClicking();
        //call checkMatchedBlock to check if the tow blocks flipped are the same
        checkMatchedBlock(allFippedBlocks[0],allFippedBlocks[1]);
    }
}

// stopClicking function
function stopClicking() {
    // Add class no-clicking to the blocksContainer 
    blocksContainer.classList.add("no-clicking");
    // remove the no-clicking class after 1s
    setTimeout( () => {
        blocksContainer.classList.remove("no-clicking");
        
    }, duration);
}
// check matched function 
function checkMatchedBlock(firstBlock, secondBlock){
    let wrongTries = document.querySelector(".tries span"),
        correctTries =document.querySelector(".info-container > span");
    if(firstBlock.dataset.technology == secondBlock.dataset.technology){
        firstBlock.classList.remove("is-flipped");
        secondBlock.classList.remove("is-flipped");

        firstBlock.classList.add("has-matched");
        secondBlock.classList.add("has-matched");    
        correctTries.innerHTML = parseInt(correctTries.innerHTML) + 1;
        if(correctTries.innerHTML == 10){
            endGame("success");
        }
    } else {
        setTimeout(() => {
            wrongTries.innerHTML = parseInt(wrongTries.innerHTML) + 1;
            // Set wrong tries at local storage
            localStorage.setItem("player_score",wrongTries.innerHTML);
            firstBlock.classList.remove("is-flipped");
            secondBlock.classList.remove("is-flipped");
        }, duration);
    }
}
// The shuffle function 
function shuffle(array){
    let current = array.length,
        random,
        temp;
        while(current > 0){
            random = Math.floor(Math.random() * current);
            temp = array[current];
            array[current] = array[random];
            array[random] = temp;
            current--;
        }
        return array;
}
// Declare the timing variable
let time = 120;
// Timing function 
function timing(){
    timeInterval = setInterval(() => {
        time--;
        document.querySelector(".time span").innerHTML = time;
        if( time === 0){
            endGame("fail");
        }
    }, 1000);
}
// End Game function
function endGame(end){
    document.body.firstElementChild.classList.add("overlay");

    let popup = document.createElement("div");
    popup.classList.add("popup");
    let popupText;
    if(end === "success"){
        clearInterval(timeInterval);
        popup.innerHTML = `<br> <br>You're grade is: ${120 - time - localStorage.getItem("player_score")}`;
        popupText = document.createTextNode(`Congratulation, You're finish the game in ${120-time} secondes`);
    }  else {
        clearInterval(timeInterval);
        popup.innerHTML = `<br> <br>You're grade is: 0`;
        popupText = document.createTextNode(`Sorry, The game over you're exploite the full time`);
    }
    popup.insertBefore(popupText, popup.firstElementChild);

    // create replay button
    let replayBtn = document.createElement("span");
    replayBtn.classList.add("replay")
    replayBtn.textContent = "Replay";
    popup.appendChild(replayBtn);

    // create show-history button
    let showHistory = document.createElement("span");
    showHistory.classList.add("show-history")
    showHistory.textContent = "Game History";
    popup.appendChild(showHistory);

    document.body.appendChild(popup);
}

// Repaly function 
document.addEventListener("click", function(e){
    if(e.target == document.querySelector(".popup .replay")){
        window.location.reload();
    }
});
// The history
let gameHistory = document.getElementById("history");


// Show history function 
document.addEventListener("click", function(e){
    if(e.target === document.querySelector(".popup .show-history")){
        gameHistory.classList.add("game-history");
        // create reset button 
        let resetBtn = document.createElement("span");
        resetBtn.textContent = "Reset history";
        resetBtn.classList.add("reset");
        gameHistory.appendChild(resetBtn);
        document.querySelector(".popup").style.display = "none";
    }
});

let pName;
let pScore;
let myHistory;
let playerInfo = {};

pName = localStorage.getItem("player_name");
pScore = localStorage.getItem("player_score");

console.log(pName);
console.log(pScore);

myHistory = localStorage.getItem("history");
// if the locla storage was reseted myHistory become null
if(myHistory === null){
    myHistory = `{}`;
}
playerInfo = JSON.parse(myHistory);

playerInfo[pName] = pScore;

console.log(playerInfo);

localStorage.setItem("history",JSON.stringify(playerInfo));

myHistory = localStorage.getItem("history");

// Add local storage content at div gameHistory
let players = Object.entries(playerInfo);
gameHistory.innerHTML = "Game history:<br>";
players.forEach( player => {
    gameHistory.innerHTML += `<span> ${player[0]}:<span> ${player[1]} <br>`;
});

// Reset local storage
document.addEventListener("click", function(e){
    if(e.target == document.querySelector(".game-history .reset")){
        localStorage.clear();
        // clear gameHistory content without reset button
        gameHistory.innerHTML = " <span class='reset'> Reset history </span>";
        // document.querySelector(".game-history span.reset").style.visibility ="visible";
    }
});
