<template>
  <div class="favoritos-page">
    <h2>Meus Favoritos</h2>

    <div v-if="isLoading" class="loading">
      Carregando favoritos...
    </div>

    <div v-else-if="favoritos.length === 0" class="empty">
      Você ainda não adicionou nenhum filme aos favoritos.
    </div>

    <div v-else class="movies-grid">
      <MovieCard
        v-for="filme in favoritos"
        :key="filme.filmeId"
        :movie="formatFilme(filme)"
        @click="openMovieModal"
      />
    </div>

    <MovieModal
      :show="!!selectedMovieId"
      :movie-id="selectedMovieId"
      @close="selectedMovieId = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MovieCard from '../components/MovieCard.vue';
import MovieModal from '../components/MovieModal.vue';
import { listarFavoritos } from '../services/favoritosApi';

const favoritos = ref([]);
const isLoading = ref(false);
const selectedMovieId = ref(null);

const carregarFavoritos = async () => {
  isLoading.value = true;
  try {
    const data = await listarFavoritos();
    favoritos.value = data || [];
  } catch (error) {
    console.error('Erro ao carregar favoritos:', error);
    favoritos.value = [];
  } finally {
    isLoading.value = false;
  }
};

const openMovieModal = (movie) => {
  selectedMovieId.value = movie.id;
};

const formatFilme = (favorito) => {
  // Ajusta para o formato esperado pelo MovieCard
  return {
    id: favorito.filmeId,
    title: favorito.titulo,
    posterUrl: favorito.posterUrl
      ? favorito.posterUrl
      : 'https://via.placeholder.com/500x750?text=Sem+Imagem',
    release_date: favorito.dataLancamento,
    vote_average: favorito.nota || 0,
    genres: [] // opcional, se quiser mapear
  };
};

onMounted(() => {
  carregarFavoritos();
});
</script>

<style scoped>
.favoritos-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #19673B;
  font-weight: 800;
}

.loading,
.empty {
  text-align: center;
  color: #555;
  font-size: 1.2rem;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
}
</style>
