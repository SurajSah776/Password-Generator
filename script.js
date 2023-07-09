// Fetching the Elements
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");

const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

//String of symbols 
const symbols = '~`!@#$%^&*()_-+={[}]:;"<,>.?/'


// Initial Values
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// Setting strength color to gray
setIndicator("gray");

// Function to handle the slider (Set Password Length)
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    // Handle the slider background-color
    const min = inputSlider.min;
    const max = inputSlider.max;

    // Formula to calculate the background size of the slider
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}


// Strength Indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;

    // Shadow
    indicator.style.boxShadow = `0px 0px 8px 1px ${color}`;
}


// Functions to generate Random passwords (Uppercase, Lowercase, Numbers and Symbols)

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomNumber() {
    return getRandomInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 122));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 90));
}

function generateSymbols() {
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}


// Function to calculate the Strength of password and set the color of the strength indicator
function calculateStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbols = false;

    if (uppercaseCheck.checked)
        hasUpper = true;


    if (lowercaseCheck.checked)
        hasLower = true;


    if (numbersCheck.checked)
        hasNumber = true;


    if (symbolsCheck.checked)
        hasSymbols = true;



    if ((hasUpper && hasLower && (hasNumber || hasSymbols) && passwordLength >= 8) || ((hasUpper || hasLower) && hasNumber && hasSymbols && passwordLength >= 12) || (hasNumber && hasSymbols && passwordLength >= 15)) {
        setIndicator("#0f0");
    }

    else if (
        ((hasLower || hasUpper) && (hasNumber || hasSymbols) && passwordLength >= 6) || (hasNumber && hasSymbols && passwordLength >= 8)
    ) {
        setIndicator("#ff0");
    }

    else {
        setIndicator("#f00");
    }
}



// Function for copy content

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }

    // To make "copy" span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}


// Shuffling the generated password (Algorithm- Fisher Yates Method)
// Fisher Yates Method:- can be applied on an Array and be Shuffled

function shufflePassword(array) {
    // Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


//----------------------------------------------------------- 
// Main Logic

// Function to handle check box change
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    })

    // Special Condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
};


// Event Listener on Check Boxes
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange)
});

// Event Listener on Slider
inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});


// Event Listener on Copy Button
copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});



// Event Listener on Generate Password Button
generateBtn.addEventListener("click", () => {
    // None of the checkbox are selected
    if (checkCount === 0) {
        return;
    }

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }


    //Before Finding the New Password
    // Remove old Password
    password = "";


    // First Method
    //  Put the compulsary stuffs mentioned by the checkboxes

    // if (uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if (lowercaseCheckcaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if (numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if (symbolsCheck.checked) {
    //     password += generateSymbols();
    // }

    // Function Array (Alternative of above)


    // Optimal Method
    let funcArray = [];
    if (uppercaseCheck.checked)
        funcArray.push(generateUpperCase);

    if (lowercaseCheck.checked)
        funcArray.push(generateLowerCase);

    if (numbersCheck.checked)
        funcArray.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funcArray.push(generateSymbols);


    // Compulsary Addition to the Password 
    for (let i = 0; i < funcArray.length; i++) {
        password += funcArray[i]();
    }

    // Remaining addition
    for (let i = 0; i < passwordLength - funcArray.length; i++) {
        let randIndex = getRandomInteger(0, funcArray.length);
        password += funcArray[randIndex]();
    }

    // Shuffle The Password 
    password = shufflePassword(Array.from(password));

    // Displaying the password in the UI
    passwordDisplay.value = password;

    // Password Strength
    calculateStrength();
});
