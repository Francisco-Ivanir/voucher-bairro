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

const resumoLoja =
  document.getElementById("resumoLoja");

const resumoLojistaId =
  document.getElementById("resumoLojistaId");

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

    const consultaLoja = query(
  collection(db, "vouchers"),
  where("lojistaId", "==", "LANC001")
);

const respostaLoja =
  await getDocs(consultaLoja);

    console.log(
  "Quantidade de vouchers da loja:",
  respostaLoja.size
);
    
let ativos = 0;
let utilizados = 0;
let vencidos = 0;

    let ativosLoja = 0;
let utilizadosLoja = 0;
let vencidosLoja = 0;

    const listaVouchers =
  document.getElementById("listaVouchers");

listaVouchers.innerHTML = "";

    const filtroStatus =
  document.getElementById("filtroStatus").value;
    
respostaLoja.forEach((documentoLoja) => {

  const dadosLoja =
    documentoLoja.data();

  let statusVoucher = "ativo";

if (
  dadosLoja.usado === true ||
  dadosLoja.status === "utilizado"
) {

  statusVoucher = "utilizado";

} else {

  const partesFiltro =
    dadosLoja.dataValidade.split("/");

  const validadeFiltro =
    new Date(
      partesFiltro[2],
      partesFiltro[1] - 1,
      partesFiltro[0]
    );

  if (new Date() > validadeFiltro) {

    statusVoucher = "vencido";

  }

}
  
  listaVouchers.innerHTML += `

  <div>

    <hr>

<p>
<strong>Loja:</strong>
${dadosLoja.loja}
</p>

<p>
<strong>ID do lojista:</strong>
${dadosLoja.lojistaId}
</p>

    <p>
    <strong>Código:</strong>
    ${dadosLoja.codigo}
    </p>

    <p>
    <strong>Cliente:</strong>
    ${dadosLoja.cliente}
    </p>

<p>
<strong>Criado em:</strong>
${dadosLoja.dataCriacao}
</p>

    <p>
    <strong>Benefício:</strong>
    ${dadosLoja.beneficio}
    </p>

    <p>
    <strong>Válido até:</strong>
    ${dadosLoja.dataValidade}
    </p>

    <p>
 <strong>Status:</strong>
${
  dadosLoja.usado === true ||
  dadosLoja.status === "utilizado"
    ? "🔵 UTILIZADO"
    : (
        new Date() >
        new Date(
          dadosLoja.dataValidade.split("/")[2],
          dadosLoja.dataValidade.split("/")[1] - 1,
          dadosLoja.dataValidade.split("/")[0]
        )
      )
      ? "🔴 VENCIDO"
      : "🟢 ATIVO"
}
    </p>

  </div>

`;
  
  console.log(
  "Voucher da loja:",
  dadosLoja.codigo
);
  
  if (
    dadosLoja.usado === true ||
    dadosLoja.status === "utilizado"
  ) {

    utilizadosLoja++;

  } else {

    const partesLoja =
      dadosLoja.dataValidade.split("/");

    const validadeLoja =
      new Date(
        partesLoja[2],
        partesLoja[1] - 1,
        partesLoja[0]
      );

    if (new Date() > validadeLoja) {

      vencidosLoja++;

    } else {

      ativosLoja++;

    }

  }

});

    document.getElementById("vouchersAtivos").textContent =
  ativosLoja;

document.getElementById("vouchersUtilizados").textContent =
  utilizadosLoja;

document.getElementById("vouchersVencidos").textContent =
  vencidosLoja;
    
    if (resposta.empty) {

      resultado.innerHTML =
        "❌ Voucher não encontrado.";

      return;

    }


    resposta.forEach((documento) => {

     const dados = documento.data();

if (
  dados.usado === true ||
  dados.status === "utilizado"
) {

  utilizados++;

} else {

  const hoje = new Date();

  const partes =
    dados.dataValidade.split("/");

  const validade = new Date(
    partes[2],
    partes[1] - 1,
    partes[0]
  );

  if (hoje > validade) {

    vencidos++;

  } else {

    ativos++;

  }

}

resumoLoja.textContent =
  dados.loja || "---";

resumoLojistaId.textContent =
  dados.lojistaId || "---";
      
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

const hoje = new Date();

const partes =
  dados.dataValidade.split("/");

const validade = new Date(
  partes[2],
  partes[1] - 1,
  partes[0]
);

const vencido = hoje > validade;

      if (vencido) {

  resultado.innerHTML = `

    <h3>❌ Voucher vencido</h3>

    <p>
    Loja: ${dados.loja}
    </p>

    <p>
    Benefício: ${dados.beneficio}
    </p>

    <p>
    Código: ${dados.codigo}
    </p>

    <p>
    Válido até: ${dados.dataValidade}
    </p>

    <p>
    Este voucher não pode ser utilizado.
    </p>

  `;

  return;

}

      if (!dados.lojistaId) {

  resultado.innerHTML = `

    <h3>⚠️ Voucher sem lojista identificado</h3>

    <p>
    Código: ${dados.codigo}
    </p>

    <p>
    Este voucher não pode ser utilizado até que
    seja associado a um lojista.
    </p>

  `;

  return;

}
      
      resultado.innerHTML = `

        <h3>✅ Voucher válido</h3>

<p>
Loja:
${dados.loja}
</p>

<p>
ID do lojista: ${dados.lojistaId}
</p>

<p>
Cliente:
${dados.cliente}
</p>

<p>
Benefício:
${dados.beneficio}
</p>

<p>
Código: ${dados.codigo}
</p>

<p>
Data de criação: ${dados.dataCriacao}
</p>

<p>
Válido até: ${dados.dataValidade}
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
