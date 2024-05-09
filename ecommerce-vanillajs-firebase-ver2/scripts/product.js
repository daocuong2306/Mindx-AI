import { addToCart } from "./cart-mutations.js";
import { auth } from "./firebase.js";
import { products } from "./data.js";

const productId = new URLSearchParams(new URL(location.href).search).get("id");

const product = products.find((product) => product.id === productId);

(async () => {
  let quantity = 1;

  const handleAddToCart = (productId, doRedirect) => {
    if (!auth.currentUser) {
      alert("Please login to add to cart");
    } else {
      addToCart(productId, quantity);
      if (doRedirect) location.href = "./cart.html";
    }
  };

  if (!product)
    document.querySelector(".main-product").innerHTML = `<h1>404</h1>`;
  else {
    document.querySelector(".product-description").innerText =
      product.description;

    document.querySelector(".main-product").innerHTML = /*html*/ `
    <img src="./assets/products/${product.image}" />
    <div class="product-detail">
      <p>${product.category}</p>
      <h1>${product.name}</h1>
      <div class="product-review">
        <span>in-stock</span>
        <div class="stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-regular fa-star"></i></div>
        <p>(10 reviews)</p>
      </div>

      <p class="short-product-description">${product.description}</p>

      <h6><span>${product.oldPrice}</span> <span>${product.newPrice}</span></h6>

      <p style="margin: 30px 0 15px 0">Quantity</p>
      <div class="add-to-cart-box">
        <button id="minus-btn">
          <i class="fa-solid fa-minus"></i>
        </button> 
        <p id="quantity">${quantity}</p>
        <button id="plus-btn">
          <i class="fa-solid fa-plus"></i>
        </button> 

        <button class="add-to-cart-btn">Add To Cart</button>
      </div>
      <button class="buy-now-btn">Buy Now</button>

      <div class="line-indicator"></div>

      <div class="share">
        <span>Share:</span>
        <i class="fa-brands fa-facebook-f"></i>
        <i class="fa-brands fa-twitter"></i>
        <i class="fa-brands fa-linkedin-in"></i>
        <i class="fa-brands fa-vimeo-v"></i>
      </div>

      <div class="guarantee">
        <p><i class="fa-regular fa-circle-check"></i> 30 days easy returns</p>
        <p><i class="fa-regular fa-circle-check"></i> Order yours before 2.30pm for same day dispatch</p>

        <div>
          <p>Guaranteed safe<br />
          & secure checkout</p>
          <img style="max-width: 236px" src="./assets/payment-option.png" />
        </div>
      </div>
    </div>
  `;

    for (let relatedProduct of products.filter(
      (item) => item.category === product.category && item.id !== product.id
    )) {
      let card = /*html*/ `
    <a href="./product.html?id=${relatedProduct.id}" class="card">
      <div class="image-container">
        <img src="./assets/products/${relatedProduct.image}" /> 
      </div> 
      <div class="container">
        <p>${product.category}</p>
        <h5>${relatedProduct.name}</h5> 
        <div class="stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-regular fa-star"></i></div>
        <h6><span>${relatedProduct.oldPrice}</span> <span>${relatedProduct.newPrice}</span></h6>
      </div>
    </a>
    `;

      document.getElementById("products").innerHTML += card;
    }

    document.querySelector("#minus-btn").addEventListener("click", () => {
      if (quantity > 1)
        document.querySelector("#quantity").innerText = --quantity;
    });
    document.querySelector("#plus-btn").addEventListener("click", () => {
      document.querySelector("#quantity").innerText = ++quantity;
    });
    document.querySelector(".add-to-cart-btn").addEventListener("click", () => {
      handleAddToCart(productId, false);
    });
    document.querySelector(".buy-now-btn").addEventListener("click", () => {
      handleAddToCart(productId, true);
    });
  }
})();
