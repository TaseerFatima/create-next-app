// ======= Cart & Total Logic =======
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
      const itemTitle = document
        .querySelector(`#price${i}`)
        .closest(".card")
        .querySelector("h1").textContent;

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

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  localStorage.setItem("cartCount", cartCount);
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
  const incBtn = document.getElementById(`increase${i}`);
  const decBtn = document.getElementById(`decrease${i}`);
  const countElm = document.getElementById(`count${i}`);
  const statusTxt = document.getElementById(`msg${i}`);

  incBtn.addEventListener("click", () => {
    if (!localStorage.getItem("currentUser")) {
      alert("Please login to add items to cart.");
      return;
    }
    let count = parseInt(countElm.textContent, 10);
    count++;
    countElm.textContent = count;
    updateTotal();
    updateStatusMessage(statusTxt, count);
  });

  decBtn.addEventListener("click", () => {
    let count = parseInt(countElm.textContent, 10);
    if (count > 0) count--;
    countElm.textContent = count;
    updateTotal();
    updateStatusMessage(statusTxt, count);
  });
}

document.getElementById("cartBtn").addEventListener("click", () => {
  document.getElementById("cartDropdown").classList.toggle("hidden");
});

// Clear cart button
const clearButton = document.getElementById("clearAll");
clearButton.addEventListener("click", () => {
  for (let i = 1; i <= totalCards; i++) {
    document.getElementById(`count${i}`).textContent = "0";
    document.getElementById(`total${i}`).textContent = "PKR 0";
    const statuselm = document.getElementById(`msg${i}`);
    if (statuselm) updateStatusMessage(statuselm, 0);
  }

  cartCount = 0;
  for (const k in cartItems) delete cartItems[k];
  document.getElementById("cartItems").innerHTML = "";
  document.getElementById("grandTotal").textContent = "PKR 0";
  document.getElementById("cartGrandTotal").textContent = "PKR 0";
  document.getElementById("cartCount").textContent = "0";

  localStorage.removeItem("cartItems");
  localStorage.removeItem("cartCount");
});

// on page load
window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("cartItems") || "{}");
  const count = Number(localStorage.getItem("cartCount") || 0);

  Object.entries(saved).forEach(([id, item]) => {
    const cntElm = document.getElementById(`count${id}`);
    const statElm = document.getElementById(`msg${id}`);
    if (cntElm) {
      cntElm.textContent = item.count;
      if (statElm) updateStatusMessage(statElm, item.count);
    }
  });

  cartCount = count;
  updateTotal();
});

// Auth Forms 
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const logoutBtn = document.getElementById("logoutBtn");
const closeButtons = document.querySelectorAll(".close");
const profileicon = document.getElementById("profileIcon");
const profileDropdown = document.getElementById("profileDropdown");
const userFullName = document.getElementById("userFullName");
const useremail = document.getElementById("useremail");
const profile = document.getElementById("profile");

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
closeButtons.forEach(btn => btn.addEventListener("click", () => {
  loginForm.reset();
  signupForm.reset();
  hideForm(loginForm);
  hideForm(signupForm);
}));

// Signup logic
signupForm.addEventListener("submit", e => {
  e.preventDefault();
  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("signupemail").value;
  const password = document.getElementById("signupPassword").value;
  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some(u => u.email === email)) {
    alert("This email is already registered. Please login instead.");
    return;
  }

  users.push({ fullname, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful! You can now login.");
  signupForm.reset();
  hideForm(signupForm);
});

// Login logic
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const enteredEmail = document.getElementById("email").value;
  const enteredPassword = document.getElementById("loginPassword").value;
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const matchedUser = users.find(u => u.email === enteredEmail && u.password === enteredPassword);

  if (matchedUser) {
    localStorage.setItem("currentUser", JSON.stringify(matchedUser));
    alert(`Login successful! Welcome, ${matchedUser.fullname}`);
    hideForm(loginForm);
  } else {
    localStorage.removeItem("currentUser");
    alert("Invalid email or password. Try again! 🙃");
  }

  updateAuthUI();
});

// Close forms when background clicked
document.querySelectorAll(".bg-gray-300").forEach(btn =>
  btn.addEventListener("click", () => {
    hideForm(loginForm);
    hideForm(signupForm);
  })
);

// Logout logic
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  alert("You have been logged out.");
  updateAuthUI();
});

// Profile dropdown
profileicon.addEventListener("click", () => {
  profileDropdown.classList.toggle("hidden");
});
document.addEventListener("click", e => {
  if (!profileicon.contains(e.target) && !profileDropdown.contains(e.target)) {
    profileDropdown.classList.add("hidden");
  }
});

// Update UI based on auth state
function updateAuthUI() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isLoggedIn = !!currentUser;

  loginBtn.classList.toggle("hidden", isLoggedIn);
  signupBtn.classList.toggle("hidden", isLoggedIn);
  logoutBtn.classList.toggle("hidden", !isLoggedIn);
  if (profileicon) profileicon.classList.toggle("hidden", !isLoggedIn);
  if (!isLoggedIn) {
    profileDropdown.classList.add("hidden");
  }

  if (isLoggedIn) {
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.fullname)}&background=0D8ABC&color=fff`;
    if (profileicon) profileicon.src = avatarUrl;
    if (userFullName) userFullName.textContent = currentUser.fullname;
    if (useremail) useremail.textContent = currentUser.email;
    if (profile) profile.src = avatarUrl;
  }
}

// Initial UI update
updateAuthUI();
