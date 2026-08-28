import { app } from "../config/firebase-config.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const db = getFirestore(app);


async function carregarVouchers(){

  const consulta = await getDocs(collection(db, "vouchers"));

  consulta.forEach((doc) => {

    console.log("Voucher encontrado:", doc.id, doc.data());

  });

}


carregarVouchers();
