// Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import api from '../../config';
import Input from '../../components/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      
      console.log(response.data);
      localStorage.setItem('waiter', response.data.token);
      return navigate('/order');
    } catch (err) {
      console.error(err)
      return setError('Email e/ou senha inválidos!');
    }
  };

  return (
    <div className='container-login'>
      <form onSubmit={handleSubmit} className='login-form'>
        <h1>Login</h1>
        <Input type="email" placeholder="Email" valueProps={email} setState={setEmail}/>
        <Input type="password" placeholder="Senha" valueProps={password} setState={setPassword} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;