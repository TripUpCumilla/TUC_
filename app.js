// DOM Elements
const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("username");
const dashboard = document.getElementById("dashboard");
const addEventBtn = document.getElementById("addEventBtn");
const eventsContainer = document.getElementById("eventsContainer");
const eventFormSection = document.getElementById("eventFormSection");
const eventForm = document.getElementById("eventForm");
const backBtn = document.getElementById("backBtn");

// Local Storage Key
let currentUser = null;

// Login/Register
loginBtn.addEventListener("click", () => {
    const user = usernameInput.value.trim();
    if(user === "") return alert("Enter mobile or Gmail");
    currentUser = user;
    if(!localStorage.getItem(currentUser)) {
        localStorage.setItem(currentUser, JSON.stringify([]));
    }
    loadDashboard();
});

// Load dashboard
function loadDashboard() {
    dashboard.classList.remove("hidden");
    eventFormSection.classList.add("hidden");
    renderEvents();
}

// Add event button
addEventBtn.addEventListener("click", () => {
    dashboard.classList.add("hidden");
    eventFormSection.classList.remove("hidden");
});

// Back button
backBtn.addEventListener("click", () => {
    loadDashboard();
});

// Submit guest info
eventForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const eventName = document.getElementById("eventName").value;
    const hostName = document.getElementById("hostName").value;
    const guestName = document.getElementById("guestName").value;
    const guestMobile = document.getElementById("guestMobile").value;
    const seatNumber = document.getElementById("seatNumber").value;
    const amountPaid = parseFloat(document.getElementById("amountPaid").value);

    const eventData = {
        eventName, hostName, guestName, guestMobile, seatNumber, amountPaid
    };

    let userData = JSON.parse(localStorage.getItem(currentUser));
    userData.push(eventData);
    localStorage.setItem(currentUser, JSON.stringify(userData));

    eventForm.reset();
    loadDashboard();
});

// Render events
function renderEvents() {
    eventsContainer.innerHTML = "";
    const userData = JSON.parse(localStorage.getItem(currentUser));
    userData.forEach((data, index) => {
        const card = document.createElement("div");
        card.classList.add("eventCard");
        card.innerHTML = `
            <h3>${data.eventName}</h3>
            <p><strong>Host:</strong> ${data.hostName}</p>
            <p><strong>Guest:</strong> ${data.guestName}</p>
            <p><strong>Mobile:</strong> ${data.guestMobile}</p>
            <p><strong>Seat:</strong> ${data.seatNumber}</p>
            <p><strong>Amount Paid:</strong> ${data.amountPaid}</p>
        `;
        eventsContainer.appendChild(card);
    });
}
