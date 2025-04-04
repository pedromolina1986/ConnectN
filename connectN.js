/*
REFERENCES:

ARROW MOVEMENT: 
    https://stackoverflow.com/questions/28267256/how-to-move-an-element-to-the-mouse-position
    https://www.w3schools.com/jsref/event_onmousemove.asp
*/

let ROWS = 6;
let COLS = 3;
let currentPlayer = "red";//yellow is the second player
let endGame = false;
let draw = false;

function startButton() {
    let gameStartContainer = document.getElementById("gameStart");
    let gamePlayContainer = document.getElementById("gamePlay");

    gameStartContainer.style.display = "none";
    gamePlayContainer.style.visibility = "visible";

}

function createBoard() {
    let board = document.getElementById("board");

    /*
    <td colspan=3 class="tdArrow">
        <div class="arrow"></div>
    </td>
    */
    let tdArrow = document.createElement("td");
    tdArrow.colSpan = 3;
    tdArrow.classList.add("tdArrow");
    let divArrow = document.createElement("div");
    divArrow.classList.add("arrow");
    tdArrow.appendChild(divArrow);
    document.getElementById("firstRow").appendChild(tdArrow);

    board.addEventListener('mousemove', function (event) {
        var x = event.clientX;
        var arrow = document.querySelector(".arrow");
        if (arrow) {
            arrow.style.position = "absolute";
            arrow.style.left = `${x}px`;
        }
    })

    //let tdArrow = document.createElement
    for (let i = 0; i < ROWS; i++) {
        let newRow = document.createElement("tr");
        newRow.classList.add("boardRow");
        for (let j = 0; j < COLS; j++) {
            //add new spot for the coin
            let newSpot = document.createElement("td");
            newSpot.classList.add("spot");
            newSpot.id = "spot" + i + j;
            newSpot.onclick = function () {
                dropCoin(i, j)
            };
            //add a blank coin in the spot
            let newCoin = document.createElement("div");
            newCoin.classList.add("blankCoin");
            newSpot.appendChild(newCoin);

            newRow.appendChild(newSpot);
        }
        board.appendChild(newRow);
    }
}

function changeCoinInTheSpot(spot, col, color) {
    let spotCoin = document.getElementById("spot" + spot + col);
    spotCoin.removeChild(spotCoin.children[0]);
    let newCoin = document.createElement("div");
    newCoin.classList.add(color + "Coin");
    spotCoin.appendChild(newCoin);
}

async function dropCoin(row, col) {
    if (!endGame) {
        let y = 0;
        //find the first blank space to fill with the player color        
        while (y < ROWS && document.getElementById("spot" + y + col).querySelectorAll(".blankCoin").length > 0) {
            y++;
        };
        //set the last spot with blank space in the column
        y--;

        // if there is blank space to fill the remove the blank and fill the
        // space with the color of the current player
        if (y >= 0) {

            /*for (let spot = 0; spot < y; spot++) {
                changeCoinInTheSpot(spot, col, currentPlayer);
                await sleep(200);
                changeCoinInTheSpot(spot, col, "blank");
            }*/

            let spotCoin = document.getElementById("spot" + (y) + col);
            spotCoin.removeChild(spotCoin.children[0]);
            let newCoin = document.createElement("div");
            newCoin.classList.add(currentPlayer + "Coin");
            spotCoin.appendChild(newCoin);
        }

        //check if the game ends
        if (y >= 0) {
            endGame = checkGameResult(y, col);

            if (!endGame) {
                //change player side
                document.getElementById("currentPlayerCoin").classList.remove(currentPlayer + "Coin");
                if (currentPlayer == "red") {
                    currentPlayer = "yellow";
                } else {
                    currentPlayer = "red";
                }
                document.getElementById("currentPlayerCoin").classList.add(currentPlayer + "Coin");
            } else {
                if (draw) {
                    document.getElementById("player").innerText = "DRAW GAME!!!";
                    document.getElementById("currentPlayerCoin").classList.remove(currentPlayer + "Coin");                  
                    document.getElementById("currentPlayerCoin").classList.add("blankCoin");
                } else {
                    document.getElementById("player").innerText = "WINNER!!!";
                }
                


                let firstRow = Array.from(document.getElementById("firstRow").children);
                firstRow.map((element) => {
                    element.remove();
                });
                /*
                <td colspan="3">
                    <div id="messageContainer" class="messageContainer">
                        <span id="messageText" onclick="playAgain()">PLAY AGAIN</span>
                    </div>
                </td>                    
                */
                let td = document.createElement("td");
                td.colSpan = 3;
                let div = document.createElement("div");
                div.id = "messageContainer";
                div.classList.add("messageContainer");
                let span = document.createElement("span");
                span.id = "messageText";
                span.onclick = function () {
                    playAgain();
                }
                span.innerText = "Play Again";
                div.appendChild(span);
                td.appendChild(div);
                document.getElementById("firstRow").appendChild(td);

            }
        }
        
    }
}

function checkGameResult(row, col) {
    //is there any blank coin?
    if (document.querySelectorAll(".blankCoin").length == 0){
        draw = true;
        return true;
    }
    if (row >= 0) {
        //row check    
        let spotLeft = document.getElementById("spot" + row + 0);
        let spotCenter = document.getElementById("spot" + row + 1);
        let spotRight = document.getElementById("spot" + row + 2);

        if (spotLeft.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
            spotCenter.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
            spotRight.querySelectorAll("." + currentPlayer + "Coin").length > 0) {
            return true;
        }

        //col & diagonal check    
        //JUST CHECK after third row to optimize thhe gaming logic
        let centerRow = 0;
        if (row < ROWS - 2) {
            centerRow = row + 1;
            let spotDown = document.getElementById("spot" + (centerRow - 1) + col);
            spotCenter = document.getElementById("spot" + (centerRow) + col);
            let spotUp = document.getElementById("spot" + (centerRow + 1) + col);

            //COL check
            if (spotDown.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
                spotCenter.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
                spotUp.querySelectorAll("." + currentPlayer + "Coin").length > 0) {
                return true;
            };

        };       
        
        //DIAGONAL from left to right check
        //center coolumn always will be 1 in a diagonal        
        
        //if the col is the last one
        let spot1;
        let spot2;
        let spot3;
        if (col == 2){
            //going down
            if (row+1 < ROWS && row+2 < ROWS) {
                spot1 = document.getElementById("spot" + (row) + (col));
                spot2 = document.getElementById("spot" + (row+1) + (col-1));
                spot3 = document.getElementById("spot" + (row+2) + (col-2));
                if (spot1.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
                    spot2.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
                    spot3.querySelectorAll("." + currentPlayer + "Coin").length > 0) {
                    return true;
                };
            };           
    
            //going up
            if (row-1 >= 0 && row-2 >= 0) {
                spot1 = document.getElementById("spot" + (row) + (col));
                spot2 = document.getElementById("spot" + (row-1) + (col-1));
                spot3 = document.getElementById("spot" + (row-2) + (col-2));
                if (spot1.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
                    spot2.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
                    spot3.querySelectorAll("." + currentPlayer + "Coin").length > 0) {
                    return true;
                };
            };
        };
        //if the col is the middle one
        if (col == 1) {
            //DIAGONAL from left to right check
            if (row - 1 >= 0 && row + 1 < ROWS) {
                let spotDownLeft = document.getElementById("spot" + (row - 1) + (col - 1));
                spotCenter = document.getElementById("spot" + (row) + (col));
                let spotUpRight = document.getElementById("spot" + (row + 1) + (col + 1));
                if (spotDownLeft.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
                    spotCenter.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
                    spotUpRight.querySelectorAll("." + currentPlayer + "Coin").length > 0) {
                    return true;
                };
            };
            
    
            //DIAGONAL from right to left check
            if (row - 1 >= 0 && row + 1 < ROWS) {
                let spotDownRight = document.getElementById("spot" + (row - 1) + (col + 1));
                spotCenter = document.getElementById("spot" + (row) + (col));
                let spotUpLeft = document.getElementById("spot" + (row + 1) + (col - 1));
        
                if (spotDownRight.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
                    spotCenter.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
                    spotUpLeft.querySelectorAll("." + currentPlayer + "Coin").length > 0) {
                    return true;
                };
            };
        };
        //if the col is the first one
        if (col == 0){
            //going down
            if (row+1 < ROWS && row+2 < ROWS){
                spot1 = document.getElementById("spot" + (row) + (col));
                spot2 = document.getElementById("spot" + (row+1) + (col+1));
                spot3 = document.getElementById("spot" + (row+2) + (col+2));
                if (spot1.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
                    spot2.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
                    spot3.querySelectorAll("." + currentPlayer + "Coin").length > 0) {
                    return true;
                };
            };
            
    
            //going up
            if (row-1 >= 0 && row-2 >= 0){
                spot1 = document.getElementById("spot" + (row) + (col));
                spot2 = document.getElementById("spot" + (row-1) + (col+1));
                spot3 = document.getElementById("spot" + (row-2) + (col+2));
                if (spot1.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
                    spot2.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
                    spot3.querySelectorAll("." + currentPlayer + "Coin").length > 0) {
                    return true;
                };
            };
        
        };        
    };
};

function playAgain() {
    let boardElements = Array.from(document.getElementById("board").children);
    boardElements.map((element, index) => {
        if (index != 0) {
            element.remove();
        }
    });

    let firstRow = Array.from(document.getElementById("firstRow").children);
    firstRow.map((element) => {
        element.remove();
    });

    endGame = false;
    draw = false;
    document.getElementById("currentPlayerCoin").classList.remove(currentPlayer + "Coin");
    currentPlayer = "red";
    document.getElementById("currentPlayerCoin").classList.add(currentPlayer + "Coin");
    document.getElementById("player").innerText = "PLAYER TURN";

    createBoard();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}