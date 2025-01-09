import axios from 'axios';
import { redirectToLogin } from '../utils/redirect';

// Cria a instância do axios com a baseURL
const token = localStorage.getItem('waiter');
const api = axios.create({
  baseURL: 'http://10.0.0.110:3000/',
  headers: { Authorization: `Bearer ${token}` },
});

// Adiciona um interceptor para incluir o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('waiter'); // Busca o token do localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Adiciona o token ao cabeçalho
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Adiciona um interceptor de resposta para tratar tokens expirados
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove o token inválido do localStorage
      localStorage.removeItem('waiter');
      // Redireciona para a página de login
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

export default api;
