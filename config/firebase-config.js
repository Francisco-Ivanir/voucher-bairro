import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyAdy7i6Lk2q8sFnDOL0nij9iABVJSsrqiw",
  authDomain: "voucher-bairro.firebaseapp.com",
  projectId: "voucher-bairro",
  storageBucket: "voucher-bairro.firebasestorage.app",
  messagingSenderId: "657154974832",
  appId: "1:657154974832:web:58846f0bc552464edb40b5"
};

const app = initializeApp(firebaseConfig);

export { app };
