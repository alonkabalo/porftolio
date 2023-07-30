function login() {
  const obj = {
    userName: document.querySelector("#userName").value,
    password: document.querySelector("#password").value,
  };

  loader(true);

  // Send POST request to login API endpoint
  fetch("https://api.shipap.co.il/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  })
    .then((res) => res.json())

    // Handle server response
    .then((data) => {
      if (data.status == "success") {
        // If login was successful, store user data and show notification
        setUser(data.user);
        snackbar("Account logged in");
      } else {
        alert(data.message);
        loader(false);
      }
    });
}

function loginStatus() {
  loader(true);

  fetch("https://api.shipap.co.il/login", {
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status == "success") {
        setUser(data.user);
        snackbar(" Account Online");
      } else {
        setUser();
      }

      loader(false);
    })
    .catch((err) => {
      console.log(err);
      loader(false);
    });
}

// Function to logout user
function logout() {
  loader(true);

  fetch("https://api.shipap.co.il/logout", {
    credentials: "include",
  }).then(() => {
    setUser();
    snackbar("Account Disconnected");
    loader(false);
  });
}

// Function to fetch and display products
function getProducts() {
  loader(true);

  fetch("https://api.shipap.co.il/products", {
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      document.querySelector(".products").style.display = "block";
      const tbody = document.querySelector(".products tbody");
      tbody.innerHTML = "";

      data.forEach((p, i) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${i + 1}</td>
            <td contenteditable="true" oninput="contentChange(this)" class="name">${
              p.name
            }</td>
            <td contenteditable="true" oninput="contentChange(this)" class="price">${
              p.price
            }</td>
            <td contenteditable="true" oninput="contentChange(this)" class="discount">${
              p.discount
            }</td>
            <td>
                <button class="save" onclick="saveProduct(${
                  p.id
                }, this)">💾</button>
                <button class="remove" onclick="removeProduct(${
                  p.id
                }, this)">❌</button>
            </td>
        `;

        tbody.appendChild(tr);
      });

      loader(false);
    });
}

function contentChange(tdElem) {
  tdElem.closest("tr").querySelector(".save").style.visibility = "visible";
}

// Function to save changes made to a product
function saveProduct(id, btnElem) {
  const tr = btnElem.closest("tr");

  const obj = {
    name: tr.querySelector(".name").innerText,
    price: tr.querySelector(".price").innerText,
    discount: tr.querySelector(".discount").innerText,
  };

  loader(true);

  // Send PUT request to specific product API endpoint
  fetch(`https://api.shipap.co.il/products/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  }).then(() => {
    tr.querySelector(".save").style.visibility = "hidden";
    loader(false);
    snackbar("Saved Successfully  ");
  });
}

function addProduct() {
  const name = document.querySelector("#name");
  const price = document.querySelector("#price");
  const discount = document.querySelector("#discount");

  const obj = {
    name: name.value,
    price: +price.value,
    discount: +discount.value,
  };

  name.value = "";
  price.value = "";
  discount.value = "";

  loader(true);

  fetch("https://api.shipap.co.il/products", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  })
    .then((res) => res.json())
    .then((data) => {
      // On response, refresh the products and show a notification
      getProducts();
      snackbar("Added Successfully");
    });
}

function removeProduct(id, btnElem) {
  if (!confirm(" Delete the selected product ?")) {
    return;
  }

  loader(true);

  // Send DELETE request to specific product API endpoint
  fetch(`https://api.shipap.co.il/products/${id}`, {
    method: "DELETE",
    credentials: "include",
  }).then(() => {
    btnElem.closest("tr").remove();
    const trs = document.querySelectorAll("tbody tr");
    trs.forEach((tr, i) => (tr.querySelector("td").innerHTML = i + 1));
    loader(false);
    snackbar("Deleted Successfully  ");
  });
}

function setUser(user = null) {
  const divLogin = document.querySelector(".login");
  const divRegister = document.querySelector(".register");
  const divUser = document.querySelector(".user");
  const divProduct = document.querySelector(".products");

  divRegister.style.display = "none";

  if (user) {
    // If user is logged in, update UI accordingly
    divLogin.style.display = "none";
    divUser.style.display = "block";
    divUser.querySelector(
      ".userName"
    ).innerHTML = `${user.fullName} Connected!`;
    getProducts();
  } else {
    divLogin.style.display = "flex";
    divUser.style.display = "none";
    divProduct.style.display = "none";
    loader(false);
  }
}

function loader(isShowing = false) {
  const loaderFrame = document.querySelector(".loaderFrame");

  if (isShowing) {
    loaderFrame.style.display = "flex";
  } else {
    loaderFrame.style.display = "none";
  }
}

// Function to display a snackbar notification
function snackbar(message) {
  const elem = document.getElementById("snackbar");
  elem.innerHTML = message;
  elem.classList.add("show");
  setTimeout(() => elem.classList.remove("show"), 3000);
}

// Function to toggle between login and registration forms
function toggleLogin() {
  const divLogin = document.querySelector(".login");
  const divRegister = document.querySelector(".register");

  if (divLogin.style.display == "flex") {
    divLogin.style.display = "none";
    divRegister.style.display = "flex";
  } else {
    divLogin.style.display = "flex";
    divRegister.style.display = "none";
  }
}

function register() {
  // Fetch user inputs for registration
  const obj = {
    userName: document.querySelector("#regUserName").value,
    fullName: document.querySelector("#regFullName").value,
    email: document.querySelector("#regEmail").value,
    password: document.querySelector("#regPassword").value,
  };

  loader(true);

  fetch("https://api.shipap.co.il/signup", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  })
    .then(() => {
      // On successful registration, update user data and show a notification
      setUser();
      snackbar("Account successfully signed up ");
      loader(false);
    })
    .catch((error) => {
      // On unsuccessful registration, show an alert with the error message
      alert(error.message);
      loader(false);
    });
}
