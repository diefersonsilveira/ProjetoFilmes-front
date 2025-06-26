import axios from 'axios'

const API_KEY = '3784dc019a9b414583dfadbbcfac496e'
const BASE_URL = 'https://api.themoviedb.org/3'

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR'
  }
})

export const getPopularMovies = async (page = 1) => {
  try {
    const response = await api.get('/movie/popular', {
      params: { page }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar filmes populares:', error)
    return { results: [], total_pages: 0 }
  }
}

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await api.get('/search/movie', {
      params: {
        query,
        page
      }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao pesquisar filmes:', error)
    return { results: [], total_pages: 0 }
  }
}

export const getMovieDetails = async (movieId) => {
  try {
    const [movieDetails, credits, videos] = await Promise.all([
      api.get(`/movie/${movieId}`),
      api.get(`/movie/${movieId}/credits`),
      api.get(`/movie/${movieId}/videos`)
    ])
    
    return {
      ...movieDetails.data,
      credits: credits.data,
      videos: videos.data
    }
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error)
    return null
  }
} 