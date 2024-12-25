import FormatCurrency from "../../utils/FormatCurrency";

const Cart = ({ productItem, inquantity }) => (
    <div className="cart-item">
      <img src={`http://localhost:3000${productItem.imageURL}`} alt={productItem.name} />
      <div>
        <h4>{inquantity} x {productItem.name}</h4>
        <strong>{FormatCurrency(productItem.price)}</strong>
      </div>
    </div>
  );

export default Cart