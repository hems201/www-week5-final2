//tässä versiossa mark poistettiin käytöstä ja player piirtää merkin
var turn = 0; //keeps track of played turns
let scoreID = 0; //scoreID
let player = "X"; //current player
let status = "Game on"; //shows the game status, default id game on
const cells = document.getElementsByClassName("cell"); //all cell elements
var markup = new Array(cells.lenght);

console.log("something happens");

if (document.readyState !== "loading") {
  console.log("executing");
  start();
} else {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("executing after wait");
    start();
  });
}

function start() {
  getScore();
  //goes through all cells and adds EventListener
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", function () {
      cellClick(i);
    });
  }
  //Event listener fot Restart button
  document.getElementById("restart").addEventListener("click", restart);
}

//Function for clicked cell
function cellClick(i) {
  console.log("click");
  if (cells[i].innerHTML.trim() === "" && status === "Game on") {
    //checks that the cell is empty and game is on
    cells[i].innerHTML = player; //current player's mark is written to clicked cell

    //check if there are 5 matching symbols in a row
    for (let j = 0; j < 25; j = j + 5) {
      if (
        cells[j].innerHTML !== "" &&
        cells[j].innerHTML === cells[j + 1].innerHTML &&
        cells[j].innerHTML === cells[j + 2].innerHTML &&
        cells[j].innerHTML === cells[j + 3].innerHTML &&
        cells[j].innerHTML === cells[j + 4].innerHTML
      ) {
        winner(j, j + 1, j + 2, j + 3, j + 4); //trigger winning function if winning requirements are met
      }
    }
    //check if there are 5 matching symbols in a column
    for (let k = 0; k < 5; k = k + 1) {
      if (
        cells[k].innerHTML !== "" &&
        cells[k].innerHTML === cells[k + 5].innerHTML &&
        cells[k].innerHTML === cells[k + 10].innerHTML &&
        cells[k].innerHTML === cells[k + 15].innerHTML &&
        cells[k].innerHTML === cells[k + 20].innerHTML
      ) {
        winner(k, k + 5, k + 10, k + 15, k + 20);
      }
      //check if there are 5 matching symbols accross the table
    }
    if (
      cells[0].innerHTML !== "" &&
      cells[0].innerHTML === cells[6].innerHTML &&
      cells[0].innerHTML === cells[12].innerHTML &&
      cells[0].innerHTML === cells[18].innerHTML &&
      cells[0].innerHTML === cells[24].innerHTML
    ) {
      winner(0, 6, 12, 18, 24);
    } else if (
      cells[4].innerHTML !== "" &&
      cells[4].innerHTML === cells[8].innerHTML &&
      cells[4].innerHTML === cells[12].innerHTML &&
      cells[4].innerHTML === cells[16].innerHTML &&
      cells[4].innerHTML === cells[20].innerHTML
    ) {
      winner(4, 8, 12, 16, 20);
    }
    //player is switched
    if (player === "X") {
      player = "O";
    } else {
      player = "X";
    }
    //if all the boxes are filled but there has been no win, alert tie
    turn = parseInt(turn, 10);
    turn = turn + 1;
    if (turn === 25) {
      alert("It's a tie! No winners here.");
    }
  }
  sendScore();
}

function winner(a, b, c, d, e) {
  //if game is won
  //highlight winner cells
  turn = 0; //make turn 0 so that the tie message won't be executed
  cells[a].style.backgroundColor = "green";
  cells[b].style.backgroundColor = "green";
  cells[c].style.backgroundColor = "green";
  cells[d].style.backgroundColor = "green";
  cells[e].style.backgroundColor = "green";
  status = "Game over"; //end game
  alert("Player " + player + " won!");
}

//when restart button is pressed
function restart() {
  //make cells blank again and reset color
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerHTML = "";
    cells[i].style.backgroundColor = "black";
  }
  //change player to player X again and set game status to "game on"
  player = "X";
  status = "Game on";
  turn = 0;
  sendScore();
}

function getScore() {
  fetch("/score/", {
    method: "GET"
  })
    //datassa kaikki halutut tiedot, saadaan index.js:n kautta?
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data); //varuilta

      if (data) {
        //jos dataa on olemassa?
        markup = data.markup;
        player = data.player;
        turn = data.turn;
        status = data.status;

        //tallennetaan haettu score peliin
        for (let i = 0; i < cells.length; i++) {
          cells[i].innerHTML = markup[i];
        }
        console.log("Score loaded, player", player, "turn"); //varuilta
      } else {
        console.log("No score found.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function sendScore() {
  //store table markup for database
  for (let i = 0; i < cells.length; i++) {
    markup[i] = cells[i].innerHTML;
  }

  var data = {
    scoreID: scoreID,
    markup: markup,
    player: player,
    turn: turn,
    status: status
  };
  console.log(JSON.stringify(data));

  console.log("Saving table state...");

  //send click information forward (data)
  fetch("/create", {
    method: "POST",
    redirect: "follow",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(data)
  }).then((response) => {
    if (response.redirected) {
      console.log("redirect");
      window.location.href = response.url;
    }
  });
}
