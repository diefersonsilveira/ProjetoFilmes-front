import axios from 'axios';
import { getUsuarioId } from './user';

const BASE_URL = 'http://localhost:8080/api/avaliacoes';

export const criarAvaliacao = async (filmeId, nota, comentario) => {
  const usuarioId = getUsuarioId();
  if (!usuarioId) throw new Error('Usuário não está logado.');

  const body = {
    usuarioId,
    filmeId,
    nota,
    comentario
  };

  const response = await axios.post(BASE_URL, body);
  return response.data;
};

export const listarAvaliacoesPorFilme = async (filmeId) => {
    try {
        const response = await axios.get(`${BASE_URL}/filme/${filmeId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
        return [];
    }
};
