let names = [];
let currentRotation = 0;
let isSpinning = false;

const nameInput = document.getElementById("nameInput");
const nameList = document.getElementById("nameList");
const winner = document.getElementById("winner");

const addButton = document.getElementById("addButton");
const pickButton = document.getElementById("pickButton");
const clearButton = document.getElementById("clearButton");

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#8BC34A",
    "#E91E63"
];

// Draw the spinning wheel
function drawWheel() {

    const center = 200;
    const radius = 190;

    ctx.clearRect(0, 0, 400, 400);

    if (names.length === 0) {
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#dddddd";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.fillStyle = "#333333";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Add Names!", center, center);
        return;
    }

    const angle = (2 * Math.PI) / names.length;

    names.forEach((name, index) => {

        const start = -Math.PI / 2 + index * angle;
        const end = start + angle;

        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, start, end);
        ctx.closePath();

        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();

        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.save();

        ctx.translate(center, center);
        ctx.rotate(start + angle / 2);

        ctx.fillStyle = "white";
        ctx.font = "bold 15px Arial";
        ctx.textAlign = "right";

        let displayName = name.length > 16
            ? name.substring(0, 14) + "..."
            : name;

        ctx.fillText(displayName, radius - 15, 5);

        ctx.restore();

    });

    // Center circle
    ctx.beginPath();
    ctx.arc(center, center, 25, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Display names
function displayNames() {

    nameList.innerHTML = "";

    names.forEach((name, index) => {

        const li = document.createElement("li");
        li.appendChild(document.createTextNode(name));

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.className = "removeButton";

        removeButton.addEventListener("click", function() {

            if (isSpinning) return;

            names.splice(index, 1);
            winner.textContent = "Your winner will appear here!";

            displayNames();
            drawWheel();

        });

        li.appendChild(removeButton);
        nameList.appendChild(li);

    });
}

// Add names
addButton.addEventListener("click", function() {

    if (isSpinning) return;

    const newNames = nameInput.value
        .split(/[\n,]+/)
        .map(name => name.trim())
        .filter(name => name !== "");

    if (newNames.length === 0) {
        alert("Please enter names first!");
        return;
    }

    names.push(...newNames);

    nameInput.value = "";
    winner.textContent = "Your winner will appear here!";

    displayNames();
    drawWheel();

});

// Spin the wheel
pickButton.addEventListener("click", function() {

    if (isSpinning) return;

    if (names.length === 0) {
        alert("Please add names first!");
        return;
    }

    isSpinning = true;
    pickButton.disabled = true;

    const randomIndex = Math.floor(Math.random() * names.length);
    const angle = (2 * Math.PI) / names.length;

    const targetRotation =
        -(randomIndex + 0.5) * angle;

    const currentNormalized =
        ((currentRotation % (2 * Math.PI)) + 2 * Math.PI)
        % (2 * Math.PI);

    let extraRotation =
        (targetRotation - currentNormalized + 2 * Math.PI)
        % (2 * Math.PI);

    currentRotation += (6 * 2 * Math.PI) + extraRotation;

    canvas.style.transform =
        "rotate(" + currentRotation + "rad)";

    winner.textContent = "Wheel is spinning...";

    setTimeout(function() {

        winner.textContent =
            "🎉 " + names[randomIndex] + " 🎉";

        isSpinning = false;
        pickButton.disabled = false;

    }, 5100);

});

// Clear all names
clearButton.addEventListener("click", function() {

    if (isSpinning) return;

    names = [];

    nameList.innerHTML = "";
    winner.textContent = "Your winner will appear here!";

    drawWheel();

});

// Initial wheel
drawWheel();