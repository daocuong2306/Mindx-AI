import { products } from "./data.js";
import {
  getDoc,
  doc,
  setDoc,
  updateDoc,
  increment,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db, auth } from "./firebase.js";

export const addToCart = async (productId, quantity = 1) => {
  const docRef = doc(db, `cart-${auth.currentUser.uid}`, `${productId}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, {
      quantity: increment(quantity),
    });
  } else {
    await setDoc(docRef, {
      ...products.find((item) => item.id === productId),
      quantity: quantity,
    });
  }

  alert("Added to cart successfully");
};
