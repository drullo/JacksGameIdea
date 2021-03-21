//#region Global variables
const imageList = []; // This will contain our list of images from the 'images' folder.  We will fill it by calling the populateList() function.
let randomizedList; // This will be the randomized version of the image list.
const mainImage = document.getElementById('main-image'); // Reference to the main <img> tag
const maxSeconds = 5; // Maximum number of seconds that we will give the user to make a selection
const numOfChoices = 3; // So we know how many <img> tags to handle
let timeoutHandle; // Will be used to clear the timeout
//#endregion

//#region Utility Functions
// This is a utility function that will randomize our list of images
function shuffleArray(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Populate the list of images alphabetically.  A second list will be created later that is a randomized version of this list.
function populateList() {
    // Since JavaScript doesn't have access to the local filesystem, we are going to hard-code the image listing (sort of).
    // The code assumes that the images are named using sequential numbers in the format of [Number].jpg, beginning with the number 0
    const numOfImages = 11; // The total number of images in the folder

    // Create a loop to grap each image file and put it into the imageList array
    for (let index = 0; index < numOfImages; index++) {
        const fileName = `./images/${index}.jpg`;
        imageList.push(fileName); // Add it to the array
    }
}

function displayChoices() {
    const choiceList = [randomizedList[0]]; // Create a list of choices, the first choice will of course be the main image (the correct choice)

    // Create a loop to grab [X] number of choices (numOfChoices - 1) to add to the list
    for (let index = 1; index < numOfChoices; index++) {
        choiceList.push(randomizedList[index]); // Add this choice to the list
    }

    // If we don't randomize this choice list, the correct choice would always be the first image displayed
    const randomizedChoices = shuffleArray(choiceList);

    // Create a loop to build the 'src' value for image choice image
    for (let index = 0; index < numOfChoices; index++) {
        const imageNum = index + 1;
        const img = document.getElementById(`choice${imageNum}`);
        img.src = randomizedChoices[index];
        img.style.opacity = '1'; // This is default opacity.  Need to set it back to 1 after the incorrect choices have been faded out.
    }
}

function fadeIncorrectChoices() {
    // Create a loop to fade out the incorrect choices
    for (let index = 0; index < numOfChoices; index++) {
        const imageNum = index + 1;
        const img = document.getElementById(`choice${imageNum}`);
        const correctImage = mainImage.src === img.src;
        if (!correctImage) {
            img.style.opacity = '.25';
        }
    }
}

function disableTryAgain() {
    const tryAgain = document.getElementById('try-again');
    const choiceResult = document.getElementById('choice-result');
    choiceResult.innerText = null;
    tryAgain.style.display = 'none';
}

function enableTryAgain() {
    const tryAgain = document.getElementById('try-again');
    tryAgain.style.display = 'block';
}
//#endregion

//#region Events
function choiceSelected(choiceId) {
    const choiceImage = document.getElementById(choiceId);
    const correctChoice = mainImage.src === choiceImage.src;
    const choiceResult = document.getElementById('choice-result');

    choiceResult.innerText = correctChoice ? 'You got it!' : 'Nope';

    clearTimeout(timeoutHandle); // Stop the timeout timer

    enableTryAgain(); // Allow the user to try again

    // If the user chose the wrong answer, show them the correct one by fading out the wrong ones
    if (!correctChoice) {
        fadeIncorrectChoices();
    }
}

function timerFunction() {
    const choiceResult = document.getElementById('choice-result');
    choiceResult.innerText = 'Times up!';

    fadeIncorrectChoices();

    enableTryAgain(); // Allow the user to try again
}
//#endregion

//#region Main function
// Technically, this is also an event because the 'try-again' link calls it when it is clicked
function main() {
    populateList();
    randomizedList = shuffleArray(imageList);

    // Display the main image
    mainImage.src = randomizedList[0];

    displayChoices();

    disableTryAgain(); // Hide the 'Try Again' link until later

    timeoutHandle = setTimeout(timerFunction, maxSeconds * 1000);
}
//#endregion

// Kick off the main function, which calls everything else
main();