import { MdShoppingBasket } from "react-icons/md";
import { Link } from "react-router-dom";

import logo from "../../assets/images/logo.svg";
import { useCart } from "../../hooks/useCart";
import { Cart, Container } from "./styles";
interface reduceAcumulator {
  [key: string]: number;
}

const Header = (): JSX.Element => {
  let { cart } = useCart();

  const cartAmount = cart.reduce<reduceAcumulator>((acumulator, product) => {
    if (!acumulator[product.id]) {
      acumulator[product.id] = 1;
    } else {
      acumulator[product.id]++;
    }
    return acumulator;
  }, {});
  const cartSize = Number(Object.keys(cartAmount).length);

  return (
    <Container>
      <Link to="/">
        <img src={logo} alt="Rocketshoes" />
      </Link>

      <Cart to="/cart">
        <div>
          <strong>Meu carrinho</strong>
          <span data-testid="cart-size">
            {cartSize === 1 ? `${cartSize} item` : `${cartSize} itens`}
          </span>
        </div>
        <MdShoppingBasket size={36} color="#FFF" />
      </Cart>
    </Container>
  );
};

export default Header;
