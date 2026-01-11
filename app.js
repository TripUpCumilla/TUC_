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

const downloadStatementBtn = document.getElementById("downloadStatementBtn");

downloadStatementBtn.addEventListener("click", () => {
    const month = document.getElementById("monthSelect").value;
    const year = document.getElementById("yearInput").value;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const userData = JSON.parse(localStorage.getItem(currentUser)) || [];
    
    // Filter events by month/year
    const filtered = userData.filter(data => {
        const eventDate = new Date(data.eventDate || new Date());
        return (!month || eventDate.getMonth()+1 == month) &&
               (!year || eventDate.getFullYear() == year);
    });

    if(filtered.length === 0) return alert("No events for selected month/year!");

    let y = 10;
    doc.setFontSize(16);
    doc.text("Trip Up Cumilla - Statement", 10, y);
    y += 10;
    if(month) { doc.text(`Month: ${month}`, 10, y); y+=6; }
    if(year) { doc.text(`Year: ${year}`, 10, y); y+=6; }

    let totalIncome = 0;
    let totalExpense = 0;
    let totalEvents = 0;

    filtered.forEach((data) => {
        doc.setFontSize(12);
        doc.text(`Event: ${data.eventName}`, 10, y); y+=6;
        doc.text(`Host: ${data.hostName}`, 10, y); y+=6;
        doc.text(`Guest: ${data.guestName}`, 10, y); y+=6;
        doc.text(`Seat: ${data.seatNumber}`, 10, y); y+=6;
        doc.text(`Amount Paid (Income): ${data.amountPaid}`, 10, y); y+=6;
        doc.text(`Expense: ${data.expense || 0}`, 10, y); y+=8;

        totalIncome += data.amountPaid;
        totalExpense += data.expense || 0;
        totalEvents += 1;

        // Page break
        if(y > 270){ doc.addPage(); y = 10; }
    });

    doc.setFontSize(14);
    doc.text(`Total Events: ${totalEvents}`, 10, y); y+=6;
    doc.text(`Total Income: ${totalIncome}`, 10, y); y+=6;
    doc.text(`Total Expense: ${totalExpense}`, 10, y); y+=6;
    doc.text(`Net Profit: ${totalIncome - totalExpense}`, 10, y);

    doc.save(`TripUpCumilla_Statement.pdf`);
});


const downloadStatementBtn = document.getElementById("downloadStatementBtn");

downloadStatementBtn.addEventListener("click", () => {
    const month = document.getElementById("monthSelect").value;
    const year = document.getElementById("yearInput").value;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const userData = JSON.parse(localStorage.getItem(currentUser)) || [];

    const filtered = userData.filter(data => {
        const eventDate = new Date(data.eventDate || new Date());
        return (!month || eventDate.getMonth()+1 == month) &&
               (!year || eventDate.getFullYear() == year);
    });

    if(filtered.length === 0) return alert("No events for selected month/year!");

    let y = 10;
    doc.setFontSize(16);
    doc.text("Trip Up Cumilla - Statement", 105, y, null, null, "center");
    y += 10;
    if(month) { doc.setFontSize(12); doc.text(`Month: ${month}`, 10, y); }
    if(year) { doc.setFontSize(12); doc.text(`Year: ${year}`, 60, y); }
    y += 8;

    let grandIncome = 0;
    let grandExpense = 0;

    // Group events by eventName
    const eventsMap = {};
    filtered.forEach(event => {
        if(!eventsMap[event.eventName]) eventsMap[event.eventName] = [];
        eventsMap[event.eventName].push(event);
    });

    for(const [eventName, guests] of Object.entries(eventsMap)){
        if(y > 260){ doc.addPage(); y=10; }
        doc.setFontSize(14);
        doc.text(`Event: ${eventName}`, 10, y); y+=6;
        doc.setFontSize(12);
        doc.text(`Host: ${guests[0].hostName}`, 10, y); y+=6;

        // Table Header
        doc.setFont(undefined, "bold");
        doc.text("Guest", 10, y);
        doc.text("Seat", 60, y);
        doc.text("Amount Paid", 100, y);
        doc.text("Expense", 150, y);
        doc.setFont(undefined, "normal");
        y+=6;

        let totalIncome = 0;
        let totalExpense = 0;

        guests.forEach(g => {
            if(y>260){ doc.addPage(); y=10; }
            doc.text(g.guestName, 10, y);
            doc.text(g.seatNumber, 60, y);
            doc.text(g.amountPaid.toString(), 100, y);
            doc.text((g.expense || 0).toString(), 150, y);
            y+=6;

            totalIncome += g.amountPaid;
            totalExpense += g.expense || 0;
        });

        // Event Total
        if(y>260){ doc.addPage(); y=10; }
        doc.setFont(undefined, "bold");
        doc.text(`Event Total Income: ${totalIncome}`, 10, y); y+=6;
        doc.text(`Event Total Expense: ${totalExpense}`, 10, y); y+=6;
        doc.text(`Event Net Profit: ${totalIncome - totalExpense}`, 10, y); y+=10;
        doc.setFont(undefined, "normal");

        grandIncome += totalIncome;
        grandExpense += totalExpense;
    }

    // Grand Total
    if(y>260){ doc.addPage(); y=10; }
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Grand Totals", 10, y); y+=6;
    doc.text(`Total Income: ${grandIncome}`, 10, y); y+=6;
    doc.text(`Total Expense: ${grandExpense}`, 10, y); y+=6;
    doc.text(`Net Profit: ${grandIncome - grandExpense}`, 10, y);

    doc.save(`TripUpCumilla_Detailed_Statement.pdf`);
});
