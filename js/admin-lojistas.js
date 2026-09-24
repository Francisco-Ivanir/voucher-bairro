import {
  app,
  firebaseConfig
} from "../config/firebase-config.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

const db =
  getFirestore(app);

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

const appCadastro =
  initializeApp(
    firebaseConfig,
    "cadastroLojista"
  );

const authCadastro =
  getAuth(appCadastro);

const listaLojistas =
  document.getElementById("listaLojistas");

const authAdmin =
  getAuth(app);


const emailAdmin =
  document.getElementById("emailAdmin");

const senhaAdmin =
  document.getElementById("senhaAdmin");

const btnLoginAdmin =
  document.getElementById("btnLoginAdmin");

const mensagemLoginAdmin =
  document.getElementById(
    "mensagemLoginAdmin"
  );

const areaLoginAdmin =
  document.getElementById(
    "areaLoginAdmin"
  );

const areaAdministracao =
  document.getElementById(
    "areaAdministracao"
  );

btnLoginAdmin.addEventListener(
  "click",
  async () => {

    const email =
      emailAdmin.value.trim();

    const senha =
      senhaAdmin.value;

    if (!email || !senha) {

      mensagemLoginAdmin.textContent =
        "❌ Informe o e-mail e a senha.";

      return;
    }

    try {

      const resultado =
  await signInWithEmailAndPassword(
    authAdmin,
    email,
    senha
  );


if (
  resultado.user.email !==
  "admin@teste.com"
) {

  mensagemLoginAdmin.textContent =
    "❌ Esta conta não é autorizada como administrador.";

  await authAdmin.signOut();

  return;
}


console.log(
  "Administrador autorizado:",
  resultado.user.email
);


mensagemLoginAdmin.textContent =
  "✅ Administrador autenticado com sucesso.";

      areaAdministracao.style.display =
  "block";

areaLoginAdmin.style.display =
  "none";

carregarLojistas();
      
    } catch (erro) {

      console.error(
        "Erro no login do administrador:",
        erro
      );

      mensagemLoginAdmin.textContent =
        "❌ E-mail ou senha inválidos.";

    }

  }
);

async function carregarLojistas() {

  const resposta =
    await getDocs(
      collection(db, "lojistas")
    );

  listaLojistas.innerHTML = "";

  lojistaVoucher.innerHTML = `
  <option value="">
    Selecione a loja
  </option>
`;
  
  resposta.forEach((documento) => {

    const dados =
      documento.data();

    if (dados.ativo === true) {

  const opcao =
    document.createElement("option");

  opcao.value =
    dados.lojistaId;

  opcao.textContent =
    dados.nome + " (" + dados.lojistaId + ")";

  lojistaVoucher.appendChild(opcao);
}
    
    const item =
      document.createElement("div");

    item.innerHTML = `
      <p>
        <strong>${dados.nome}</strong>
      </p>

      <p>
        ID: ${dados.lojistaId}
      </p>

      <p>
        E-mail: ${dados.email}
      </p>

      <p>
        UID:
        ${dados.uid}
      </p>

      <p>
        Criado em:
        ${
          dados.criadoEm
            ? dados.criadoEm.toDate().toLocaleString()
            : "---"
        }
      </p>

      <p>
        Último acesso:
        ${
          dados.ultimoAcesso
            ? dados.ultimoAcesso.toDate().toLocaleString()
            : "---"
        }
      </p>
      
      <p>
  Status:
  ${
    dados.ativo === true
      ? "🟢 Ativo"
      : "🔴 Inativo"
  }
</p>

      <button
        class="btnAlterarStatus"
        data-id="${documento.id}"
        data-ativo="${dados.ativo === true}"
      >
        ${
          dados.ativo === true
            ? "Desativar lojista"
            : "Ativar lojista"
        }
      </button>

      <hr>
    `;

    listaLojistas.appendChild(item);

  });


  document
    .querySelectorAll(".btnAlterarStatus")
    .forEach((botao) => {

      botao.addEventListener("click", async () => {

        botao.disabled = true;
botao.textContent = "Atualizando...";
        
        const idDocumento =
          botao.dataset.id;

        const ativoAtual =
          botao.dataset.ativo === "true";

        const novoStatus =
          !ativoAtual;

        try {

          await updateDoc(
            doc(
              db,
              "lojistas",
              idDocumento
            ),
            {
              ativo: novoStatus
            }
          );

         console.log(
  "Status do lojista atualizado:",
  idDocumento,
  novoStatus
);


alert(
  novoStatus
    ? "✅ Lojista ativado com sucesso."
    : "⚠️ Lojista desativado com sucesso."
);


carregarLojistas();

       } catch (erro) {

  console.error(
    "Erro ao atualizar status do lojista:",
    erro
  );

  botao.disabled = false;

  botao.textContent =
    ativoAtual
      ? "Desativar lojista"
      : "Ativar lojista";

  alert(
    "❌ Não foi possível atualizar o status do lojista."
  );

}

      });

    });

}

carregarLojistas();



const btnNovoLojista =
  document.getElementById("btnNovoLojista");

const areaCadastroLojista =
  document.getElementById("areaCadastroLojista");

const btnNovoVoucher =
  document.getElementById("btnNovoVoucher");

const areaCadastroVoucher =
  document.getElementById("areaCadastroVoucher");

const lojistaVoucher =
  document.getElementById("lojistaVoucher");

btnNovoLojista.addEventListener("click", () => {

  areaCadastroLojista.style.display = "block";

});

btnNovoVoucher.addEventListener("click", () => {

  areaCadastroVoucher.style.display =
    areaCadastroVoucher.style.display === "none"
      ? "block"
      : "none";

});

const btnSalvarLojista =
  document.getElementById("btnSalvarLojista");


btnSalvarLojista.addEventListener("click", async () => {

  const nome =
    document
      .getElementById("nomeNovoLojista")
      .value
      .trim();

  const email =
    document
      .getElementById("emailNovoLojista")
      .value
      .trim();

  const senha =
    document
      .getElementById("senhaNovoLojista")
      .value;

  const mensagem =
    document.getElementById(
      "mensagemCadastroLojista"
    );


  if (!nome || !email || !senha) {

    mensagem.textContent =
      "Preencha nome, e-mail e senha.";

    return;

  }


  mensagem.textContent =
    "Criando lojista...";


  try {

    const resultado =
      await createUserWithEmailAndPassword(
        authCadastro,
        email,
        senha
      );


    console.log(
      "Novo usuário criado no Firebase Authentication:",
      resultado.user.uid
    );


    mensagem.textContent =
      "✅ Usuário criado no Firebase Authentication.";

    const uid =
  resultado.user.uid;


const lojistasExistentes =
  await getDocs(
    collection(db, "lojistas")
  );


const prefixo =
  nome
    .replace(/[^a-zA-ZÀ-ÿ]/g, "")
    .substring(0, 4)
    .toUpperCase();


let maiorNumero = 0;


lojistasExistentes.forEach((documento) => {

  const dados =
    documento.data();

  if (
    dados.lojistaId &&
    dados.lojistaId.startsWith(prefixo)
  ) {

    const numero =
      parseInt(
        dados.lojistaId
          .replace(prefixo, ""),
        10
      );

    if (
      !isNaN(numero) &&
      numero > maiorNumero
    ) {

      maiorNumero = numero;

    }

  }

});


const proximoNumero =
  String(maiorNumero + 1)
    .padStart(3, "0");


const lojistaId =
  prefixo + proximoNumero;


await addDoc(
  collection(db, "lojistas"),
  {
    nome: nome,
    email: email,
    uid: uid,
    lojistaId: lojistaId,
    ativo: true,
    criadoEm: serverTimestamp(),
    ultimoAcesso: null
  }
);


console.log(
  "Lojista criado no Firestore:",
  lojistaId
);


mensagem.textContent =
  "✅ Lojista criado com sucesso. ID: " +
  lojistaId;

    carregarLojistas();
    
  } catch (erro) {

    console.error(
      "Erro ao criar usuário:",
      erro
    );

    mensagem.textContent =
      "❌ Não foi possível criar o usuário.";

  }

});

