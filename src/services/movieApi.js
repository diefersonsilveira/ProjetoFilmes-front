import axios from 'axios'
import { getUsuarioId } from './user'

const BASE_URL = 'http://localhost:8080/api/filmes' // ajuste se backend estiver em outro host/porta

const api = axios.create({
  baseURL: BASE_URL
})

export const getPopularMovies = async () => {
  const usuarioId = getUsuarioId()
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

// Buscar filmes por gênero (substituindo pesquisa por query, adequa conforme sua UX)
export const getMoviesByGenre = async (generoId, usuarioId) => {
  try {
    const response = await api.get(`/genero/${generoId}`, {
      params: { usuarioId }
    })
    return {
      results: response.data,
      total_pages: 1 // ajuste conforme paginação futura
    }
  } catch (error) {
    console.error('Erro ao buscar filmes por gênero:', error)
    return { results: [], total_pages: 0 }
  }
}

// Buscar detalhes do filme (substituindo getMovieDetails)
export const getMovieDetails = async (movieId, usuarioId) => {
  try {
    const response = await api.get(`/${movieId}`, {
      params: { usuarioId }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error)
    return null
  }
}

export const searchMovies = async (query, usuarioId) => {
  try {
    const response = await api.get('/buscar', {
      params: { nome: query, usuarioId }
    })
    return {
      results: response.data,
      total_pages: 1 // ajuste conforme paginação futura
    }
  } catch (error) {
    console.error('Erro ao pesquisar filmes:', error)
    return { results: [], total_pages: 0 }
  }
}


