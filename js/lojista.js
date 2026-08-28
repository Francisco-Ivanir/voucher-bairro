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

  const codigo =
    document.getElementById("codigoVoucher").value.trim();

  const resultado =
    document.getElementById("resultado");


  if (!codigo) {

    resultado.innerHTML =
      "Digite o código do voucher.";

    return;

  }


  resultado.innerHTML =
    "Consultando voucher...";


  try {

    const consulta = query(
      collection(db, "vouchers"),
      where("codigo", "==", codigo)
    );


    const resposta = await getDocs(consulta);


    if (resposta.empty) {

      resultado.innerHTML =
        "❌ Voucher não encontrado.";

      return;

    }


    resposta.forEach((documento) => {

      const dados = documento.data();


      if (dados.usado === true || dados.status === "utilizado") {

        resultado.innerHTML = `

          <h3>❌ Voucher já utilizado</h3>

          <p>
          Código: ${dados.codigo}
          </p>

          <p>
          Este voucher não pode ser utilizado novamente.
          </p>

        `;

        return;

      }


      resultado.innerHTML = `

        <h3>✅ Voucher válido</h3>

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

        <button id="btnBaixar">
        Dar baixa no voucher
        </button>

      `;


      const btnBaixar =
        document.getElementById("btnBaixar");


      btnBaixar.addEventListener("click", async () => {

        btnBaixar.disabled = true;

        btnBaixar.textContent =
          "Processando...";


        try {

          await updateDoc(documento.ref, {

            usado: true,
            status: "utilizado"

          });


          resultado.innerHTML = `

            <h3>✅ Voucher utilizado</h3>

            <p>
            Código: ${dados.codigo}
            </p>

            <p>
            A baixa foi registrada com sucesso.
            </p>

            <p>
            Este voucher não poderá ser utilizado novamente.
            </p>

          `;


        } catch (erro) {

          console.error(
            "Erro ao dar baixa:",
            erro
          );


          btnBaixar.disabled = false;

          btnBaixar.textContent =
            "Dar baixa no voucher";


          resultado.innerHTML += `

            <p>
            ❌ Erro ao registrar a baixa.
            </p>

          `;

        }

      });

    });


  } catch (erro) {

    console.error(
      "Erro ao consultar voucher:",
      erro
    );


    resultado.innerHTML =
      "❌ Ocorreu um erro ao consultar o voucher.";

  }

});
