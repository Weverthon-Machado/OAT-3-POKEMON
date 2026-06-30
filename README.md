<div align="center">

<img src="./assets/logo.png" alt="Pokédex Logo" width="250"/>

# 📱 Pokédex App

Projeto Prático Integrador — React Native | Centro Universitário Unidesc

Aplicativo mobile de Pokédex construído com **React Native** e **Expo**, com navegação entre telas, consumo da **PokéAPI**, persistência de dados em nuvem com **Firebase Firestore** e animações na interface.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

</div>

---

## 👥 Integrantes

- **[Weverthon Vaz Machado]**
- **[Nome do Integrante 2]()**

---

## 📌 Sobre o projeto

O app permite explorar a Pokédex completa consumindo dados em tempo real da **PokéAPI**, buscar Pokémons por nome ou ID, visualizar detalhes como tipo, altura e peso, e **favoritar** Pokémons salvando-os na nuvem via **Firebase Firestore** — podendo editar o apelido ou remover a qualquer momento.

---

## ✅ Requisitos Técnicos Atendidos

### 1. Navegação Roteada — React Navigation (3 telas)

Estrutura com **Bottom Tabs** + **Stack Navigator**:

| Tela | Descrição |
|------|-----------|
| **Pokédex (Home)** | Lista paginada de Pokémons com busca por nome ou ID |
| **Detalhes** | Informações completas do Pokémon com animações e opção de favoritar |
| **Favoritos** | Lista de Pokémons salvos no Firebase com edição e remoção |

### 2. Consumo de API Externa — [PokéAPI](https://pokeapi.co/)

- API REST pública e gratuita, consumida via `fetch`
- Listagem paginada com scroll infinito
- Busca por nome ou número da Pokédex
- Dados retornados: sprite oficial, tipos, altura e peso

### 3. CRUD Completo com Firebase Firestore

| Operação | Onde acontece |
|----------|--------------|
| **Create** | Tela de Detalhes → "⭐ Adicionar aos Favoritos" |
| **Read** | Tela de Favoritos → lista todos os Pokémons salvos |
| **Update** | Tela de Detalhes ou Favoritos → editar apelido do Pokémon |
| **Delete** | Tela de Detalhes ou Favoritos → botão "🗑 Remover" |

### 4. Animações com API `Animated` do React Native

- **Fade + Spring** na entrada do card de detalhes
- **Rotação 360°** ao tocar na imagem do Pokémon
- **Fade-in** na listagem da tela Home

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Finalidade |
|-----------|-----------|
| [React Native](https://reactnative.dev/) | Framework mobile |
| [Expo](https://expo.dev/) | Plataforma de desenvolvimento |
| [React Navigation](https://reactnavigation.org/) | Navegação (Stack + Bottom Tabs) |
| [Firebase Firestore](https://firebase.google.com/products/firestore) | Banco de dados em nuvem (CRUD) |
| [PokéAPI](https://pokeapi.co/) | API pública de dados dos Pokémons |
| `Animated` (React Native) | Animações de interface |

---

## 📁 Estrutura do projeto

```
pokedex/
├── assets/                  # Ícones, logo e splash screen
├── constants/
│   └── typeColors.js        # Mapeamento de cores por tipo de Pokémon
├── screens/
│   ├── HomeScreen.js        # Tela 1 — listagem e busca
│   ├── DetailsScreen.js     # Tela 2 — detalhes, animações e favoritar
│   └── FavoritesScreen.js   # Tela 3 — gerenciamento de favoritos
├── App.js                   # Configuração da navegação
├── firebaseConfig.js        # Configuração do Firebase
├── app.json
├── index.js
└── package.json
```

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) v20.19 ou superior (LTS recomendado)
- [Expo Go](https://expo.dev/client) no celular (Android ou iOS) — opcional
- Conta gratuita no [Firebase](https://console.firebase.google.com/)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/pokedex.git
cd pokedex
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/) e crie um projeto
2. Vá em **Compilação → Firestore Database → Criar banco de dados** (modo de teste)
3. Em **Configurações do projeto → Geral**, registre um app Web (`</>`)
4. Copie as credenciais e cole no arquivo `firebaseConfig.js`:

```js
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID",
};
```

### 4. Execute o projeto

```bash
npx expo start
```

| Tecla | Ação |
|-------|------|
| `w` | Abre no navegador web |
| `a` | Abre no emulador Android |
| 📱 QR Code | Escaneia com o Expo Go no celular |

> **Primeira vez rodando na web?**
> ```bash
> npx expo install react-dom react-native-web @expo/metro-runtime
> ```

---

## 🔥 Modelo de dados no Firestore

Coleção: `favoritos` — documento identificado pelo ID do Pokémon:

```json
{
  "pokemonId": 25,
  "nome": "pikachu",
  "imagem": "https://...",
  "tipo": "electric",
  "apelido": "Meu Pikachu",
  "criadoEm": "2026-06-30T12:00:00.000Z"
}
```

---

## 📚 API utilizada

**[PokéAPI](https://pokeapi.co/)** — API REST pública, gratuita e sem autenticação.

```
GET https://pokeapi.co/api/v2/pokemon?limit=20&offset=0   # Listagem paginada
GET https://pokeapi.co/api/v2/pokemon/{id ou nome}         # Detalhes do Pokémon
```

---

## 📄 Licença

Este projeto está sob a licença MIT.
