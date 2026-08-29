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


const botao =
  document.getElementById("btnConsultar");


botao.addEventListener("click", async () => {

  const codigoDigitado =
    document.getElementById("codigoVoucher").value.trim();

  const resultado =
    document.getElementById("resultado");


  resultado.innerHTML =
    "Consultando...";


  const consulta = query(
    collection(db, "vouchers"),
    where("codigo", "==", codigoDigitado)
  );


  const resposta =
    await getDocs(consulta);


  if (resposta.empty) {

    resultado.innerHTML =
      "❌ Voucher não encontrado.";

    return;

  }


  resposta.forEach((documento) => {

    const dados =
      documento.data();


    // VOUCHER JÁ UTILIZADO

    if (
      dados.usado === true ||
      dados.status === "utilizado"
    ) {

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

      return;

    }


    // VERIFICAR VALIDADE

    const hoje =
      new Date();


    const partes =
      dados.dataValidade.split("/");


    const validade =
      new Date(
        partes[2],
        partes[1] - 1,
        partes[0]
      );


    const vencido =
      hoje > validade;


    // VOUCHER VENCIDO

    if (vencido) {

      resultado.innerHTML = `

        <h3>❌ Voucher vencido</h3>

        <p>
        Benefício:
        ${dados.beneficio}
        </p>

        <p>
        Código:
        ${dados.codigo}
        </p>

        <p>
        Data de criação:
        ${dados.dataCriacao}
        </p>

        <p>
        Válido até:
        ${dados.dataValidade}
        </p>

        <p>
        Este voucher não pode ser utilizado.
        </p>

      `;

      return;

    }


    // VOUCHER DISPONÍVEL

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
      Data de criação:
      ${dados.dataCriacao}
      </p>

      <p>
      Válido até:
      ${dados.dataValidade}
      </p>

      <p>
      Status:
      ✅ Voucher dentro da validade
      </p>

      <button id="btnUtilizar">
      Utilizar Voucher
      </button>

    `;


    const btnUtilizar =
      document.getElementById("btnUtilizar");


    btnUtilizar.addEventListener(
      "click",
      async () => {

        const agora = new Date();

const partesValidade =
  dados.dataValidade.split("/");

const dataValidadeAtual =
  new Date(
    partesValidade[2],
    partesValidade[1] - 1,
    partesValidade[0]
  );

if (agora > dataValidadeAtual) {

  resultado.innerHTML = `

    <h3>❌ Voucher vencido</h3>

    <p>
    Código:
    ${dados.codigo}
    </p>

    <p>
    Válido até:
    ${dados.dataValidade}
    </p>

    <p>
    Este voucher não pode ser utilizado.
    </p>

  `;

  return;

}
        
        btnUtilizar.disabled =
          true;


        btnUtilizar.textContent =
          "Utilizando...";


        try {

          await updateDoc(
            documento.ref,
            {
              usado: true,
              status: "utilizado"
            }
          );


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

          console.error(
            "Erro ao utilizar voucher:",
            erro
          );


          btnUtilizar.disabled =
            false;


          btnUtilizar.textContent =
            "Utilizar Voucher";


          resultado.innerHTML += `

            <p>
            ❌ Não foi possível utilizar o voucher.
            </p>

          `;

        }

      }
    );

  });

});
