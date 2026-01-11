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

// PDF Download
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

downloadPdfBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const userData = JSON.parse(localStorage.getItem(currentUser));
    if(!userData || userData.length === 0) return alert("No data to export!");

    let y = 10;
    doc.setFontSize(16);
    doc.text("Trip Up Cumilla - Guest List", 10, y);
    y += 10;

    userData.forEach((data, index) => {
        doc.setFontSize(12);
        doc.text(`Event: ${data.eventName}`, 10, y); y += 6;
        doc.text(`Host: ${data.hostName}`, 10, y); y += 6;
        doc.text(`Guest: ${data.guestName}`, 10, y); y += 6;
        doc.text(`Mobile: ${data.guestMobile}`, 10, y); y += 6;
        doc.text(`Seat: ${data.seatNumber}`, 10, y); y += 6;
        doc.text(`Amount Paid: ${data.amountPaid}`, 10, y); y += 8;
        if(y > 270){ doc.addPage(); y = 10; }
    });

    doc.save("TripUpCumilla_GuestList.pdf");
});

// Monthly / Yearly Statement
function generateStatement(month=null, year=null){
    const userData = JSON.parse(localStorage.getItem(currentUser));
    if(!userData) return [];

    // Filter by month & year if provided
    let filtered = userData;
    if(month !== null || year !== null){
        filtered = userData.filter(data => {
            const eventDate = new Date(data.eventDate || new Date()); // যদি eventDate যুক্ত করা থাকে
            return (month === null || eventDate.getMonth()+1 === month) &&
                   (year === null || eventDate.getFullYear() === year);
        });
    }

    let totalIncome = filtered.reduce((sum,d)=>sum+d.amountPaid,0);
    alert(`Total Income: ${totalIncome}\nTotal Events: ${filtered.length}`);
    return filtered;
}
