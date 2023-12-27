/*
    Format USD: https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
*/
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
/*
    End Format USD: https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
*/

const hideModal = (modalId) => {
  const modal = document.querySelector(`#${modalId}`);
  if (modal.classList.contains("show")) {
    modal.classList.remove("show");
    modal.style = "display: none;";
    if (document.querySelector(".modal-backdrop")) {
      document.querySelector(".modal-backdrop").remove();
    }
  }
};

// Use of jQuery for requirements purposes
$(".reels-row").click(function () {
  const src = "https://www.youtube.com/embed/pvX6HgWuA90";
  if ($("#youtubeIframe").attr("src") != src) {
    $("#youtubeIframe").attr("src", src);
  }
  $("#youtubeModal").modal("show");
});

$("#youtubeClose").click(function () {
  $("#youtubeIframe").removeAttr("src");
});
// End use of jQuery

/*
  Code from: https://www.techrepublic.com/article/preloading-and-the-javascript-image-object/
*/
const preloadImages = () => {
  const imageObj = new Image();
  const images = [
    "./images/Strawberry.png",
    "./images/Bar.png",
    "./images/Lemon.png",
    "./images/Bell.png",
    "./images/Clover.png",
    "./images/Cherry.png",
    "./images/Diamond.png",
    "./images/Orange.png",
    "./images/Seven.png",
    "./images/HorseShoe.png",
    "./images/Plum.png",
    "./images/Watermellon.png",
  ];
  for (let i = 0; i < images.length; i++) {
    imageObj.src = images[i];
  }
};
/*
  End code from: https://www.techrepublic.com/article/preloading-and-the-javascript-image-object/
*/

const getImages = () => {
  const images = [
    "Strawberry",
    "Bar",
    "Lemon",
    "Bell",
    "Clover",
    "Cherry",
    "Diamond",
    "Orange",
    "Seven",
    "HorseShoe",
    "Plum",
    "Watermellon",
  ];
  return images;
};

const getRandomImage = (images) => {
  return images[Math.floor(Math.random() * 12)];
};

const displayImages = (reels) => {
  document.querySelector("#reel1").src = `./images/${reels[0]}.png`;
  document.querySelector("#reel2").src = `./images/${reels[1]}.png`;
  document.querySelector("#reel3").src = `./images/${reels[2]}.png`;
};

const pageLoad = async () => {
  preloadImages();
  const images = getImages();
  const reels = [
    getRandomImage(images),
    getRandomImage(images),
    getRandomImage(images),
  ];
  displayImages(reels);
  document.querySelector(
    "#money-label"
  ).innerText = `Your Money:  ${currencyFormatter.format(100)}`;
};

const getPlayersMoney = () => {
  const moneyLabel = document.querySelector("#money-label");
  const playersMoney = parseFloat(moneyLabel.textContent.slice(14));
  return playersMoney;
};

const getBet = () => {
  let bet = 0;
  const betText = document.querySelector("#bet").value;
  bet = parseFloat(betText);
  if (isNaN(bet)) return 0;
  return bet;
};

const validBet = (bet, playersMoney, resultLabel) => {
  if (bet === 0) return false;
  if (bet < 0.25) {
    resultLabel.innerText = `Minimum bet is ${currencyFormatter.format(0.25)}`;
    resultLabel.classList.add("text-danger", "fw-bolder");
    return false;
  }
  if (bet > playersMoney) {
    resultLabel.innerText = "Insufficient funds!";
    resultLabel.classList.add("text-danger", "fw-bolder");
    return false;
  }
  return true;
};

const isBar = (reels) => {
  if (reels[0] == "Bar" || reels[1] == "Bar" || reels[2] == "Bar") {
    return true;
  } else {
    return false;
  }
};

const isJackpot = (reels) => {
  if (reels[0] == "Seven" && reels[1] == "Seven" && reels[2] == "Seven") {
    return true;
  } else {
    return false;
  }
};

const determineCherryCount = (reels) => {
  let cherryCount = 0;
  if (reels[0] == "Cherry") cherryCount++;
  if (reels[1] == "Cherry") cherryCount++;
  if (reels[2] == "Cherry") cherryCount++;
  return cherryCount;
};

const determineMultiplier = (reels) => {
  const cherryCount = determineCherryCount(reels);
  if (cherryCount == 1) return 2;
  if (cherryCount == 2) return 3;
  if (cherryCount == 3) return 4;
  return 0;
};

const isWinner = (reels) => {
  const multiplier = determineMultiplier(reels);
  if (multiplier > 0) return { winner: true, multiplier: multiplier };
  return { winner: false, multiplier: multiplier };
};

const evaluateSpin = (reels) => {
  if (isBar(reels)) return 0;
  if (isJackpot(reels)) return 100;
  const check = isWinner(reels);
  if (check.winner) return check.multiplier;
  return 0;
};

/*
    Code from:  https://codingshala.com/javascript/how-to-slow-down-a-javascript-loop/#:~:text=How%20to%20slow%20down%20a%20Javascript%20Loop%201,loop%20or%20iteration%20in%20Javascript.%204%20Conclusion.%20
*/
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const cycleImages = async (images, reel1, reel2, reel3) => {
  for (const image of images) {
    reel1.src = `./images/${image}.png`;
    reel2.src = `./images/${image}.png`;
    reel3.src = `./images/${image}.png`;
    await sleep(50);
  }
};
/*
    End code from:  https://codingshala.com/javascript/how-to-slow-down-a-javascript-loop/#:~:text=How%20to%20slow%20down%20a%20Javascript%20Loop%201,loop%20or%20iteration%20in%20Javascript.%204%20Conclusion.%20
*/

const spinReels = async () => {
  const images = getImages();
  const reel1 = document.querySelector("#reel1");
  const reel2 = document.querySelector("#reel2");
  const reel3 = document.querySelector("#reel3");
  for (let i = 0; i < 2; i++) {
    await cycleImages(images, reel1, reel2, reel3);
  }
  return images;
};

const pullLever = async (bet) => {
  const images = await spinReels();
  const reels = [
    getRandomImage(images),
    getRandomImage(images),
    getRandomImage(images),
  ];
  displayImages(reels);
  const multiplier = evaluateSpin(reels);
  return bet * multiplier;
};

const displayResult = (bet, winnings) => {
  let resultLabel = document.querySelector("#result-label");
  if (resultLabel.classList.contains("text-danger")) {
    resultLabel.classList.remove("text-danger", "fw-bolder");
  }
  if (winnings > 0) {
    resultLabel.innerText = `You bet ${currencyFormatter.format(
      bet
    )} and won ${currencyFormatter.format(winnings)}!`;
  } else {
    resultLabel.innerText = `Sorry you lost ${currencyFormatter.format(
      bet
    )}.  Better luck next time.`;
  }
};

const reloadPlayersMoney = () => {
  const moneyLabel = document.querySelector("#money-label");
  const playersMoney = 100.0;
  moneyLabel.textContent = `Your Money:  ${currencyFormatter.format(
    playersMoney
  )}`;
};

const adjustPlayersMoney = (bet, winnings) => {
  const moneyLabel = document.querySelector("#money-label");
  let playersMoney = getPlayersMoney();
  playersMoney -= bet;
  playersMoney += winnings;
  moneyLabel.textContent = `Your Money:  ${currencyFormatter.format(
    playersMoney
  )}`;
};

const pullButton = async () => {
  const resultLabel = document.querySelector("#result-label");
  const playersMoney = getPlayersMoney();
  if (playersMoney > 0) {
    const bet = getBet();
    if (validBet(bet, playersMoney, resultLabel)) {
      const winnings = await pullLever(bet);
      displayResult(bet, winnings);
      adjustPlayersMoney(bet, winnings);
    }
  } else {
    resultLabel.innerText = "Game Over.  Refresh the page to play again!";
    resultLabel.classList.add("text-danger", "fw-bolder");
  }
};