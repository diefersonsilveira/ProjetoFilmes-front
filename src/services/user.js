export const saveUsuario = (id, nome) => {
  localStorage.setItem('usuarioId', id);
  localStorage.setItem('usuarioNome', nome);
};

export const getUsuarioId = () => {
  return Number(localStorage.getItem('usuarioId'));
};

export const getUsuarioNome = () => {
  return localStorage.getItem('usuarioNome');
};

export const clearUsuario = () => {
  localStorage.removeItem('usuarioId');
  localStorage.removeItem('usuarioNome');
};
