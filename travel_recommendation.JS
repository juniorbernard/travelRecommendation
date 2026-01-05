const searchBar = document.getElementById("searchBar");
const resultsDropdown = document.querySelector(".results-dropdown");
resultsDropdown.innerHTML = '<div class="results-header">Results</div>';
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
async function fetchData() {
  const res = await fetch("./travel_recommendation_api.json");
  const db = await res.json();

  const items = [];

  // contries -> cites (ajouter le pasy pour o=contexte)
  (db.countries || []).forEach((country) => {
    (country.cities || []).forEach((city) => {
      items.push({
        type: "city",
        id: city.name.replace(/\s+/g, "-").toLowerCase(),
        country: country.name,
        name: city.name,
        imageUrl: city.imageUrl || "",
        description: city.description || "",
      });
    });
  });
  // temples
  (db.temples || []).forEach((temple) => {
    items.push({
      type: "temple",
      id: temple.id,
      name: temple.name,
      imageUrl: temple.imageUrl || "",
      description: temple.description || "",
    });
  });
  // beaches
  (db.beaches || []).forEach((beach) => {
    items.push({
      type: "beach",
      id: beach.id,
      name: beach.name,
      imageUrl: beach.imageUrl || "",
      description: beach.description || "",
    });
  });

  // renvoyer le tableau
  return items;
}
// normaliser en lowercase
function normalize(str) {
  return (str || "").toLowerCase().trim();
}
// searchItems function
function searchItems(query, items) {
  const q = normalize(query);
  if (!q) return [];
  return items.filter(
    (item) =>
      normalize(item.name).includes(q) ||
      normalize(item.country || "").includes(q) ||
      normalize(item.description).includes(q)
  );
}

// displayItems function
function displayItems(items) {
  if (items.length === 0) {
    resultsDropdown.innerHTML =
      '<div class="result-item">No results found</div>';
    return;
  }
  resultsDropdown.innerHTML += items
    .map(
      (item) =>
        `<a href="#${item.id}">
            <div class="result-item">
                <img src="${item.imageUrl}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                </div>
            </div>
        </a>`
    )
    .join("");
}

// searchBar.addEventListener("input", async (event) => {
//   const query = event.target.value;
//   const items = await fetchData();
//   const filteredItems = searchItems(query, items);
//   displayItems(filteredItems);
// });

searchBtn.addEventListener("click", async () => {
  const query = searchBar.value;
  const items = await fetchData();
  const filteredItems = searchItems(query, items);
  displayItems(filteredItems);
});

clearBtn.addEventListener("click", () => {
  searchBar.value = "";
  resultsDropdown.innerHTML = "";
});

// formulaire de contact
function sendMessage() {
  const nom = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
  var formSpace = document.getElementsByClassName("contact-form-box")[0];

  if (!nom || !email || !message) {
    return alert("Veuillez remplir tous les champs");
  }

  formSpace.innerHTML = "";

  var addedDiv = document.createElement("div");
  addedDiv.classList.add("team-card");
  addedDiv.innerHTML = `
                    <div class="card-header">
                        <div class="memner-info">
                            <h3>Merci ${nom}</h3>
                            <p>Votre message a été envoyé avec succès.</p>
                        </div>
                    </div>
                
                `;
  formSpace.appendChild(addedDiv);
}

// reserve show message ici
function showMessage() {
  var btnBook = document.getElementsByClassName("btn-book")[0];
  // btnBook.innerHTML = "Merci pour votre réservation ! Nous vous contacterons bientôt.";
  var container = document.getElementsByClassName("hero-content")[0];
  var bookingText = document.getElementsByClassName("booking-text")[0];
  bookingText.style.display = "none";
  btnBook.style.display = "none";
  var addedDiv = document.createElement("div");
  addedDiv.classList.add("team-card");
  addedDiv.innerHTML = `
                    <div class="card-header">
                        <div class="memner-info">
                            <h3>Merci pour votre réservation !</h3>
                            <p>Nous vous contacterons bientôt.</p>
                        </div>
                    </div>
                    <button class="role-btn" onClick="window.location.reload()">OK</button>
                
                `;
  container.appendChild(addedDiv);
}
