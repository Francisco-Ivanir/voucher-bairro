import { app } from "../config/firebase-config.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const db = getFirestore(app);


async function carregarVouchers(){

  const area = document.getElementById("voucher");

  const consulta = await getDocs(collection(db, "vouchers"));


  consulta.forEach((doc) => {

    const dados = doc.data();


    area.innerHTML = `

    <h2>🎟️ Benefício encontrado</h2>

    <p>
    ${dados.beneficio}
    </p>

    <p>
    Status: ${dados.status}
    </p>

<p>
Código do voucher: ${dados.codigo}
</p>

    `;

  });

}


carregarVouchers();
