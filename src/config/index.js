import axios from 'axios';

// Cria a instância do axios com a baseURL
const token = localStorage.getItem('waiter');
const api = axios.create({
  baseURL: 'http://localhost:3000', // Endpoint base da API
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
  (error) => {
    return Promise.reject(error); // Trata possíveis erros
  }
);

// Adiciona um interceptor de resposta para tratar tokens expirados
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove o token inválido do localStorage
      localStorage.removeItem('waiter');
      // Redireciona o usuário para a página de login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export default api;
