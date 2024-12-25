import React, { useState, useEffect } from 'react';
import api from '../../config';
import Header from '../../components/Header';
import './styles.css';
import { Navigate } from 'react-router-dom';
import Input from '../../components/Input';
import CartIcon from '../../assets/cart.svg';
import Trash from '../../assets/trash.svg';
import FormatCurrency from '../../utils/FormatCurrency';
import Cart from '../../components/Cart';

const Products = () => {
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [tableName, setTableName] = useState('');
  const [tableExists, setTableExists] = useState(false);
  const [tableNumber, setTableNumber] = useState(null);
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [orderItem, setOrderItem] = useState([]); // Inicializado como array vazio
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    const tableId = localStorage.getItem('tableId');
    if (tableId) {
      setTableExists(true);
      fetchTableDetails(tableId);
    }

    const fetchUser = async () => {
      const { data } = await api.get('/user');
      setUser(data);
    };
    fetchUser();

    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products');
      }
    };
    fetchProducts();
  }, []);

  const fetchTableDetails = async (tableId) => {
    try {
      const { data: { number } } = await api.get(`/table/${tableId}`);
      setTableNumber(number);
    } catch (err) {
      console.error('Failed to fetch table details', err);
    }
  };

  const handleTableSubmit = async (e) => {
    e.preventDefault();
    const existingTableId = localStorage.getItem('tableId');
    if (existingTableId) {
      setTableExists(true);
      setTableNumber(tableNumber);
      return;
    }

    try {
      const tableNumber = parseInt(tableName, 10);
      const response = await api.post('/table', { number: tableNumber });
      const tableId = response.data._id;
      localStorage.setItem('tableId', tableId);
      setTableExists(true);
      setTableNumber(tableNumber);
    } catch (err) {
      console.error('Failed to create table', err);
      alert('Failed to create table');
    }
  };

  const handleAddItem = (product, quantity) => {
    setOrderItem((prevItems) => {
      const existingItem = prevItems.find((item) => item.product._id === product._id);

      const updatedItems = existingItem
        ? prevItems.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...prevItems, { product, quantity }];

      return updatedItems;
    });
  };

  const handleRemoveItem = (productId) => {
    setOrderItem((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.product._id !== productId);
      return updatedItems;
    });
  };

  const handleSubmitOrder = async () => {
    const tableId = localStorage.getItem('tableId');
    if (!tableId) {
      alert('Escolha uma mesa!!!');
      return;
    }

    if (!user._id) {
      console.error('No user ID found');
      return;
    }

    const orderData = {
      tableId,
      userId: user._id,
      items: orderItem,
    };

    try {
      await api.post('/order', orderData);
      setOrderItem([]); // Reseta orderItem
    } catch (err) {
      console.error('Failed to create order', err);
    }
  };

  const handleClearTable = async () => {
    const tableId = localStorage.getItem('tableId');
    await api.delete(`/table/${tableId}`);
    localStorage.removeItem('tableId');
    setOrderItem([]); // Limpa o estado de orderItem
    setTableExists(false);
    setTableNumber(null);
    setTableName('');
  };

  const handleLogout = async () => {
    localStorage.removeItem('waiter');
    setLoggedOut(true); // Marca o estado como desconectado
  };

  if (loggedOut) {
    return <Navigate to="/login" replace />;
  }

  const calculateTotal = () => {
    return orderItem.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

  return (
    <div>
      <Header user={user} onLogout={handleLogout} />
      {!tableExists ? (
        <div className="container-form-table">
          <form onSubmit={handleTableSubmit} className="form-table">
            <h2>Informar a mesa</h2>
            <Input
              id="tableName"
              name="tableName"
              type="text"
              placeholder="Número da mesa"
              valueProps={tableName}
              setState={setTableName}
              required
            />
            <button type="submit">Salvar</button>
          </form>
        </div>
      ) : (
        <>
          <div className="container-table">
            <h2>Número da mesa: {tableNumber}</h2>
            <button
              onClick={handleClearTable}
              style={{ marginLeft: "10px", color: "red" }}
            >
              <img title="Deletar Pedido" src={Trash} />
            </button>
          </div>
          <div>
            <ul className="list">
              {products.map((product) => {
                return (
                <li key={product._id} className="list-item-products">
                  <h3>{product.name}</h3>
                  <img
                    className="image-product"
                    src={`http://localhost:3000${product.imageURL}`}
                  />
                  <div className="contents">
                    <h4>{FormatCurrency(product.price)}</h4>
                    <button
                      onClick={() =>
                        handleAddItem(product, 1) // Adiciona a quantidade do produto
                      }
                    >
                      <img src={CartIcon} />
                    </button>
                  </div>
                </li>
              )})}
            </ul>
            {orderItem.length > 0 &&
              orderItem.map((item) => (
                  <Cart
                    key={item.product._id}
                    productItem={item.product}
                    inquantity={item.quantity}
                    onRemoveItem={handleRemoveItem}
                  />
              ))}
              <div className="total">
                <h3>Total: {FormatCurrency(calculateTotal())}</h3>
                <button onClick={handleSubmitOrder}>Submit Order</button>
              </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
