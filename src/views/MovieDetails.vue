<template>
  <div v-if="movie" class="movie-details">
    <div class="backdrop" :style="backdropStyle">
      <div class="overlay">
        <div class="content">
          <div class="poster">
            <img :src="posterUrl" :alt="movie.title">
          </div>
          <div class="info">
            <h1>{{ movie.title }}</h1>
            <div class="meta">
              <span class="rating">⭐ {{ movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A' }}</span>
              <span class="year">{{ releaseYear }}</span>
            </div>
            <div class="genres">
              <span v-for="g in movie.genres" :key="g.id" class="genre">{{ g.name }}</span>
            </div>
            <p class="overview">{{ movie.overview }}</p>
            <div class="extra-details">
              <div>
                <strong>Favorito:</strong>
                <span v-if="movie.isFavorito">Sim</span>
                <span v-else>Não</span>
              </div>
              <div v-if="movie.mediaAvaliacoes !== null">
                <strong>Média de Avaliações:</strong> {{ movie.mediaAvaliacoes }}
              </div>
              <div>
                <strong>Data de Lançamento:</strong> {{ movie.release_date ? formatDate(movie.release_date) : 'Não informada' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="error" class="error">
    <h2>Erro ao carregar filme</h2>
    <p>{{ error }}</p>
    <button @click="retryLoad" class="retry-btn">Tentar novamente</button>
  </div>
  <div v-else class="loading">
    <div class="loader"></div>
    <span>Carregando detalhes do filme...</span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getMovieDetails } from '../services/movieApi'

const route = useRoute()
const movie = ref(null)
const error = ref(null)
const loading = ref(true)

const posterUrl = computed(() => {
  return movie.value?.posterUrl 
    ? movie.value.posterUrl 
    : 'https://via.placeholder.com/500x750?text=Sem+Imagem'
})

const backdropStyle = computed(() => ({
  background: '#000'
}))

const releaseYear = computed(() => {
  return movie.value?.release_date
    ? new Date(movie.value.release_date).getFullYear()
    : 'Data não disponível'
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

const loadMovie = async () => {
  const movieId = route.params.id
  console.log('Carregando filme ID:', movieId)
  
  loading.value = true
  error.value = null
  
  try {
    const data = await getMovieDetails(movieId, 1)
    console.log('Dados recebidos:', data)
    
    if (data) {
      movie.value = data
    } else {
      error.value = 'Filme não encontrado'
    }
  } catch (err) {
    console.error('Erro ao carregar filme:', err)
    error.value = 'Erro ao carregar detalhes do filme. Verifique sua conexão.'
  } finally {
    loading.value = false
  }
}

const retryLoad = () => {
  loadMovie()
}

onMounted(() => {
  loadMovie()
})
</script>

<style scoped>
.movie-details {
  background: #fff;
  color: #222;
  min-height: 100vh;
}

.backdrop {
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}

.overlay {
  background: rgba(0, 0, 0, 0.8);
  min-height: 100vh;
  padding: 2rem 0;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  padding: 0 1rem;
}

.poster img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.info {
  padding: 1rem 0;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.rating {
  color: #ffd700;
}

.genres {
  color: #ccc;
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.genre {
  color: #19673B;
}

.overview {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.extra-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 1.05rem;
  color: #e0e0e0;
}

.extra-details strong {
  color: #19673B;
  font-weight: 600;
}

.loading {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
  color: white;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #19673B;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg) }
  100% { transform: rotate(360deg) }
}

.error {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  text-align: center;
  color: white;
}

.error h2 {
  color: #ff6b6b;
  margin-bottom: 1rem;
}

.retry-btn {
  background: #19673B;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background: #19673B;
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }
  .poster {
    max-width: 300px;
    margin: 0 auto;
  }
}

.info, .overview, .extra-details, .meta, .poster img, .error, .error h2, .retry-btn {
  color: white;
  font-weight: 400;
}

.genre, .extra-details strong {
  color: #19673B;
}
</style>
