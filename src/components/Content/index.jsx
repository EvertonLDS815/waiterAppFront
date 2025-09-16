import api from "../../config";
import FormatCurrency from "../../utils/FormatCurrency";
import Trash from '../../assets/trash.svg';
import CheckTable from '../../assets/check-table.png'


const Content = ({order, onFetchTable}) => {

    const handleDeleteOrder = async (id) => {
        await api.delete(`/order/${id}`)
        onFetchTable();
    }

    const handleCheckOrder = async (id) => {
        await api.patch(`/order/${id}`)
        return onFetchTable();
    }

    const calculateTotal = () => {
        return order.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
    // console.log(order)
    };

    return (
            <div key={order._id} className='content-order'>
              <input type="checkbox" id={order._id} className='trigger-input' />
              <div className='table-wrapper'>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <label className='label-flex' htmlFor={order._id}>
                    <h3>Mesa {order.tableId.number}</h3>
                    <p>{order.userId.email}</p>
                    <span>{order.items.length} {order.items.length > 1? 'itens' : 'item'}</span>
                    {order.status === 'completed' && (
                      <img src={CheckTable} />
                    )}
                  </label>
                  <img src={Trash} onClick={() => handleDeleteOrder(order._id)}/>
              </div>
              <div className='opacity-container'>
                {order.items.map(({productId, quantity}) => {
                
                  return (
                    <div key={productId._id} className='faq-content'>
                        <img src={`${productId.imageURL}`} />
                        <div>
                          <h4>{quantity}x {productId.name}</h4>
                          <span>{FormatCurrency(productId.price)}</span>
                        </div>
                    </div>
                    )})}
                        <div className="total-table">
                          <h3>Total: {FormatCurrency(calculateTotal())}</h3>
                          {order.status === 'pending' && (
                            <button onClick={() => handleCheckOrder(order._id)}>Check</button>
                          )}

                          {order.status === 'completed' && (
                            <button 
                                onClick={() => handleCheckOrder(order._id)}
                                style={{backgroundColor: 'red'}}>
                              Uncheck
                            </button>
                            )}
                        </div>
                  </div>
                </div>
              </div>
    )
}

export default Content;