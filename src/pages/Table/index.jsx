import React, { useState, useEffect } from 'react';
import api from '../../config';
import Header from '../../components/Header';
import './styles.css';
import { Navigate, useNavigate } from 'react-router-dom';
import socketIo from 'socket.io-client';
import Content from '../../components/Content';
import ArrowLeft from '../../assets/arrow-left.svg';

const Table = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({});
  const [loggedOut, setLoggedOut] = useState(false);

  const navigate = useNavigate();

  const fetchOrdersChecked = async () => {
    const { data } = await api.get('/order/checked');
    setOrders(data);
  };

  useEffect(() => {
  const fetchUser = async () => {
    const { data } = await api.get('/user');
    setUser(data);
  };
  fetchUser();

  const socket = socketIo('http://10.0.0.110:3000', {
    transports: ['websocket'],  // Certifique-se de que está usando WebSocket
  });

    // Busca inicial dos pedidos
    
    fetchOrdersChecked();

    // Atualiza pedidos em tempo real
    socket.on('order@checked', (updatedOrder) => {
      setOrders((prevState) => {
        // Verifica se o pedido pertence ao usuário autenticado
        if (updatedOrder.userId._id !== user._id) {
          return prevState; // Se não pertencer, mantém o estado inalterado
        }
    
        if (updatedOrder.status === 'pending') {
          // Remove o pedido se o status for "pending"
          return prevState.filter((order) => order._id !== updatedOrder._id);
        } else if (updatedOrder.status === 'completed') {
          // Adiciona ou atualiza o pedido se o status for "completed"
          const orderExists = prevState.some((order) => order._id === updatedOrder._id);
          if (orderExists) {
            // Atualiza o pedido existente
            return prevState.map((order) =>
              order._id === updatedOrder._id ? updatedOrder : order
            );
          } else {
            // Adiciona um novo pedido
            return [...prevState, updatedOrder];
          }
        }
    
        return prevState; // Retorna o estado sem mudanças por segurança
      });
      console.log('Pedidos atualizados:', updatedOrder);
    });

    socket.on('order@deleted', (order) => {
      console.log('Evento recebido:', order);
    
      if (!order || !order._id) {
        console.warn('Pedido inválido recebido:', order);
        return;
      }
    
      setOrders((prevState) => {
        const validOrders = prevState.filter((o) => o && o._id); // Remove objetos inválidos
        return validOrders.filter((o) => o._id !== order._id);
      });
    
      console.log('Pedido removido com sucesso:', order);
    });

  }, [user._id]);

  const handleLogout = async () => {
    localStorage.removeItem('waiter');
    setLoggedOut(true); // Marca o estado como desconectado
  };

  if (loggedOut) {
    return <Navigate to="/login" replace />;
  }

  const handleRedirectOrder = () => {
    navigate('/order');
  };

  return (
      <>
        <Header user={user} onLogout={handleLogout} />
        <div>
            <div className='flex-title'>
              <img src={ArrowLeft} onClick={handleRedirectOrder}/>
              <h2>Pedidos completos</h2>
            </div>
            <div className="container">
              {orders.map((order) => (
                <Content key={order._id} onFetchTable={fetchOrdersChecked} order={order}/>
              ))}
            </div>
        </div>
      </>
  );
};

export default Table;
