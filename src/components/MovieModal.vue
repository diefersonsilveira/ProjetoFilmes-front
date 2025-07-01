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

                <!-- Lista de Avaliações -->
                <div class="section">
                  <h3>Avaliações</h3>
                  <div v-if="avaliacoes.length === 0" class="sem-avaliacoes">
                    Esse filme ainda não possui avaliações.
                  </div>
                  <div v-else class="avaliacoes-list">
                    <div v-for="avaliacao in avaliacoes" :key="avaliacao.id" class="avaliacao-item">
                      <div class="avaliacao-estrelas">
                        <span v-for="i in 5" :key="i" class="estrela" :class="{ filled: i <= Math.round(avaliacao.nota) }">★</span>
                      </div>
                      <p class="avaliacao-comentario">{{ avaliacao.comentario }}</p>
                      <p class="avaliacao-usuario">Usuário #{{ avaliacao.usuarioId }}</p>
                    </div>
                  </div>
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
import { criarAvaliacao, listarAvaliacoesPorFilme } from '../services/avaliacoesApi';

const props = defineProps({
  show: Boolean,
  movieId: Number
});

const movie = ref(null);
const nota = ref(0);
const comentario = ref('');
const isSending = ref(false);
const avaliacoes = ref([]);

const posterUrl = computed(() => {
  if (movie.value?.posterPath) {
    return `https://image.tmdb.org/t/p/w500${movie.value.posterPath}`;
  } else {
    return 'https://via.placeholder.com/500x750?text=Sem+Imagem';
  }
});

const fetchMovieDetails = async () => {
  if (!props.movieId) return;
  movie.value = null;
  movie.value = await getMovieDetails(props.movieId);
  console.log('Detalhes carregados:', movie.value);
};

const fetchAvaliacoes = async () => {
  if (!props.movieId) return;
  avaliacoes.value = await listarAvaliacoesPorFilme(props.movieId);
  console.log('Avaliações carregadas:', avaliacoes.value);
};

const enviarAvaliacao = async () => {
  if (nota.value < 0 || nota.value > 5) {
    alert('A nota deve ser entre 0 e 5.');
    return;
  }
  isSending.value = true;
  try {
    await criarAvaliacao(props.movieId, nota.value, comentario.value);
    alert('Avaliação enviada com sucesso!');
    nota.value = 0;
    comentario.value = '';
    await fetchAvaliacoes();
  } catch (error) {
    console.error(error);
    alert('Erro ao enviar avaliação. Verifique se está logado.');
  } finally {
    isSending.value = false;
  }
};

watch(
  () => props.show,
  (visible) => {
    if (visible && props.movieId) {
      fetchMovieDetails();
      fetchAvaliacoes();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.avaliacoes-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.avaliacao-item {
    background: #f0f0f0;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    color: #333;
    border: 1px solid #ddd;
}

.avaliacao-estrelas {
    font-size: 1.5rem;
}

.estrela {
    color: #ccc;
}

.estrela.filled {
    color: #FFD700;
}

.avaliacao-comentario {
    margin: 0.5rem 0;
    color: #555;
}

.avaliacao-usuario {
    font-size: 0.85rem;
    color: #777;
}

.sem-avaliacoes {
    color: #555;
    font-style: italic;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(240, 240, 240, 0.95);
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
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.1);
    border: none;
    color: #333;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: rgba(0, 0, 0, 0.15);
    transform: rotate(90deg);
}

.overlay {
    background: #fff;
    padding: 2rem;
    border-radius: 16px;
}

.content {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    color: #222;
}

.poster {
    position: relative;
}

.poster img {
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.rating {
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
    background: #19673B;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
}

.rating-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
}

.rating-max {
    color: #ddd;
}

.rating-stars {
    color: #FFD700;
}

h1 {
    font-size: 2.2rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #19673B;
}

.meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
    margin-bottom: 1rem;
}

.dot {
    color: #999;
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
    color: #333;
}

.loading {
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    color: #333;
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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
    background: #fff;
    color: #222;
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

