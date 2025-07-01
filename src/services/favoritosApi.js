import axios from 'axios';
import { getUsuarioId } from './user';

const API_URL = 'http://localhost:8080/api';

export const adicionarFavorito = async (filmeId) => {
    const usuarioId = getUsuarioId();
    const response = await axios.post(`${API_URL}/favoritos`, null, {
        params: { usuarioId, filmeId }
    });
    return response.data;
};

export const removerFavorito = async (filmeId) => {
    const usuarioId = getUsuarioId();
    await axios.delete(`${API_URL}/favoritos`, {
        params: { usuarioId, filmeId }
    });
};

export const listarFavoritos = async () => {
    const usuarioId = getUsuarioId();
    const response = await axios.get(`${API_URL}/favoritos/${usuarioId}`);
    return response.data; // array de favoritos
};
