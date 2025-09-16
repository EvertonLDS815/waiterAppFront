import FormatCurrency from "../../utils/FormatCurrency";
import Trash from '../../assets/trash.svg';

const Cart = ({ productItem, inquantity, onRemoveItem }) => (
    <div className="cart-item">
      <img src={`${productItem.imageURL}`} alt={productItem.name} />
      <div>
        <h4>{inquantity} x {productItem.name}</h4>
        <strong>{FormatCurrency(productItem.price)}</strong>
      </div>
      <button className="remove-item" onClick={() => onRemoveItem(productItem._id)}>
        <img title="Deletar Pedido" src={Trash} />
      </button>
    </div>
  );

export default Cart