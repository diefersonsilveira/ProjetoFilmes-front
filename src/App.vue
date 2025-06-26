<template>
  <div class="app">
    <header>
      <nav>
        <router-link to="/" class="logo">
          🎬 CineVue
        </router-link>
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            placeholder="Buscar filmes..."
          >
          <button @click="handleSearch" class="search-button">
            🔍
          </button>
        </div>
      </nav>
    </header>

    <main>
      <router-view @select-movie="openMovieModal"></router-view>
    </main>

    <MovieModal
      :show="!!selectedMovieId"
      :movie-id="selectedMovieId"
      @close="closeMovieModal"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MovieModal from './components/MovieModal.vue'

const router = useRouter()
const searchQuery = ref('')
const selectedMovieId = ref(null)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'search',
      query: { q: searchQuery.value.trim() }
    })
  }
}

const openMovieModal = (movie) => {
  selectedMovieId.value = movie.id
}

const closeMovieModal = () => {
  selectedMovieId.value = null
}
</script>

<style>
:root {
  --primary-color: #4CAF50;
  --primary-dark: #45a049;
  --background: #121212;
  --surface: #1a1a1a;
  --on-surface: #ffffff;
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
  background: var(--background);
  color: var(--on-surface);
  line-height: 1.6;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background: var(--surface);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

nav {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0 1rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-container {
  flex: 1;
  max-width: 600px;
  display: flex;
  gap: 0.5rem;
}

input[type="text"] {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid transparent;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--on-surface);
  font-size: 1rem;
  transition: all 0.3s ease;
}

input[type="text"]:focus {
  outline: none;
  border-color: var(--primary-color);
  background: rgba(255, 255, 255, 0.15);
}

input[type="text"]::placeholder {
  color: var(--on-surface-variant);
}

.search-button {
  background: var(--primary-color);
  border: none;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background: var(--primary-dark);
}

main {
  flex: 1;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  nav {
    flex-direction: column;
    gap: 1rem;
  }

  .search-container {
    width: 100%;
  }
}
</style>
