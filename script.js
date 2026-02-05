function showProfile(type) {
  document.getElementById("momProfile").classList.add("hidden");
  document.getElementById("dadProfile").classList.add("hidden");

  document.getElementById(type + "Profile").classList.remove("hidden");
  loadProfile(type);
}

function saveProfile(type) {
  const profile = {
    age: document.getElementById(type + "_age").value,
    height: document.getElementById(type + "_height").value,
    weight: document.getElementById(type + "_weight").value,
    diet: document.getElementById(type + "_diet").value,
    activity: document.getElementById(type + "_activity").value,
    supplements: {
      dha: document.getElementById(type + "_dha")?.checked || false,
      folate: document.getElementById(type + "_folate")?.checked || false,
      iron: document.getElementById(type + "_iron")?.checked || false,
      coq10: document.getElementById(type + "_coq10")?.checked || false,
      vitd: document.getElementById(type + "_vitd")?.checked || false
    }
  };

  localStorage.setItem("profile_" + type, JSON.stringify(profile));
  alert(type.toUpperCase() + " profile saved ✅");
}

function loadProfile(type) {
  const saved = localStorage.getItem("profile_" + type);
  if (!saved) return;

  const p = JSON.parse(saved);

  document.getElementById(type + "_age").value = p.age;
  document.getElementById(type + "_height").value = p.height;
  document.getElementById(type + "_weight").value = p.weight;
  document.getElementById(type + "_diet").value = p.diet;
  document.getElementById(type + "_activity").value = p.activity;

  for (let key in p.supplements) {
    const el = document.getElementById(type + "_" + key);
    if (el) el.checked = p.supplements[key];
  }
}
