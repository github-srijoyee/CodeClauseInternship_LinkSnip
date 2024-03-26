// Function to select an element by its selector
const selectElement = (selector) => {
    const element = document.querySelector(selector);
    if (element) return element;
    throw new Error(`Cannot find the element ${selector}`);
};

// Selecting necessary elements
const form = selectElement('form');
const input = selectElement('input');
const result = selectElement('.result');
const hamburger = selectElement('.hamburger');
const navMenu = selectElement('.nav-menu');
const wrapper = selectElement(".wrapper");
const generateBtn = selectElement(".input-btn1");
const qrImg = selectElement(".qr-img");

let qrGenerated = false;
let urlShortened = false;

// Event listener for generating QR code
generateBtn.addEventListener("click", async () => {
    let qrValue = input.value;
    if (!qrValue) return;
    generateBtn.innerHTML = "Generating QR...";
    try {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrValue}`;
        await new Promise(resolve => qrImg.addEventListener("load", resolve));
        wrapper.classList.add("active");
        generateBtn.innerHTML = "Generate QR";
        qrGenerated = true;
        clearInputIfNeeded();
    } catch (error) {
        console.error("Error generating QR code:", error);
    }
});

// Event listener for hamburger menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Event listener for form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = input.value;
    if (!url) return;
    try {
        await shortenUrl(url);
        urlShortened = true;
        clearInputIfNeeded();
    } catch (error) {
        console.error("Error shortening URL:", error);
    }
});

// Function to shorten URL
async function shortenUrl(url) {
    try {
        const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        const data = await res.text();

        const newUrl = document.createElement('div');
        newUrl.classList.add('item');
        newUrl.innerHTML = `
            <div class="cardre">
                <p>${data}</p>
                <button class='newUrl-btn'>Copy</button>
            </div>
        `;
        result.prepend(newUrl);

        const copyBtn = newUrl.querySelector('.newUrl-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(data);
            copyBtn.innerHTML="Copied"
        });
    } catch (error) {
        console.error("Error shortening URL:", error);
    }
}

// Function to clear input field if both operations are completed
function clearInputIfNeeded() {
    if (qrGenerated && urlShortened) {
        input.value = "";
        qrGenerated = false;
        urlShortened = false;
    }
}