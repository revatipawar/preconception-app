let foods = {};
let rda = {};
let userType = "mom";
let selectedFoods = [];

/* ---------- LOAD DATA ---------- */
async function loadData() {
  foods = await fetch("foods.json").then(r => r.json());
  rda = await fetch("rda.json").then(r => r.json());
  renderFoods();
  loadProfile();
}

/* ---------- PROFILE ---------- */
function saveProfile() {
  const profile = {
    age: age.value,
    height: height.value,
    weight: weight.value,
    diet: diet.value,
    activity: activity.value,
    supplements: {
      dha: supp_dha.checked,
      folate: supp_folate.checked,
      vitd: supp_vitd.checked,
      iron: supp_iron.checked,
      coq10: supp_coq10.checked
    }
  };
  localStorage.setItem("profile", JSON.stringify(profile));
  alert("Profile saved ✅");
}

function loadProfile() {
  const saved = localStorage.getItem("profile");
  if (!saved) return;

  const p = JSON.parse(saved);
  age.value = p.age;
  height.value = p.height;
  weight.value = p.weight;
  diet.value = p.diet;
  activity.value = p.activity;

  supp_dha.checked = p.supplements.dha;
  supp_folate.checked = p.supplements.folate;
  supp_vitd.checked = p.supplements.vitd;
  supp_iron.checked = p.supplements.iron;
  supp_coq10.checked = p.supplements.coq10;
}

/* ---------- USER TYPE ---------- */
momBtn.onclick = () => switchUser("mom");
dadBtn.onclick = () => switchUser("dad");

function switchUser(type) {
  userType = type;
  momBtn.classList.toggle("active", type === "mom");
  dadBtn.classList.toggle("active", type === "dad");
  calculate();
}

/* ---------- FOOD ---------- */
function renderFoods() {
  const box = document.getElementById("foodSelection");
  box.innerHTML = "<h2>🍽 Foods eaten today</h2>";

  Object.keys(foods).forEach(f => {
    box.innerHTML += `
      <label>
        <input type="checkbox" onchange="toggleFood('${f}')">
        ${f.replace(/_/g, " ")} (${foods[f].portion})
      </label>
    `;
  });
}

function toggleFood(food) {
  selectedFoods.includes(food)
    ? selectedFoods = selectedFoods.filter(f => f !== food)
    : selectedFoods.push(food);
  calculate();
}

/* ---------- CALCULATION ---------- */
function calculate() {
  let totals = {};
  selectedFoods.forEach(f => {
    for (let n in foods[f]) {
      if (n !== "portion") {
        totals[n] = (totals[n] || 0) + foods[f][n];
      }
    }
  });
  renderResults(totals);
}

function renderResults(totals) {
  const box = document.getElementById("results");
  box.innerHTML = "<h2>📊 Daily Nutrition</h2>";

  Object.keys(rda[userType]).forEach(n => {
    const val = totals[n] || 0;
    const req = rda[userType][n];
    const pct = Math.round((val / req) * 100);

    const color = pct >= 80 ? "green" : pct >= 40 ? "orange" : "red";

    box.innerHTML += `
      <div>
        <strong>${n.toUpperCase()}</strong>:
        ${val.toFixed(1)} / ${req}
        <span style="color:${color}">(${pct}%)</span>
      </div>
    `;
  });
}

loadData();
