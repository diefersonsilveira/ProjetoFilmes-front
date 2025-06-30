<template>
  <div class="search">
    <h2>Resultados para "{{ searchQuery }}"</h2>
    
    <div v-if="movies.length" class="movies-grid">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @click="$emit('select-movie', movie)"
      />
    </div>
    
    <div v-else-if="!loading" class="no-results">
      <span>😕</span>
      <p>Nenhum filme encontrado para sua busca.</p>
      <router-link to="/" class="back-btn">Voltar para Filmes Populares</router-link>
    </div>

    <div v-if="loading" class="loading">
      <div class="loader"></div>
      <span>Buscando filmes...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MovieCard from '../components/MovieCard.vue'
import { searchMovies } from '../services/movieApi'
import { getUsuarioId } from '../services/user'

const route = useRoute()
const movies = ref([])
const loading = ref(false)
const searchQuery = ref('')

const fetchMovies = async () => {
  const query = route.query.q
  if (!query) {
    movies.value = []
    searchQuery.value = ''
    return
  }

  loading.value = true
  searchQuery.value = query

  try {
    const usuarioId = getUsuarioId()
    const data = await searchMovies(query, usuarioId)
    movies.value = data.results || []
  } catch (error) {
    console.error('Erro ao buscar filmes:', error)
    movies.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchMovies)
watch(() => route.query.q, fetchMovies)
</script>

<style scoped>
.search {
  background: #f5f7f4;
  color: #222;
  animation: fadeIn 0.5s ease;
}

h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #19673B;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.no-results {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--on-surface-variant);
}

.no-results span {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.no-results p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.back-btn {
  display: inline-block;
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background: var(--primary-dark);
}

.loading {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid var(--primary-color);
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg) }
  100% { transform: rotate(360deg) }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
