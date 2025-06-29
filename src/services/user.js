export function getUsuarioId() {
  const usuarioId = localStorage.getItem('usuarioId')
  return usuarioId ? Number(usuarioId) : 1
}
