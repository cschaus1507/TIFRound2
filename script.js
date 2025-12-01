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

function startGame() {
  document.getElementById("intro").classList.add("hidden");
  nextEvent();
}

function nextEvent() {
  if (currentEvent >= events.length) return endGame();

  const ev = events[currentEvent];
  document.getElementById("event-title").innerText = ev.title;
  document.getElementById("event-description").innerText = ev.description;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  ev.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerText = choice.text;
    btn.onclick = () => selectChoice(choice);
    choicesDiv.appendChild(btn);
  });

  document.getElementById("event").classList.remove("hidden");
}

function selectChoice(choice) {
  money += choice.money;
  stability += choice.stability;
  currentEvent++;
  nextEvent();
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
    result += "You achieved stability — showing how support systems matter!";
  }

  result += `<br><br>This relates to <strong>SDG #1: No Poverty</strong> because the choices people make are shaped by access, opportunity, and support systems — not just effort.`;

  document.getElementById("summary-text").innerHTML = result;
  document.getElementById("summary").classList.remove("hidden");
}
