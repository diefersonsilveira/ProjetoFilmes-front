<template>
  <Transition name="modal">
    <div v-if="show" class="modal-backdrop" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="$emit('close')">×</button>

        <div v-if="movie" class="movie-details">
          <div class="overlay">
            <div class="content">
              <div class="poster">
                <img :src="posterUrl" :alt="movie.title" />
                <div class="rating">
                  <span class="rating-value">{{ movie.vote_average?.toFixed(1) || 'N/A' }}</span>
                  <span class="rating-max">/10</span>
                  <div class="rating-stars">⭐</div>
                </div>
              </div>
              <div class="info">
                <h1>{{ movie.title }}</h1>
                <div class="meta">
                  <span class="year">{{ new Date(movie.release_date).getFullYear() }}</span>
                  <span class="dot">•</span>
                  <span class="genres">{{ movie.genres.map(g => g.name).join(', ') }}</span>
                </div>
                <div class="section">
                  <h3>Sinopse</h3>
                  <p class="overview">{{ movie.overview }}</p>
                </div>

                <!-- Formulário de avaliação -->
                <div class="section">
                  <h3>Avaliar este filme</h3>
                  <form @submit.prevent="enviarAvaliacao" class="avaliacao-form">
                    <label>Nota (0 a 5):</label>
                    <input type="number" v-model.number="nota" min="0" max="5" step="0.5" required />

                    <label>Comentário:</label>
                    <textarea v-model="comentario" placeholder="Deixe seu comentário..." rows="3"></textarea>

                    <button type="submit" :disabled="isSending">
                      {{ isSending ? 'Enviando...' : 'Enviar Avaliação' }}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="loading">
          <div class="loader"></div>
          <span>Carregando...</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { getMovieDetails } from '../services/movieApi';
import { criarAvaliacao } from '../services/avaliacoesApi';

const props = defineProps({
  show: Boolean,
  movieId: Number
});

const emit = defineEmits(['close']);

const movie = ref(null);
const nota = ref(0);
const comentario = ref('');
const isSending = ref(false);

const posterUrl = computed(() => {
  if (movie.value?.posterPath) {
    return `https://image.tmdb.org/t/p/w500${movie.value.posterPath}`;
  } else {
    return 'https://via.placeholder.com/500x750?text=Sem+Imagem';
  }
});

const fetchMovieDetails = async () => {
  if (props.movieId) {
    movie.value = null;
    movie.value = await getMovieDetails(props.movieId);
    console.log('Detalhes carregados:', movie.value);
  }
};

const enviarAvaliacao = async () => {
  if (nota.value < 0 || nota.value > 5) {
    alert('A nota deve ser entre 0 e 5.');
    return;
  }
  isSending.value = true;
  try {
    await criarAvaliacao(movie.value.id, nota.value, comentario.value);
    alert('Avaliação enviada com sucesso!');
    nota.value = 0;
    comentario.value = '';
  } catch (error) {
    console.error(error);
    alert('Erro ao enviar avaliação. Verifique se está logado.');
  } finally {
    isSending.value = false;
  }
};

watch(() => props.movieId, fetchMovieDetails, { immediate: true });
</script>


<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
  overflow-y: auto;
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  background: #fff;
  color: #222;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(90deg);
}

.backdrop {
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  overflow: hidden;
}

.overlay {
  background: linear-gradient(to bottom, rgba(26, 26, 26, 0.8), #1a1a1a);
  padding: 2rem;
}

.content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  color: #fff;
}

.poster {
  position: relative;
}

.poster img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.rating {
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  background: #1a1a1a;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #19673B;
}

.rating-max {
  color: #666;
}

.rating-stars {
  color: #FFD700;
}

h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: #19673B;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #999;
  margin-bottom: 1rem;
}

.dot {
  color: #666;
}

.tagline {
  font-style: italic;
  color: #999;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.section {
  margin-bottom: 2rem;
}

.section h3 {
  color: #19673B;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.overview {
  line-height: 1.6;
  color: #ccc;
}

.cast-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.cast-item {
  background: rgba(255, 255, 255, 0.05);
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
  padding: 0.75rem;
  color: white;
  font-weight: 400;
}

.actor-name {
  font-weight: bold;
  margin-bottom: 0.25rem;
  color: white;
  font-weight: 400;
}

.character-name {
  font-size: 0.9rem;
  color: white;
  font-weight: 400;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: 8px;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.loading {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
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

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .modal-backdrop {
    padding: 0;
  }

  .modal-content {
    min-height: 100vh;
    border-radius: 0;
  }

  .content {
    grid-template-columns: 1fr;
  }

  .poster {
    max-width: 300px;
    margin: 0 auto;
  }

  h1 {
    font-size: 2rem;
  }

  .overlay {
    padding: 1rem;
  }
}

.avaliacao-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.avaliacao-form input,
.avaliacao-form textarea {
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.avaliacao-form button {
  background: #19673B;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.avaliacao-form button:hover:not(:disabled) {
  background: #145c32;
}

.avaliacao-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
