let foodsData = {};
let rdaData = {};
let currentUser = "mom";
let selectedFoods = [];

// Load JSON files
async function loadData() {
  foodsData = await fetch("foods.json").then(res => res.json());
  rdaData = await fetch("rda.json").then(res => res.json());
  renderFoodSelection();
}

function setUser(user) {
  currentUser = user;
  selectedFoods = [];
  renderFoodSelection();
  renderResults({});
}

// Render food checkboxes
function renderFoodSelection() {
  const container = document.getElementById("foodSelection");
  container.innerHTML = "<h2>Select foods eaten today</h2>";

  Object.keys(foodsData).forEach(food => {
    container.innerHTML += `
      <label style="display:block;margin-bottom:8px;">
        <input type="checkbox" value="${food}" onchange="toggleFood(this)">
        ${food.replace("_", " ")} (${foodsData[food].portion})
      </label>
    `;
  });
}

// Handle food selection
function toggleFood(checkbox) {
  if (checkbox.checked) {
    selectedFoods.push(checkbox.value);
  } else {
    selectedFoods = selectedFoods.filter(f => f !== checkbox.value);
  }
  calculateNutrition();
}

// Calculate totals
function calculateNutrition() {
  let totals = {};

  selectedFoods.forEach(food => {
    const data = foodsData[food];
    for (let nutrient in data) {
      if (nutrient !== "portion") {
        totals[nutrient] = (totals[nutrient] || 0) + data[nutrient];
      }
    }
  });

  renderResults(totals);
}

// Compare with RDA and display
function renderResults(totals) {
  const container = document.getElementById("results");
  const rda = rdaData[currentUser];

  container.innerHTML = "<h2>Daily Nutrition Status</h2>";

  Object.keys(rda).forEach(nutrient => {
    const consumed = totals[nutrient] || 0;
    const required = rda[nutrient];
    const percent = Math.min(Math.round((consumed / required) * 100), 100);

    let statusColor = "red";
    if (percent >= 80) statusColor = "green";
    else if (percent >= 40) statusColor = "orange";

    container.innerHTML += `
      <div style="margin-bottom:8px;">
        <strong>${nutrient.toUpperCase()}</strong>:
        ${consumed.toFixed(1)} / ${required}
        <span style="color:${statusColor};font-weight:bold;">
          (${percent}%)
        </span>
      </div>
    `;
  });
}

// User toggle buttons
document.getElementById("momBtn").onclick = () => {
  setUser("mom");
  document.getElementById("momBtn").classList.add("active");
  document.getElementById("dadBtn").classList.remove("active");
};

document.getElementById("dadBtn").onclick = () => {
  setUser("dad");
  document.getElementById("dadBtn").classList.add("active");
  document.getElementById("momBtn").classList.remove("active");
};

// Init
loadData();
