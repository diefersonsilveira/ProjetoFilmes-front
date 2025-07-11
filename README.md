# 🎬 CineVue

**CineVue** é um **catálogo de filmes com sistema de favoritos e avaliações**, permitindo que usuários explorem filmes populares, favoritem, deixem avaliações e gerenciem sua experiência de forma intuitiva e moderna.

O projeto foi desenvolvido com **Vue.js** no frontend e possui backend separado utilizando **Spring Boot** para gerenciar usuários, favoritos e avaliações.

---

## 🚀 Tecnologias utilizadas

- **Vue.js 3 (Composition API)** – framework frontend.
- **Vite** – bundler para desenvolvimento rápido.
- **Axios** – consumo de API do TMDB e do backend Spring.
- **Vue Router** – gerenciamento de rotas.
- **CSS puro e responsivo** – sem frameworks pesados.
- **Backend (Spring Boot)**: [Repositório Backend CineVue](https://github.com/LucasCadaval/ProjetoFilmes)

---

## ⚙️ Como rodar localmente

1️⃣ **Clone o repositório:**

```bash
git clone https://github.com/diefersonsilveira/ProjetoFilmes-front
cd cinevue-frontend
```

2️⃣ **Instale as dependências:**

```bash
npm install
```

3️⃣ **Rode o projeto:**

```bash
npm run dev
```

4️⃣ Acesse no navegador:
```
http://localhost:5173
```

> ⚠️ **Certifique-se que o backend esteja rodando antes de utilizar o frontend.**  
Siga as instruções no repositório do backend: [CineVue Backend](https://github.com/LucasCadaval/ProjetoFilmes)

---

## ✨ Funcionalidades

✅ **Visualização de filmes populares** utilizando dados do TMDB.  
✅ **Busca de filmes por nome**.  
✅ **Favoritar e visualizar favoritos** persistidos no backend.  
✅ **Visualização detalhada do filme em modal responsiva**.  
✅ **Sistema de avaliações**:
- Nota de 0 a 5 estrelas.
- Comentário por usuário.
- Listagem das avaliações de cada filme.

✅ **Login e registro de usuário**.  
✅ **Logout e gerenciamento de sessão local**.  
✅ **Interface limpa e responsiva para desktop, tablet e mobile**.

---

## 🎥 Demonstrações 

- **Home e busca de filmes:**  
  ![](public/gifs/home-busca.gif)

- **Favoritar e visualizar favoritos:**  
  ![](public/gifs/favoritar-filmes.gif)

- **Visualização detalhada e avaliações:**  
  ![](public/gifs/modal-avaliacoes.gif)

- **Login e registro de usuário:**  
  ![](public/gifs/login-registro.gif)

- **Responsividade mobile:**  
  ![](public/gifs/responsivo-mobile.gif)




