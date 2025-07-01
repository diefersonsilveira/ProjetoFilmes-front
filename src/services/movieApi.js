import axios from 'axios'
import { getUsuarioId } from './user'

const BASE_URL = 'http://localhost:8080/api/filmes' // ajuste se backend estiver em outro host/porta

const api = axios.create({
  baseURL: BASE_URL
})

export const getPopularMovies = async () => {
  const usuarioId = getUsuarioId() ?? 1
  try {
    const response = await api.get('/populares', {
      params: { usuarioId }
    })
    return {
      results: response.data,
      total_pages: 1
    }
  } catch (error) {
    console.error('Erro ao buscar filmes populares:', error)
    return { results: [], total_pages: 0 }
  }
}

// Buscar filmes por gênero
export const getMoviesByGenre = async (generoId, usuarioId) => {
  usuarioId = usuarioId ?? 1
  try {
    const response = await api.get(`/genero/${generoId}`, {
      params: { usuarioId }
    })
    return {
      results: response.data,
      total_pages: 1
    }
  } catch (error) {
    console.error('Erro ao buscar filmes por gênero:', error)
    return { results: [], total_pages: 0 }
  }
}

export const getMovieDetails = async (movieId, usuarioId) => {
  usuarioId = usuarioId ?? 1;
  try {
    const response = await api.get(`/${movieId}`, {
      params: { usuarioId }
    });
    const movie = response.data;
    movie.posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path.startsWith('/') ? '' : '/'}${movie.poster_path}`
      : 'https://via.placeholder.com/500x750?text=Sem+Imagem';
    return movie;
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error);
    return null;
  }
};


// Pesquisar filmes por nome
export const searchMovies = async (query, usuarioId) => {
  usuarioId = usuarioId ?? 1
  try {
    const response = await api.get('/buscar', {
      params: { nome: query, usuarioId }
    })
    return {
      results: response.data,
      total_pages: 1
    }
  } catch (error) {
    console.error('Erro ao pesquisar filmes:', error)
    return { results: [], total_pages: 0 }
  }
}
