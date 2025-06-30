<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input
        type="email"
        v-model="email"
        placeholder="Email"
        required
      />
      <input
        type="password"
        v-model="password"
        placeholder="Senha"
        required
      />
      <button type="submit">Entrar</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Simulação de serviço de login
// No futuro, troque para seu serviço real
const fakeLogin = async (email, password) => {
  if (email === 'admin@admin.com' && password === '123456') {
    return { usuarioId: 42 }
  } else {
    throw new Error('Credenciais inválidas')
  }
}

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const login = async () => {
  error.value = ''
  try {
    const response = await fakeLogin(email.value, password.value)
    const usuarioId = response.usuarioId

    localStorage.setItem('usuarioId', usuarioId)
    router.push('/')
  } catch (err) {
    error.value = err.message || 'Erro ao fazer login'
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 4rem auto;
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 8px;
  color: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: var(--primary-dark);
}

.error {
  margin-top: 1rem;
  color: #ff4d4d;
  text-align: center;
}
</style>
