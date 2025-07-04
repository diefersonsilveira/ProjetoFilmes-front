<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Cadastro</h2>
        <button @click="closeModal" class="close-button">×</button>
      </div>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Nome completo</label>
          <input
            id="name"
            type="text"
            v-model="name"
            required
            placeholder="Seu nome completo"
          >
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            v-model="email"
            required
            placeholder="Seu email"
          >
        </div>
        
        <div class="form-group">
          <label for="password">Senha</label>
          <input
            id="password"
            type="password"
            v-model="password"
            required
            placeholder="Sua senha"
          >
        </div>
        
        <button type="submit" class="register-submit" :disabled="isLoading">
          {{ isLoading ? 'Cadastrando...' : 'Cadastrar' }}
        </button>
        
        <div class="switch-mode">
          Já tem uma conta?
          <a href="#" @click.prevent="switchToLogin">
            Faça login
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { registerUser } from '../services/userApi'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'register', 'switch-to-login'])

const name = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)

const closeModal = () => {
  emit('close')
}

const switchToLogin = () => {
  emit('switch-to-login')
}


const handleRegister = async () => {
  if (!email.value || !password.value || !name.value) return;

  isLoading.value = true;

  try {
    const userPayload = {
      nomeCompleto: name.value,
      email: email.value,
      senha: password.value
    };

    const createdUser = await registerUser(userPayload);
    console.log('Usuário cadastrado com sucesso:', createdUser);

    emit('register', createdUser);

    email.value = '';
    password.value = '';
    name.value = '';

    closeModal();
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    alert('Erro ao cadastrar usuário. Verifique os dados e tente novamente.');
  } finally {
    isLoading.value = false;
  }
}

watch(() => props.show, (newValue) => {
  if (!newValue) {
    name.value = ''
    email.value = ''
    password.value = ''
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--surface);
  border-radius: 16px;
  padding: 0;
  width: 90%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--on-surface);
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--on-surface-variant);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--on-surface);
}

.register-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--on-surface);
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--on-surface);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  background: rgba(255, 255, 255, 0.08);
}

.form-group input::placeholder {
  color: var(--on-surface-variant);
}

.register-submit {
  width: 100%;
  padding: 0.875rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 1.5rem;
}

.register-submit:hover:not(:disabled) {
  background: var(--primary-dark);
}

.register-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch-mode {
  text-align: center;
  color: var(--on-surface-variant);
  font-size: 0.9rem;
}

.switch-mode a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  margin-left: 0.25rem;
}

.switch-mode a:hover {
  color: var(--primary-dark);
}

@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-header,
  .register-form {
    padding: 1rem;
  }
}
</style> 