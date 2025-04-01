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

function dropCoin(row, col) {
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
            let spotCoin = document.getElementById("spot" + (y) + col);
            spotCoin.removeChild(spotCoin.children[0]);
            let newCoin = document.createElement("div");
            newCoin.classList.add(currentPlayer + "Coin");
            spotCoin.appendChild(newCoin);
        }

        //check if the game ends
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
            document.getElementById("player").innerText = "WINNER!!!";

           
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

function checkGameResult(row, col) {    
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

        let centerCol = col;
        //if it is the first left row we shift the check to the second in the left
        //else if the col is the last col in the right of the board then shift one to left to get the last but one column as a center 

        if (centerCol == 0) {
            centerCol = col + 1;
        } else if (centerCol == COLS - 1) {
            centerCol = col - 1;
        };        

        //DIAGONAL from left to right check
        let spotDownLeft = document.getElementById("spot" + (centerRow - 1) + (centerCol - 1));
        spotCenter = document.getElementById("spot" + (centerRow) + centerCol);
        let spotUpRight = document.getElementById("spot" + (centerRow + 1) + (centerCol + 1));
        if (spotDownLeft.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
            spotCenter.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
            spotUpRight.querySelectorAll("." + currentPlayer + "Coin").length > 0) {
            return true;
        };

        //DIAGONAL from right to left check
        let spotDownRight = document.getElementById("spot" + (centerRow - 1) + (centerCol + 1));
        spotCenter = document.getElementById("spot" + (centerRow) + centerCol);
        let spotUpLeft = document.getElementById("spot" + (centerRow + 1) + (centerCol - 1));

        if (spotDownRight.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
            spotCenter.querySelectorAll("." + currentPlayer + "Coin").length > 0 &&
            spotUpLeft.querySelectorAll("." + currentPlayer + "Coin").length > 0) {
            return true;
        };

    };
}

function playAgain() {    
    let boardElements = Array.from(document.getElementById("board").children);
    boardElements.map((element,index) => {
        if (index != 0) {
            element.remove();
        }                        
    });

    let firstRow = Array.from(document.getElementById("firstRow").children);
    firstRow.map((element) => {
        element.remove();                        
    });

    endGame = false;
    document.getElementById("currentPlayerCoin").classList.remove(currentPlayer + "Coin");    
    currentPlayer = "red";
    document.getElementById("currentPlayerCoin").classList.add(currentPlayer + "Coin");
    document.getElementById("player").innerText = "CURRENT PLAYER";          
    
    createBoard();
}

