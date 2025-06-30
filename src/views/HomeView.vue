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

const allMovies = ref([])
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
  // Tenta carregar do cache
  const cached = localStorage.getItem('popularMovies')
  if (cached) {
    try {
      const parsed = JSON.parse(cached)
      if (Array.isArray(parsed)) {
        allMovies.value = parsed
      }
    } catch {}
  }
  // Busca da API e atualiza cache
  try {
    const data = await getPopularMovies()
    allMovies.value = data.results || []
    localStorage.setItem('popularMovies', JSON.stringify(allMovies.value))
  } catch (error) {
    console.error('Erro ao buscar filmes populares:', error)
    if (!cached) allMovies.value = []
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
  background: #f5f7f4;
}

h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #19673B;
  font-weight: 800;
  text-shadow: none;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  background: #f5f7f4;
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
  background: #19673B;
  color: white;
  border: none;
  padding: 0 2rem;
  border-radius: 32px;
  font-weight: 700;
  cursor: pointer;
  font-size: 1.15rem;
  transition: background 0.3s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(25, 103, 59, 0.10);
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.5px;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #19673B;
}

.page-btn:hover:not(:disabled) {
  background: #19673B;
}

.page-info {
  color: #222;
  font-size: 1rem;
  font-weight: 400;
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

.logo-img {
  height: 200px;
  width: auto;
  max-width: 400px;
  object-fit: contain;
  display: block;
}

.movie-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(25, 103, 59, 0.07);
}
</style>
