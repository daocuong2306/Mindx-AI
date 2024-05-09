import { db, auth } from "./firebase.js";
import { products } from "./data.js";
import {
  collection,
  onSnapshot,
  deleteDoc,
  increment,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import {
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

let extraFee = 0;
let cart;

window.handleSignOut = () => {
  signOut(auth);
};

const displayCart = (cart) => {
  console.log(cart);
  if (cart.length === 0) {
    document.getElementById("cart-container").innerHTML = /* html */ `
    <h4 class="empty-warning">Your cart is empty</h4>
  `;
  } else {
    const subTotal =
      Math.round(
        cart.reduce((acc, product) => {
          acc += Number(product.newPrice.trim().slice(1)) * product.quantity;
          return acc;
        }, 0) * 100
      ) / 100;

    document.getElementById("cart-container").innerHTML = /* html */ `
      <h2>Shopping Cart</h2>
      <p>Home • Shopping Cart</p>
      <div>
        <div style="flex: 1">
          <table>
            <thead>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th></th>
            </thead>
            ${cart
              .map(
                (product) => /*html*/ `
                <tr>
                  <td>
                    <div class="product-cell">
                      <img src="./assets/products/${product.image}" alt="" />
                      <p>${product.name}</p>
                    </div>
                  </td>
                  <td>${product.newPrice}</td>
                  <td>
                    <div class="quantity-cell">
                      <button onclick="removeFromCart('${product.id}')">
                        <i class="fa-solid fa-minus"></i>
                      </button>
                      <span>${product.quantity}</span>
                      <button onclick="addToCart('${product.id}')">
                        <i class="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </td>
                  <td><button onclick="removeFromCart('${product.id}', 'all')" class="remove-from-cart"><i class="fa-solid fa-x"></i> Remove</button></td>
                </tr>
              `
              )
              .join("")}
          </table>

          <div>
            <div class="coupon-code">
              <p>Coupon Code:</p>
              <div>
                <form><input type="text" placeholder="Enter Coupon Code" /><button>Apply</button></form>
                <button onclick="clearCart()" class="clear-cart">Clear Cart</button>
              </div>
            </div>
          </div>
        </div>

        <div class="checkout-wrapper">
          <div
            class="checkout-top"
          >
            <span>Subtotal</span>
            <span id="subtotal">$${subTotal}
            </span>
          </div>
          <div class="checkout-shipping">
            <h4>Shipping</h4>
            <div>
              <input id="flat_rate" type="radio" name="shipping" ${
                extraFee === 20 ? "checked" : ""
              } />
              <label
                for="flat_rate"
                >Flat rate: <span>$20.00</span></label
              >
            </div>
            <div>
              <input id="local_pickup" type="radio" name="shipping" ${
                extraFee === 25 ? "checked" : ""
              } />
              <label
                for="local_pickup"
                >Local pickup: <span> $25.00</span></label
              >
            </div>
            <div>
              <input id="free_shipping" type="radio" name="shipping"  ${
                extraFee === 0 ? "checked" : ""
              } />
              <label
                for="free_shipping"
                >Free shipping</label
              >
            </div>
          </div>
          <div
            class="checkout-total"
          >
            <span>Total</span><span>$${subTotal + extraFee}</span>
          </div>
          <div class="checkout-proceed">
            <a href="" onclick="alert('Purchased successfully');clearCart()"
              >Proceed to Checkout</a
            >
          </div>
        </div>
      </div>
    `;
    document.querySelectorAll("input[type=radio]").forEach((item) => {
      item.addEventListener("change", () => {
        extraFee =
          item.id === "flat_rate" ? 20 : item.id === "local_pickup" ? 25 : 0;
        displayCart(cart);
      });
    });
  }
};

window.addToCart = async (productId) => {
  if (!auth.currentUser) {
    alert("Please login");
    return;
  }

  const docRef = doc(db, `cart-${auth.currentUser.uid}`, `${productId}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    updateDoc(docRef, {
      quantity: increment(1),
    });
  } else {
    setDoc(docRef, {
      ...products.find((item) => item.id === productId),
      quantity: 1,
    });
  }
};

window.removeFromCart = async (productId, argument) => {
  const docRef = doc(db, `cart-${auth.currentUser.uid}`, `${productId}`);
  const docSnap = await getDoc(docRef);

  if (argument === "all" || docSnap.data().quantity === 1) {
    deleteDoc(docRef);
  } else {
    updateDoc(docRef, {
      quantity: increment(-1),
    });
  }
};

window.clearCart = async () => {
  const q = query(collection(db, `cart-${auth.currentUser.uid}`));
  const querySnapshot = await getDocs(q);
  querySnapshot.docs.forEach((doc) => {
    deleteDoc(doc.ref);
  });
};

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "./index.html";
  } else {
    onSnapshot(collection(db, `cart-${auth.currentUser.uid}`), (snapshot) => {
      const products = [];
      snapshot.forEach((doc) => {
        products.push({ ...doc.data(), id: doc.id });
      });
      document.querySelector("#cart-count").innerText = products.length;
      cart = products;
      displayCart(products);
    });
  }
});
