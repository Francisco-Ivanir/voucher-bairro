import { app } from "../config/firebase-config.js";

import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  updateDoc
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

     const hoje = new Date();

const partes =
  dados.dataValidade.split("/");

const validade = new Date(
  partes[2],
  partes[1] - 1,
  partes[0]
);

const vencido = hoje > validade;
     
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
Data de criação: ${dados.dataCriacao}
</p>

<p>
Válido até: ${dados.dataValidade}
</p>

<p>
Status:
${vencido ? "❌ Voucher vencido" : "✅ Voucher dentro da validade"}
</p>

 ${vencido ? "" : `
<button id="btnUtilizar">
Utilizar Voucher
</button>
`}

  `;


 if (!vencido) {

  const btnUtilizar =
    document.getElementById("btnUtilizar");


  btnUtilizar.addEventListener("click", async () => {
    
    btnUtilizar.disabled = true;

    btnUtilizar.textContent = "Utilizando...";


    try {

      const documento = doc.ref;

      await updateDoc(documento, {

        usado: true,
        status: "utilizado"

      });


      resultado.innerHTML = `

      <h3>✅ Voucher utilizado</h3>

      <p>
      Benefício:
      ${dados.beneficio}
      </p>

      <p>
      Código:
      ${dados.codigo}
      </p>

      <p>
      Este voucher não pode ser utilizado novamente.
      </p>

      `;


       } catch (erro) { 

      console.error("Erro ao utilizar voucher:", erro); 

      btnUtilizar.disabled = false; 

      btnUtilizar.textContent = "Utilizar Voucher"; 

      resultado.innerHTML += ` 

      <p> 
      ❌ Não foi possível utilizar o voucher. 
      </p> 

      `; 

    } 

  }); 

  }

  });

});
