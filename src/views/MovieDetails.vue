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
              <span class="rating">⭐ {{ movie.vote_average?.toFixed(1) || 'N/A' }}</span>
              <span class="year">{{ releaseYear }}</span>
            </div>
            <div class="genres">
              {{ genres }}
            </div>
            <p class="overview">{{ movie.overview }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    Carregando...
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getMovieDetails } from '../services/movieApi'

const route = useRoute()
const movie = ref(null)

const posterUrl = computed(() => {
  return movie.value?.posterUrl 
    ? movie.value.posterUrl 
    : 'https://via.placeholder.com/500x750?text=Sem+Imagem'
})

const backdropStyle = computed(() => ({
  background: '#000' // cor de fundo neutra, pode trocar se sua API passar backdrop futuramente
}))

const releaseYear = computed(() => {
  return movie.value?.release_date
    ? new Date(movie.value.release_date).getFullYear()
    : 'Data não disponível'
})

const genres = computed(() => {
  return movie.value?.genres && movie.value.genres.length > 0
    ? movie.value.genres.map(g => g.name).join(', ')
    : 'Gêneros não informados'
})

onMounted(async () => {
  const movieId = route.params.id
  movie.value = await getMovieDetails(movieId, 1) // ajusta para enviar usuarioId se necessário
})
</script>

<style scoped>
.movie-details {
  min-height: 100vh;
  color: white;
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
}

.overview {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.loading {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: white;
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
</style>
