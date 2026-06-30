// firebaseConfig.js
// Configuração do Firebase — substitua pelos dados do SEU projeto.
//
// Como obter:
// 1. Acesse https://console.firebase.google.com/
// 2. Crie um projeto (ou use um existente)
// 3. Vá em "Configurações do projeto" > "Geral" > role até "Seus aplicativos"
// 4. Clique no ícone Web (</>) para registrar um app
// 5. Copie o objeto firebaseConfig gerado e cole abaixo
// 6. Ative o Firestore Database em "Build > Firestore Database > Criar banco de dados"
//    (pode iniciar em modo de teste para desenvolvimento)

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
