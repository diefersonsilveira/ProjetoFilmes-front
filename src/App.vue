<template>
  <div class="app">
    <header>
      <nav class="main-nav">
        <router-link to="/" class="logo-area">
          <img src="@/assets/logoHome.png" alt="Logo CineVue" class="logo-img" />
        </router-link>
        <div class="search-area">
          <div class="search-container">
            <input type="text" v-model="searchQuery" @keyup.enter="handleSearch" placeholder="Buscar filmes...">
            <button @click="handleSearch" class="search-button" aria-label="Buscar">
              <svg class="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </div>
        <div class="login-area">
          <router-link to="/favoritos" class="favorites-button" aria-label="Favoritos">
            <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
              fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path
                d="M20.8 4.6c-1.5-1.4-3.9-1.4-5.4 0L12 8l-3.4-3.4c-1.5-1.4-3.9-1.4-5.4 0-1.6 1.5-1.6 4 0 5.5L12 21l8.8-10.9c1.6-1.5 1.6-4 0-5.5z" />
            </svg>
          </router-link>

          <button v-if="!isLoggedIn" @click="openLoginModal" class="login-button">
            Login
          </button>
          <button v-else @click="handleLogout" class="login-button">
            Sair ({{ usuarioNome }})
          </button>
        </div>

      </nav>
    </header>

    <main>
      <router-view @select-movie="openMovieModal"></router-view>
    </main>

    <MovieModal :show="!!selectedMovieId" :movie-id="selectedMovieId" @close="closeMovieModal" />

    <LoginModal :show="showLoginModal" @close="closeLoginModal" @login-success="handleLoginSuccess"
      @switch-to-register="switchToRegister" />

    <RegisterModal :show="showRegisterModal" @close="closeRegisterModal" @register="handleRegister"
      @switch-to-login="switchToLogin" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MovieModal from './components/MovieModal.vue'
import LoginModal from './components/LoginModal.vue'
import RegisterModal from './components/RegisterModal.vue'
import { getUsuarioId, getUsuarioNome, clearUsuario } from './services/user'

const router = useRouter()
const searchQuery = ref('')
const selectedMovieId = ref(null)
const showLoginModal = ref(false)
const showRegisterModal = ref(false)

// Estado reativo do usuário
const userState = ref({
  id: getUsuarioId(),
  nome: getUsuarioNome()
});

const isLoggedIn = computed(() => !!userState.value.id);
const usuarioNome = computed(() => userState.value.nome);

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'search',
      query: { q: searchQuery.value.trim() }
    });
  }
};

const openMovieModal = (movie) => {
  selectedMovieId.value = movie.id;
};

const closeMovieModal = () => {
  selectedMovieId.value = null;
};

const openLoginModal = () => {
  showLoginModal.value = true;
};

const closeLoginModal = () => {
  showLoginModal.value = false;
};

const openRegisterModal = () => {
  showRegisterModal.value = true;
};

const closeRegisterModal = () => {
  showRegisterModal.value = false;
};

const switchToRegister = () => {
  showLoginModal.value = false;
  showRegisterModal.value = true;
};

const switchToLogin = () => {
  showRegisterModal.value = false;
  showLoginModal.value = true;
};

const handleLoginSuccess = (user) => {
  console.log('Usuário logado:', user);
  userState.value.id = user.usuarioId;
  userState.value.nome = user.nomeCompleto;
};

const handleRegister = (user) => {
  console.log('Usuário registrado:', user);
  alert(`Registro realizado com sucesso para ${user.nomeCompleto}!`);
};

const handleLogout = () => {
  clearUsuario();
  userState.value.id = null;
  userState.value.nome = null;
};
</script>

<style>
:root {
  --primary-color: #19673B;
  --primary-dark: #19673B;
  --background: #f5f7f4;
  --surface: #fff;
  --on-surface: #222;
  --on-surface-variant: #999999;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: #f5f7f4;
  color: #222;
  line-height: 1.6;
  font-weight: 400;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7f4;
}

header {
  background: #fff;
  padding: 1.2rem 0 1.0rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  overflow: hidden;
}

.main-nav {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2.5rem;
  padding: 0 2.5rem;
  min-height: unset;
}

.logo-area {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  margin-right: 2.5rem;
}

.logo-img {
  height: 100px;
  width: auto;
  max-width: 200px;
  object-fit: contain;
  display: block;
  margin-top: -40px;
  margin-bottom: -40px;
}

.search-area {
  flex: 1 1 600px;
  display: flex;
  justify-content: center;
}

.search-container {
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 0.2rem 0.4rem 0.2rem 1.2rem;
  gap: 0.5rem;
}

input[type="text"] {
  flex: 1;
  padding: 1.1rem 1rem 1.1rem 0;
  border: none;
  background: transparent;
  color: var(--on-surface);
  font-size: 1.15rem;
  border-radius: 32px;
  outline: none;
  box-shadow: none;
  height: 48px;
}

input[type="text"]::placeholder {
  color: var(--on-surface-variant);
  opacity: 0.8;
}

.search-button {
  background: #19673B;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  transition: background-color 0.3s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(25, 103, 59, 0.13);
  margin-left: 0.2rem;
  padding: 0;
}

.search-button:hover {
  background: #19673B;
}

.search-icon {
  width: 24px;
  height: 24px;
  color: white;
  display: block;
}

.login-area {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  margin-left: 2.5rem;
}

.login-button {
  background: #19673B;
  color: white;
  text-decoration: none;
  padding: 0 2rem;
  border-radius: 32px;
  font-weight: 700;
  transition: background-color 0.3s, box-shadow 0.2s;
  white-space: nowrap;
  border: none;
  cursor: pointer;
  font-size: 1.15rem;
  box-shadow: 0 2px 8px rgba(25, 103, 59, 0.10);
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.5px;
}

.login-button:hover {
  background: #19673B;
  box-shadow: 0 4px 16px rgba(25, 103, 59, 0.18);
}

main {
  flex: 1;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  background: #f5f7f4;
}

@media (max-width: 900px) {
  .main-nav {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
    padding: 1.2rem 1rem 1.2rem 1rem;
    min-height: unset;
  }

  .logo-area {
    margin-right: 0;
    justify-content: center;
  }

  .login-area {
    margin-left: 0;
    justify-content: center;
  }

  .search-area {
    width: 100%;
    max-width: 100%;
    margin: 0.5rem 0;
  }

  .search-container {
    max-width: 100%;
  }
}

@media (max-width: 600px) {
  header {
    padding: 0.5rem 0 0.5rem 0;
  }

  .logo-img {
    height: 48px;
    max-width: 90px;
  }

  .login-button {
    padding: 0 1.2rem;
    font-size: 1rem;
    height: 40px;
  }

  .search-button {
    width: 40px;
    height: 40px;
  }

  .search-container {
    padding: 0.1rem 0.2rem 0.1rem 0.7rem;
  }

  input[type="text"] {
    font-size: 1rem;
    padding: 0.7rem 0.5rem 0.7rem 0;
  }
}

.favorites-button {
  background: #19673B;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  margin-right: 1rem;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 8px rgba(25, 103, 59, 0.15);
}

.favorites-button:hover {
  background: #155f36;
  transform: scale(1.05);
}

.heart-icon {
  width: 24px;
  height: 24px;
  fill: white;
  stroke: white;
  transition: transform 0.2s ease;
}

.favorites-button:hover .heart-icon {
  transform: scale(1.05);
}

@media (max-width: 900px) {
  .favorites-button {
    margin-right: 0;
  }
}

</style>
