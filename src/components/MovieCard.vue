<template>
  <div class="movie-card" @click="$emit('click', movie)">
    <div class="poster-container">
      <img 
        :src="posterUrl" 
        :alt="movie.title"
        class="movie-poster"
      >
      <div class="overlay">
        <div class="rating">
          <span class="star">⭐</span>
          <span class="value">{{ movie.vote_average?.toFixed(1) || 'N/A' }}</span>
        </div>
        <button class="details-btn">Ver Detalhes</button>
      </div>
    </div>
    <div class="movie-info">
      <h3>{{ movie.title }}</h3>
      <p class="movie-release">{{ formatDate(movie.release_date) }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const posterUrl = computed(() => {
  return props.movie.posterUrl
    ? props.movie.posterUrl
    : 'https://via.placeholder.com/500x750?text=Sem+Imagem'
})

const formatDate = (date) => {
  if (!date) return 'Data não disponível'
  return new Date(date).toLocaleDateString('pt-BR')
}

const genres = computed(() => {
  if (!props.movie.genres || props.movie.genres.length === 0) return 'Gêneros não informados'
  return props.movie.genres.map(g => g.name).join(', ')
})
</script>

<style scoped>
.movie-card {
  background: #fff;
  color: #222;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(25, 103, 59, 0.07);
}

.movie-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
}

.poster-container {
  position: relative;
  overflow: hidden;
}

.movie-poster {
  width: 100%;
  height: 360px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.movie-card:hover .movie-poster {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(26, 26, 26, 0.2),
    rgba(26, 26, 26, 0.9)
  );
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-card:hover .overlay {
  opacity: 1;
}

.rating {
  background: rgba(25, 103, 59, 0.85);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-start;
}

.star {
  color: #FFD700;
}

.value {
  color: #fff;
  font-weight: bold;
}

.details-btn {
  background: #19673B;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.details-btn:hover {
  background: #19673B;
}

.movie-info {
  padding: 1rem;
}

.movie-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #222;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; 
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word; 
  line-height: 1.2em; 
  max-height: calc(1.2em * 2); 
}

.movie-release {
  color: #999;
  font-size: 0.9rem;
  margin: 0;
  font-weight: 400;
}

.movie-genres {
  color: #bbb;
  font-size: 0.85rem;
  margin: 0.3rem 0 0 0;
}

@media (max-width: 768px) {
  .movie-poster {
    height: 280px;
  }
  .overlay {
    opacity: 1;
    background: linear-gradient(
      to bottom,
      rgba(26, 26, 26, 0),
      rgba(26, 26, 26, 0.9)
    );
  }
  .rating {
    font-size: 0.9rem;
  }
  .details-btn {
    font-size: 0.9rem;
    padding: 0.6rem 1.2rem;
  }
}
</style>
