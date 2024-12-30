import React, { useState, useEffect } from 'react';
import api from '../../config';
import Header from '../../components/Header';
import './styles.css';
import { Navigate, useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import CartIcon from '../../assets/cart.svg';
import Trash from '../../assets/trash.svg';
import FormatCurrency from '../../utils/FormatCurrency';
import Cart from '../../components/Cart';

const Products = () => {
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [tableString, setTableString] = useState('');
  const [tableExists, setTableExists] = useState(false);
  const [tableNumber, setTableNumber] = useState(null);
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [orderItem, setOrderItem] = useState([]); // Inicializado como array vazio
  const [loggedOut, setLoggedOut] = useState(false);
  const [orderData, setOrderData] = useState({});

  const navigate = useNavigate();


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
      const tableParseInt = parseInt(tableString, 10);
      const response = await api.post('/table', { number: tableParseInt });
      const tableId = response.data._id;
      localStorage.setItem('tableId', tableId);
      setTableExists(true);
      setTableNumber(tableParseInt);
    } catch (err) {
      setTableString('');
      console.error('Falha ao criar a mesa!', err);
      alert('Falha ao criar a mesa!');
    }
  };

  const handleAddItem = (product, quantity) => {
    setOrderItem((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId._id === product._id);
  
      const updatedItems = existingItem
        ? prevItems.map((item) =>
            item.productId._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...prevItems, { productId: product, quantity }];
  
      return updatedItems;
    });
  };
  

  const handleRemoveItem = (productId) => {
    setOrderItem((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.productId._id !== productId);
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
      setOrderItem([]); // Reseta orderItem após enviar
      setTableExists(false);
      setTableNumber(null)
      setTableString('')
      setOrderData({})
      localStorage.removeItem('tableId');
      return
    } catch (err) {
      console.error('Falha ao criar pedido', err.response.status);
      if (err.response.status === 401) {
        alert(err.response.data.error)
        return handleLogout();
      }
      alert('Faça pelo menos um pedido!');
    }
  };
  

  const handleClearTable = async () => {
    const tableId = localStorage.getItem('tableId');
    await api.delete(`/table/${tableId}`);
    localStorage.removeItem('tableId');
    setOrderItem([]); // Limpa o estado de orderItem
    setTableExists(false);
    setTableNumber(null);
    setTableString('');
  };

  const handleLogout = async () => {
    localStorage.removeItem('waiter');
    setLoggedOut(true); // Marca o estado como desconectado
  };

  if (loggedOut) {
    return <Navigate to="/login" replace />;
  }

  const calculateTotal = () => {
    return orderItem.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
  };

  return (
    <div>
      <Header user={user} onLogout={handleLogout} />
      {!tableExists ? (
        <div className="container-form-table">
          <form onSubmit={handleTableSubmit} className="form-table">
            <h2>Informar a mesa</h2>
            <Input
              id="tableString"
              name="tableString"
              type="number"
              placeholder="Número da mesa"
              max="500"
              valueProps={tableString}
              setState={setTableString}
              required
            />
            <button type="submit">Salvar</button>
          </form>
        </div>
      ) : (
        <>
          <div className="container-table">
            <h2>Mesa: {tableNumber}</h2>
            <button
              onClick={handleClearTable}
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
                    key={item.productId._id}
                    productItem={item.productId}
                    inquantity={item.quantity}
                    onRemoveItem={handleRemoveItem}
                  />
              ))}
              <div className="total">
                <h3>Total: {FormatCurrency(calculateTotal())}</h3>
                <button onClick={handleSubmitOrder} className='submit-order'>Enviar Pedido</button>
              </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
