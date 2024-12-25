

const Cart = ({inquantity, image}) => {
    console.log(image)
    return (
        <div>
            <h2>Meu cart</h2>
            <img src={image} />
            <span>{inquantity}</span>
        </div>
    )
};

export default Cart;