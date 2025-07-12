const totalCards = 8;
const cartItems = {};
let cartCount = 0;

function updateTotal() {
  let grandTotal = 0;
  cartCount = 0;
  const cartList = document.getElementById("cartItems");
  cartList.innerHTML = "";

  for (let i = 1; i <= totalCards; i++) {
    const price = Number(document.getElementById(`price${i}`).dataset.price);
    const count = Number(document.getElementById(`count${i}`).textContent);
    const itemTotal = price * count;


    document.getElementById(`total${i}`).textContent = `PKR ${itemTotal}`;
    grandTotal += itemTotal;

    if (count > 0) {
      
      const itemTitle = document.querySelector(`#price${i}`).closest(".card").querySelector("h1").textContent;

      cartItems[i] = { title: itemTitle, count, price };
      cartCount += count;

      const li = document.createElement("li");
      li.className = "text-sm flex justify-between";
      li.innerHTML = `<span>${itemTitle} x${count}</span><span>PKR ${itemTotal}</span>`;
      cartList.appendChild(li);
    } else {
      delete cartItems[i];
    }
  }

  document.getElementById("grandTotal").textContent = `PKR ${grandTotal}`;
  document.getElementById("cartGrandTotal").textContent = `PKR ${grandTotal}`;
  document.getElementById("cartCount").textContent = cartCount;
}

function updateStatusMessage(statuselm, count) {
  if (count > 5) {
    statuselm.classList.add("text-green-600");
    statuselm.classList.remove("text-red-600");
    statuselm.textContent = "✅ Enough";
  } else {
    statuselm.classList.add("text-red-600");
    statuselm.classList.remove("text-green-600");
    statuselm.textContent = "❌ Not enough";
  }
}

// inc or dec buttons
for (let i = 1; i <= totalCards; i++) {
  const IncreaseButton = document.getElementById(`increase${i}`);
  const DecreaseButton = document.getElementById(`decrease${i}`);
  const counts = document.getElementById(`count${i}`);
  const statusText = document.getElementById(`msg${i}`);

  IncreaseButton.addEventListener("click", () => {
    let count = parseInt(counts.textContent);
    count++;
    counts.textContent = count;
    updateTotal();
    updateStatusMessage(statusText, count);
  });

  DecreaseButton.addEventListener("click", () => {
    let count = parseInt(counts.textContent);
    if (count > 0) {
      count--;
    }
    counts.textContent = count;
    updateTotal();
    updateStatusMessage(statusText, count);
  });
}
document.getElementById("cartBtn").addEventListener("click", () => {
  document.getElementById("cartDropdown").classList.toggle("hidden");
});


// Clear button
const clearButton = document.getElementById("clearAll");
clearButton.addEventListener("click", () => {
  for (let i = 1; i <= totalCards; i++) {
    document.getElementById(`count${i}`).textContent = "0";
    document.getElementById(`total${i}`).textContent = "PKR 0";
    const statuselm = document.getElementById(`msg${i}`);
    if (statuselm) {
      updateStatusMessage(statuselm, 0);
    }
  }

  cartCount = 0;
  Object.keys(cartItems).forEach(k => delete cartItems[k]);
  document.getElementById("cartItems").innerHTML = "";
  document.getElementById("grandTotal").textContent = "PKR 0";
  document.getElementById("cartGrandTotal").textContent = "PKR 0";
  document.getElementById("cartCount").textContent = "0";
});

//  forms
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const closeButtons = document.querySelectorAll(".close");

function showForm(form) {
  form.classList.remove("hidden");
}

function hideForm(form) {
  form.classList.add("hidden");
}

loginBtn.onclick = () => {
  hideForm(signupForm);
  showForm(loginForm);
};

signupBtn.onclick = () => {
  hideForm(loginForm);
  showForm(signupForm);
};

closeButtons.forEach(btn =>
  btn.addEventListener("click", () => {
    loginForm.reset();
    signupForm.reset();
    hideForm(loginForm);
    hideForm(signupForm);
  })
);

// Signup form logic
signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("signupPassword").value;

  const user = { fullname, email, password };
  let users = JSON.parse(localStorage.getItem("users")) || [];

  const emailExists = users.some(u => u.email === email);
  if (emailExists) {
    alert("This email is already registered. Please login instead.");
    return;
  }

  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Signup successful! You can now login.");
  signupForm.reset();
  signupForm.classList.add("hidden");
});

// Login form logic
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const enteredEmail = document.getElementById("loginUsername").value;
  const enteredPassword = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const matchedUser = users.find(
    user => user.email === enteredEmail && user.password === enteredPassword
  );

  if (matchedUser) {
    alert(`Login successful! Welcome, ${matchedUser.fullname}`);
    loginForm.reset();
    loginForm.classList.add("hidden");
  } else {
    alert("Invalid email or password. Try again! 🙃");
  }
});

// Click close forms
document.querySelectorAll(".bg-gray-300").forEach(btn => {
  btn.addEventListener("click", () => {
    hideForm(loginForm);
    hideForm(signupForm);
  });
});



