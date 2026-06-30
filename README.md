<div align="center">

<img src="./assets/logo.png" alt="Pokédex Logo" width="250"/>

# 📱 Pokédex App

Projeto Prático Integrador em React Native — Trabalho em Duplas

Aplicativo mobile de Pokédex construído com **React Native** e **Expo**, com navegação entre telas, consumo da **PokéAPI**, persistência de dados em nuvem com **Firebase Firestore** e animações na interface.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

</div>

---

## 👥 Autores

- **[Nome do Integrante 1](https://github.com/usuario1)**
- **[Nome do Integrante 2](https://github.com/usuario2)**

---

## 🎯 Sobre o projeto

O app permite explorar a Pokédex completa consumindo dados em tempo real da **PokéAPI**, buscar Pokémons por nome ou ID, visualizar detalhes (tipo, altura, peso) e **favoritar** Pokémons salvando-os na nuvem via **Firebase Firestore**, podendo editar o apelido do favorito ou removê-lo a qualquer momento.

---

## ✨ Funcionalidades

### Navegação (React Navigation)
O app possui **3 telas** organizadas em Bottom Tabs + Stack Navigation:

| Tela | Descrição |
|------|-----------|
| **Pokédex (Home)** | Lista paginada de Pokémons + busca por nome/ID |
| **Detalhes** | Informações completas do Pokémon, com animações |
| **Favoritos** | Lista de Pokémons salvos no Firebase, com edição e remoção |

### Consumo de API externa — [PokéAPI](https://pokeapi.co/)
- Listagem paginada de Pokémons (scroll infinito)
- Busca por nome ou número da Pokédex
- Dados detalhados: sprite oficial, tipos, altura e peso

### CRUD completo com Firebase Firestore
| Operação | Onde acontece |
|----------|----------------|
| **Create** | Tela de Detalhes → botão "⭐ Adicionar aos Favoritos" |
| **Read** | Tela de Favoritos → lista todos os Pokémons salvos |
| **Update** | Tela de Detalhes ou Favoritos → editar o apelido do Pokémon |
| **Delete** | Tela de Detalhes ou Favoritos → botão "🗑 Remover" |

### Animações
- **Fade + Spring** na entrada do card de detalhes do Pokémon
- **Rotação animada** ao tocar na imagem do Pokémon (sprite gira 360°)
- **Fade-in** na listagem de Pokémons da Home

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|-----------|-----|
| [React Native](https://reactnative.dev/) | Framework mobile |
| [Expo](https://expo.dev/) | Plataforma de desenvolvimento |
| [React Navigation](https://reactnavigation.org/) | Navegação entre telas (Stack + Bottom Tabs) |
| [Firebase Firestore](https://firebase.google.com/products/firestore) | Banco de dados em nuvem (CRUD de favoritos) |
| [PokéAPI](https://pokeapi.co/) | API pública de dados dos Pokémons |
| `Animated` (React Native) | Animações de interface |

---

## 📁 Estrutura do projeto

```
pokedex/
├── assets/                 # Ícones, logo e splash screen
├── constants/
│   └── typeColors.js       # Cores por tipo de Pokémon
├── screens/
│   ├── HomeScreen.js        # Tela 1 — listagem + busca
│   ├── DetailsScreen.js     # Tela 2 — detalhes + animações + favoritar
│   └── FavoritesScreen.js   # Tela 3 — CRUD de favoritos
├── App.js                  # Configuração da navegação
├── firebaseConfig.js       # Configuração do Firebase
├── app.json
├── index.js
└── package.json
```

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS)
- [Expo Go](https://expo.dev/client) instalado no celular (Android ou iOS)
- Uma conta gratuita no [Firebase](https://console.firebase.google.com/)

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

1. Acesse o [Console do Firebase](https://console.firebase.google.com/) e crie um novo projeto
2. Em **Build → Firestore Database**, clique em "Criar banco de dados" (modo de teste para desenvolvimento)
3. Em **Configurações do projeto → Geral → Seus aplicativos**, registre um app Web (ícone `</>`)
4. Copie as credenciais geradas e cole no arquivo `firebaseConfig.js`:

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

| Comando | Ação |
|--------|------|
| `w` | Abre no navegador web |
| `a` | Abre no emulador Android |
| `i` | Abre no emulador iOS (Mac) |
| 📱 QR Code | Escaneia com o Expo Go no celular |

> **Rodando pela primeira vez na Web?**
> ```bash
> npx expo install react-dom react-native-web
> ```

---

## 📚 API utilizada

**[PokéAPI](https://pokeapi.co/)** — API REST pública, gratuita e sem necessidade de autenticação.

```
GET https://pokeapi.co/api/v2/pokemon?limit=20&offset=0    # Listagem
GET https://pokeapi.co/api/v2/pokemon/{id ou nome}         # Detalhes
```

---

## 🔥 Modelo de dados no Firestore

Coleção `favoritos`, documento identificado pelo ID do Pokémon:

```json
{
  "pokemonId": 25,
  "nome": "pikachu",
  "imagem": "https://...",
  "tipo": "electric",
  "apelido": "Pikachu",
  "criadoEm": "2026-06-30T12:00:00.000Z"
}
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
