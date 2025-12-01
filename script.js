let money = 1200;
let stability = 0;
let currentEvent = 0;

const events = [
  {
    title: "Housing Decision",
    description: "Choose your monthly housing:",
    choices: [
      {text: "Cheap Shared Room ($400) – Low comfort", money: -400, stability: +1},
      {text: "Small Apartment ($700) – Moderate comfort", money: -700, stability: +2},
      {text: "Safe Neighborhood ($950) – Expensive", money: -950, stability: +3}
    ]
  },
  {
    title: "Food Choices",
    description: "How will you budget for food?",
    choices: [
      {text: "Basic Groceries ($250)", money: -250, stability: +2},
      {text: "Fast Food & Snacks ($350)", money: -350, stability: -1},
      {text: "Healthy Groceries ($300)", money: -300, stability: +3}
    ]
  },
  {
    title: "Surprise Event!",
    description: "Unexpected life event:",
    choices: [
      {text: "Medical Bill ($200)", money: -200, stability: -2},
      {text: "Car Repair ($150)", money: -150, stability: -1},
      {text: "Ask community program for support ($0)", money: 0, stability: +1}
    ]
  },
  {
    title: "Opportunity",
    description: "A local program offers job-skills training:",
    choices: [
      {text: "Take the course (Free)", money: 0, stability: +3},
      {text: "Skip it and keep working", money: 0, stability: -1}
    ]
  }
];

const totalEvents = events.length;

function playSound(id) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    el.currentTime = 0;
    el.play();
  } catch (e) {
    // ignore autoplay errors
  }
}

function updateStatusBar() {
  const moneyDisplay = document.getElementById("money-display");
  const stabilityDisplay = document.getElementById("stability-display");
  const progressText = document.getElementById("progress-text");
  const progressFill = document.getElementById("progress-fill");

  moneyDisplay.textContent = `$${money}`;
  stabilityDisplay.textContent = stability;

  const completed = Math.min(currentEvent, totalEvents);
  progressText.textContent = `${completed} / ${totalEvents}`;
  const percent = (completed / totalEvents) * 100;
  progressFill.style.width = `${percent}%`;

  // Color money red if negative
  if (money < 0) {
    moneyDisplay.style.color = "#e53e3e";
  } else {
    moneyDisplay.style.color = "#222";
  }
}

function startGame() {
  document.getElementById("intro").classList.add("hidden");
  playSound("click-sound");
  updateStatusBar();
  nextEvent();
}

function nextEvent() {
  if (currentEvent >= events.length) return endGame();

  const ev = events[currentEvent];
  const eventCard = document.getElementById("event");

  document.getElementById("event-title").innerText = ev.title;
  document.getElementById("event-description").innerText = ev.description;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  ev.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerText = choice.text;
    btn.onclick = () => selectChoice(choice, eventCard);
    choicesDiv.appendChild(btn);
  });

  eventCard.classList.remove("hidden");
  eventCard.classList.remove("flash-green", "flash-red");
  eventCard.classList.add("fade-in");

  updateStatusBar();
}

function selectChoice(choice, cardElement) {
  // Determine if choice is generally positive or negative for animation
  const moneyDelta = choice.money;
  const stabilityDelta = choice.stability;

  money += moneyDelta;
  stability += stabilityDelta;
  currentEvent++;

  // Simple “is this probably good?” heuristic: higher stability tends to be good
  if (stabilityDelta >= 0) {
    cardElement.classList.remove("flash-red");
    cardElement.classList.add("flash-green");
    playSound("click-sound");
  } else {
    cardElement.classList.remove("flash-green");
    cardElement.classList.add("flash-red");
    playSound("click-sound");
  }

  updateStatusBar();

  // Move to next event after brief delay so animation is visible
  setTimeout(() => {
    nextEvent();
  }, 450);
}

function endGame() {
  document.getElementById("event").classList.add("hidden");

  let result = `
    You finished the month with <strong>$${money}</strong> and
    a stability score of <strong>${stability}</strong>.<br><br>
  `;

  if (money < 0) {
    result += "You ran out of money — a real challenge that many families face.";
  } else if (stability < 3) {
    result += "You survived, but instability made the month stressful.";
  } else {
    result += "You achieved relative stability — showing how support systems and planning matter!";
  }

  result += `<br><br>This relates to <strong>SDG #1: No Poverty</strong> because the choices people make are shaped by income, access to services, and community support — not just effort or “good” decisions.`;

  // Scoring system
  const score = calculateScore(money, stability);
  const rating = getRating(score);

  const scoreText = `Final Score: <strong>${score}</strong> – Rating: <strong>${rating}</strong>`;

  if (rating === "Gold") {
    playSound("success-sound");
  } else if (rating === "Bronze") {
    playSound("fail-sound");
  } else {
    playSound("click-sound");
  }

  document.getElementById("summary-text").innerHTML = result;
  document.getElementById("score-text").innerHTML = scoreText;
  document.getElementById("summary").classList.remove("hidden");
}

function calculateScore(money, stability) {
  // Simple scoring: stability is weighted more heavily
  // money (clamped) + stability * 100
  const clampedMoney = Math.max(money, -500); // don’t let negative spiral too far
  return Math.round(clampedMoney + stability * 100);
}

function getRating(score) {
  if (score >= 600) return "Gold";
  if (score >= 350) return "Silver";
  if (score >= 150) return "Bronze";
  return "Needs Support";
}

// Initialize HUD on first load
document.addEventListener("DOMContentLoaded", updateStatusBar);

