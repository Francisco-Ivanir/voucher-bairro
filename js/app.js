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


   if (dados.usado === true || dados.status === "utilizado") {

  resultado.innerHTML = `

  <h3>❌ Voucher já utilizado</h3>

  <p>
  Código:
  ${dados.codigo}
  </p>

  <p>
  Este voucher não pode ser utilizado novamente.
  </p>

  `;

} else {

  resultado.innerHTML = `

  <h3>✅ Voucher disponível</h3>

  <p>
  Benefício:
  ${dados.beneficio}
  </p>

  <p>
  Código:
  ${dados.codigo}
  </p>

  <p>
  Status: ativo
  </p>

  `;

}

  });


});
