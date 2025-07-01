import axios from 'axios';
import { getUsuarioId } from './user';

const API_URL = 'http://localhost:8080/api';
const FAVORITOS_CACHE_KEY = 'favoritosUsuario';

export const adicionarFavorito = async (filmeId) => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) {
        throw new Error('Usuário não está logado.');
    }

    const cached = localStorage.getItem(FAVORITOS_CACHE_KEY);
    let favoritos = [];
    if (cached) {
        try {
            favoritos = JSON.parse(cached);
        } catch {
            favoritos = [];
        }
    }

    const jaFavoritado = favoritos.some(f => f.id === filmeId || f.filmeId === filmeId);
    if (jaFavoritado) {
        console.log('Filme já está nos favoritos.');
        return;
    }

    const response = await axios.post(`${API_URL}/favoritos`, null, {
        params: { usuarioId, filmeId }
    });

    const novoFavorito = response.data;
    favoritos.push(novoFavorito);
    localStorage.setItem(FAVORITOS_CACHE_KEY, JSON.stringify(favoritos));

    return novoFavorito;
};

export const removerFavorito = async (filmeId) => {
    const usuarioId = getUsuarioId();
    await axios.delete(`${API_URL}/favoritos`, {
        params: { usuarioId, filmeId }
    });

    const cached = localStorage.getItem(FAVORITOS_CACHE_KEY);
    if (cached) {
        try {
            let favoritos = JSON.parse(cached);
            favoritos = favoritos.filter(f => f.id !== filmeId && f.filmeId !== filmeId);
            localStorage.setItem(FAVORITOS_CACHE_KEY, JSON.stringify(favoritos));
        } catch {
            console.log('Erro no cache.')
        }
    }
};

export const listarFavoritos = async () => {
    const usuarioId = getUsuarioId();
    const response = await axios.get(`${API_URL}/favoritos/${usuarioId}`);
    const favoritos = response.data || [];

    localStorage.setItem(FAVORITOS_CACHE_KEY, JSON.stringify(favoritos));

    return favoritos;
};
