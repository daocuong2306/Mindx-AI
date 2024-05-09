import { products } from "./data.js";
import { addToCart } from "./cart-mutations.js";

window.addToCart = addToCart;

for (let product of products) {
  let card = /*html*/ `
  <div onclick="location.href='./product.html?id=${product.id}'" class="card">
    <div class="image-container">
      <img src="./assets/products/${product.image}" /> 
      <div class="card-actions">
        <button onclick="event.stopPropagation();addToCart('${product.id}')" data-tooltip="Add to cart">
          <i class="fa-solid fa-cart-shopping"></i>
        </button>
        <button onclick="event.stopPropagation();location.href='./product.html?id=${product.id}'" data-tooltip="Quick view"><i class="fa-regular fa-eye"></i></button>
      </div>
    </div> 
    <div class="container">
      <p>${product.category}</p>
      <h5>${product.name}</h5> 
      <div class="stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-regular fa-star"></i></div>
      <h6><span>${product.oldPrice}</span> <span>${product.newPrice}</span></h6>
    </div>
  </div>
  `;

  document.getElementById("products").innerHTML += card;
}
