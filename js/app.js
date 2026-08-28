import { app } from "../config/firebase-config.js";

import {
  getFirestore,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const db = getFirestore(app);


const botao = document.getElementById("btnConsultar");


botao.addEventListener("click", async () => {


  const codigoDigitado =
    document.getElementById("codigoVoucher").value;


  const resultado =
    document.getElementById("resultado");


  resultado.innerHTML = "Consultando...";


  const consulta = query(
    collection(db, "vouchers"),
    where("codigo", "==", codigoDigitado)
  );


  const resposta = await getDocs(consulta);


  if(resposta.empty){

    resultado.innerHTML =
    "❌ Voucher não encontrado.";

    return;

  }


  resposta.forEach((doc) => {


    const dados = doc.data();


    resultado.innerHTML = `

    <h3>🎟️ Voucher encontrado</h3>

    <p>
    Benefício:
    ${dados.beneficio}
    </p>

    <p>
    Status:
    ${dados.status}
    </p>

    <p>
    Código:
    ${dados.codigo}
    </p>

    `;


  });


});
