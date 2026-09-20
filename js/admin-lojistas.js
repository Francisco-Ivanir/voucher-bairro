import {
  app,
  firebaseConfig
} from "../config/firebase-config.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const db =
  getFirestore(app);

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getAuth
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


async function carregarLojistas() {

  const resposta =
    await getDocs(
      collection(db, "lojistas")
    );

  listaLojistas.innerHTML = "";

  resposta.forEach((documento) => {

    const dados =
      documento.data();

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
        Status:
        ${dados.ativo === true ? "Ativo" : "Inativo"}
      </p>

      <hr>
    `;

    listaLojistas.appendChild(item);

  });

}


carregarLojistas();

const btnNovoLojista =
  document.getElementById("btnNovoLojista");

const areaCadastroLojista =
  document.getElementById("areaCadastroLojista");


btnNovoLojista.addEventListener("click", () => {

  areaCadastroLojista.style.display = "block";

});

