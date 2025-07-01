<template>
  <div class="movie-card">
    <div class="poster-container" @click="$emit('click', movie)">
      <img
        :src="posterUrl"
        :alt="movie.title"
        class="movie-poster"
      >
      <div class="overlay">
        <div class="top-bar">
          <div class="rating">
            <span class="star">⭐</span>
            <span class="value">{{ movie.vote_average?.toFixed(1) || 'N/A' }}</span>
          </div>
          <button
            class="fav-icon-btn"
            @click.stop="toggleFavorito"
            :aria-label="isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
          >
            <svg
              v-if="isFavorito"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="red"
              width="24"
              height="24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                       2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09
                       C13.09 3.81 14.76 3 16.5 3
                       19.58 3 22 5.42 22 8.5
                       c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              width="24"
              height="24"
            >
              <path d="M20.84 4.61c-1.54-1.34-3.77-1.34-5.31 0L12 7.09
                       l-3.53-2.48c-1.54-1.34-3.77-1.34-5.31 0-1.88
                       1.64-1.88 4.3 0 5.94L12 21.35l8.84-10.8
                       c1.88-1.64 1.88-4.3 0-5.94z"/>
            </svg>
          </button>
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
import { ref, computed, onMounted } from 'vue';
import { adicionarFavorito, removerFavorito, listarFavoritos } from '../services/favoritosApi';

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
});

const isFavorito = ref(false);

const posterUrl = computed(() => {
  return props.movie.posterUrl
    ? props.movie.posterUrl
    : 'https://via.placeholder.com/500x750?text=Sem+Imagem';
});

const formatDate = (date) => {
  if (!date) return 'Data não disponível';
  return new Date(date).toLocaleDateString('pt-BR');
};

const verificarSeFavorito = async () => {
  try {
    const favoritos = await listarFavoritos();
    isFavorito.value = favoritos.some(fav => fav.filmeId === props.movie.id);
  } catch (error) {
    console.error('Erro ao verificar favoritos:', error);
  }
};

const toggleFavorito = async () => {
  try {
    if (isFavorito.value) {
      await removerFavorito(props.movie.id);
      isFavorito.value = false;
    } else {
      await adicionarFavorito(props.movie.id);
      isFavorito.value = true;
    }
  } catch (error) {
    console.error('Erro ao alternar favorito:', error);
  }
};

onMounted(() => {
  verificarSeFavorito();
});
</script>

<style scoped>
.movie-card {
  background: #fff;
  color: #222;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  box-shadow: 0 4px 12px rgba(25, 103, 59, 0.07);
}

.movie-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
}

.poster-container {
  position: relative;
  overflow: hidden;
  cursor: pointer;
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

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating {
  background: rgba(25, 103, 59, 0.85);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.star {
  color: #FFD700;
}

.value {
  color: #fff;
  font-weight: bold;
}

.fav-icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.details-btn {
  background: #19673B;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.details-btn:hover {
  background: #145c32;
}

.movie-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.movie-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #222;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-release {
  color: #999;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .movie-poster {
    height: 280px;
  }
}
</style>
