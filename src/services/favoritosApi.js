import axios from 'axios';
import { getUsuarioId } from './user';

const API_URL = 'http://localhost:8080/api';
const FAVORITOS_CACHE_KEY = 'favoritosUsuario';

/**
 * Adiciona um filme aos favoritos do usuário de forma segura, consultando a API antes.
 */
export const adicionarFavorito = async (filmeId) => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) {
        throw new Error('Usuário não está logado.');
    }

    // Buscar favoritos da API para confirmar se já existe
    const favoritosAtuais = await listarFavoritos();
    const jaFavoritado = favoritosAtuais.some(f => f.filmeId === filmeId || f.id === filmeId);
    if (jaFavoritado) {
        console.log('Filme já está nos favoritos (API).');
        return;
    }

    // Enviar para a API
    const response = await axios.post(`${API_URL}/favoritos`, null, {
        params: { usuarioId, filmeId }
    });

    // Atualizar o cache local após adicionar
    const favoritosAtualizados = await listarFavoritos();
    localStorage.setItem(FAVORITOS_CACHE_KEY, JSON.stringify(favoritosAtualizados));

    return response.data;
};

/**
 * Remove um filme dos favoritos do usuário na API e atualiza o cache local.
 */
export const removerFavorito = async (filmeId) => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) {
        throw new Error('Usuário não está logado.');
    }

    await axios.delete(`${API_URL}/favoritos`, {
        params: { usuarioId, filmeId }
    });

    // Atualizar o cache local após remoção
    const favoritosAtualizados = await listarFavoritos();
    localStorage.setItem(FAVORITOS_CACHE_KEY, JSON.stringify(favoritosAtualizados));
};

/**
 * Lista os favoritos do usuário pela API, atualizando o cache local.
 */
export const listarFavoritos = async () => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) {
        return [];
    }

    const response = await axios.get(`${API_URL}/favoritos/${usuarioId}`);
    const favoritos = response.data || [];

    localStorage.setItem(FAVORITOS_CACHE_KEY, JSON.stringify(favoritos));
    return favoritos;
};
