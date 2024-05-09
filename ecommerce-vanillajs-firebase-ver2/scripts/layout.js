import { db, auth } from "./firebase.js";
import {
  collection,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import {
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

window.handleSignOut = () => {
  signOut(auth);
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.querySelector(".icons").innerHTML = /*html*/ `
    <a class="navbar-icon" href="./cart.html">
      <i class="fa-solid fa-cart-shopping"></i>
      <span id="cart-count">0</span>
    </a>
    <div tabindex="0" class="avatar-action">
      <img src="${`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        user.displayName || user.email
      )}`}" />
      <div class="popup">
        <button onclick="handleSignOut()">
          <i class='bx bx-log-out' ></i>
          <span> Logout</span>
        </button>
      </div>
    </div>
    <a id="hamburger-btn" class="navbar-icon" href="#" onclick="document.querySelector('.lower-navbar').classList.add('lower-navbar-visible')">
      <i class="fa-solid fa-bars"></i>
    </a>
    `;

    onSnapshot(collection(db, `cart-${user.uid}`), (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      document.querySelector("#cart-count").innerText = items.length;
    });
  } else {
    document.querySelector(".icons").innerHTML = /*html*/ `
    <a href="./login.html">
      <i class="fa-solid fa-right-to-bracket"></i>
    </a>
    `;
  }
});

document.body.innerHTML += /*html*/ `
  <button class="back-to-top">
  <i class="fa-solid fa-angles-up"></i>
  </button>
`;

window.addEventListener("scroll", () => {
  if (document.documentElement.scrollTop > 0)
    document.querySelector(".back-to-top").classList.add("back-to-top-visible");
  else
    document
      .querySelector(".back-to-top")
      .classList.remove("back-to-top-visible");
});

document
  .querySelector(".back-to-top")
  .addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
