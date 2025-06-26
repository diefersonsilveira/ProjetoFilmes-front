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

    <div class="pagination" v-if="totalPages > 1 && !loading">
      <button 
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="page-btn"
      >
        ← Anterior
      </button>
      
      <span class="page-info">
        Página {{ currentPage }} de {{ totalPages }}
      </span>
      
      <button 
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
        class="page-btn"
      >
        Próxima →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MovieCard from '../components/MovieCard.vue'
import { searchMovies } from '../services/movieApi'

const route = useRoute()
const router = useRouter()
const movies = ref([])
const currentPage = ref(1)
const totalPages = ref(0)
const loading = ref(false)
const searchQuery = ref('')

const fetchMovies = async () => {
  if (!route.query.q) return
  
  loading.value = true
  searchQuery.value = route.query.q
  const page = Number(route.query.page) || 1
  
  try {
    const data = await searchMovies(route.query.q, page)
    movies.value = data.results
    totalPages.value = Math.min(data.total_pages, 500)
    currentPage.value = page
  } catch (error) {
    console.error('Erro ao buscar filmes:', error)
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  router.push({
    query: { ...route.query, page }
  })
}

onMounted(fetchMovies)

watch(() => route.query, fetchMovies, { deep: true })
</script>

<style scoped>
.search {
  animation: fadeIn 0.5s ease;
}

h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--primary-color);
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
}

.page-btn {
  background: var(--surface);
  color: var(--on-surface);
  border: 2px solid var(--primary-color);
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: var(--primary-color);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: var(--on-surface-variant);
}

.page-info {
  color: var(--on-surface-variant);
  font-size: 0.9rem;
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

@media (max-width: 768px) {
  .movies-grid {
    gap: 1rem;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .no-results span {
    font-size: 3rem;
  }

  .no-results p {
    font-size: 1.1rem;
  }
}
</style> 