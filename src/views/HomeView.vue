<template>
  <div class="home">
    <h2>Filmes Populares</h2>

    <div class="movies-grid">
      <MovieCard
        v-for="movie in paginatedMovies"
        :key="movie.id"
        :movie="movie"
        @click="$emit('select-movie', movie)"
      />
    </div>

    <div class="pagination" v-if="totalPages > 1">
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MovieCard from '../components/MovieCard.vue'
import { getPopularMovies } from '../services/movieApi'

const route = useRoute()
const router = useRouter()

const allMovies = ref([]) // cache de filmes carregados
const currentPage = ref(1)
const pageSize = 15

const totalPages = computed(() => {
  return Math.ceil(allMovies.value.length / pageSize)
})

const paginatedMovies = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return allMovies.value.slice(start, end)
})

const fetchMovies = async () => {
  if (allMovies.value.length > 0) return // já está em cache, não busca novamente
  try {
    const data = await getPopularMovies()
    allMovies.value = data.results || []
  } catch (error) {
    console.error('Erro ao buscar filmes populares:', error)
    allMovies.value = []
  }
}

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  router.replace({ query: { page } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  currentPage.value = Number(route.query.page) || 1
  await fetchMovies()
})

watch(
  () => route.query.page,
  (newPage) => {
    currentPage.value = Number(newPage) || 1
  }
)
</script>

<style scoped>
.home {
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
}
</style>
