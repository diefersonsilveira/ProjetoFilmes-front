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
              <span class="rating">⭐ {{ movie.vote_average.toFixed(1) }}</span>
              <span class="year">{{ new Date(movie.release_date).getFullYear() }}</span>
              <span class="runtime">{{ formatRuntime(movie.runtime) }}</span>
            </div>
            <div class="genres">
              {{ movie.genres.map(g => g.name).join(', ') }}
            </div>
            <p class="overview">{{ movie.overview }}</p>
            
            <div v-if="director" class="crew">
              <strong>Diretor:</strong> {{ director.name }}
            </div>
            
            <div class="cast">
              <h3>Elenco Principal</h3>
              <div class="cast-list">
                <div v-for="actor in mainCast" :key="actor.id" class="cast-item">
                  <img 
                    :src="getActorImage(actor.profile_path)" 
                    :alt="actor.name"
                    class="cast-photo"
                  >
                  <div class="cast-info">
                    <div class="actor-name">{{ actor.name }}</div>
                    <div class="character-name">{{ actor.character }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="trailer" class="trailer">
              <h3>Trailer</h3>
              <iframe
                :src="trailerUrl"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
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
  if (!movie.value?.poster_path) return 'https://via.placeholder.com/500x750?text=Sem+Imagem'
  return `https://image.tmdb.org/t/p/w500${movie.value.poster_path}`
})

const backdropStyle = computed(() => {
  if (!movie.value?.backdrop_path) return {}
  return {
    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.value.backdrop_path})`
  }
})

const director = computed(() => {
  if (!movie.value?.credits) return null
  return movie.value.credits.crew.find(person => person.job === 'Director')
})

const mainCast = computed(() => {
  if (!movie.value?.credits) return []
  return movie.value.credits.cast.slice(0, 6)
})

const trailer = computed(() => {
  if (!movie.value?.videos?.results) return null
  return movie.value.videos.results.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  )
})

const trailerUrl = computed(() => {
  if (!trailer.value) return ''
  return `https://www.youtube.com/embed/${trailer.value.key}`
})

const formatRuntime = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}min`
}

const getActorImage = (path) => {
  if (!path) return 'https://via.placeholder.com/185x278?text=Sem+Foto'
  return `https://image.tmdb.org/t/p/w185${path}`
}

onMounted(async () => {
  const movieId = route.params.id
  movie.value = await getMovieDetails(movieId)
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

.crew {
  margin-bottom: 2rem;
}

.cast h3 {
  margin-bottom: 1rem;
}

.cast-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.cast-item {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.cast-item:hover {
  transform: translateY(-5px);
}

.cast-photo {
  width: 100%;
  height: 225px;
  object-fit: cover;
}

.cast-info {
  padding: 0.5rem;
}

.actor-name {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.character-name {
  font-size: 0.9rem;
  color: #ccc;
}

.trailer {
  margin-top: 2rem;
}

.trailer h3 {
  margin-bottom: 1rem;
}

.trailer iframe {
  width: 100%;
  height: 500px;
  border-radius: 8px;
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

  .trailer iframe {
    height: 300px;
  }
}
</style> 