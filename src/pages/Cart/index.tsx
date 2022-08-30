import {
  MdAddCircleOutline,
  MdDelete,
  MdRemoveCircleOutline
} from "react-icons/md";

import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../utils/format";
import { Container, ProductTable, Total } from "./styles";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
  subtotal: string;
  priceFormatted: string;
}
// interface CartItemsAmount {
//   [key: number]: number;
// }

const Cart = (): JSX.Element => {
  // const { cart, removeProduct, updateProductAmount } = useCart();
  const { cart, removeProduct, updateProductAmount } = useCart();

  // const cartItemsAmount = cart.reduce((sumAmount, product) => {
  //   if (!sumAmount[product.id]) {
  //     sumAmount[product.id] = 1;
  //   } else {
  //     sumAmount[product.id]++;
  //   }
  //   return sumAmount;
  // }, {} as CartItemsAmount);

  const cartFormatted = cart.reduce((cartPerItems, product) => {
    cartPerItems[product.id] = {
      ...product,
      priceFormatted: formatPrice(product.price),
      amount: product.amount,
      subtotal: formatPrice(product.price * product.amount),
    };

    return cartPerItems;
  }, [] as Product[]);

  const total = cartFormatted.reduce((sumTotal, product) => {
    sumTotal += product.price * product.amount;
    return sumTotal;
  }, 0);

  function handleProductIncrement({id, amount}: Product) {
    const incrementProductAmount = {
      productId: id,
      amount: amount +1
    };
    updateProductAmount(incrementProductAmount);
  }

  function handleProductDecrement({id, amount}: Product) {
    const decrementProductAmount = {
      productId: id,
      amount: amount -1
    };
    updateProductAmount(decrementProductAmount);
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId);
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cartFormatted.map((product) => (
            <tr data-testid="product" key={product.id}>
              <td>
                <img src={product.image} alt={product.title} />
              </td>
              <td>
                <strong>{product.title}</strong>
                <span>{product.priceFormatted}</span>
              </td>
              <td>
                <div>
                  <button
                    type="button"
                    data-testid="decrement-product"
                    disabled={product.amount <= 1}
                    onClick={() => handleProductDecrement(product)}
                  >
                    <MdRemoveCircleOutline size={20} />
                  </button>
                  <input
                    type="text"
                    data-testid="product-amount"
                    readOnly
                    value={product.amount}
                  />
                  <button
                    type="button"
                    data-testid="increment-product"
                    onClick={() => handleProductIncrement(product)}
                  >
                    <MdAddCircleOutline size={20} />
                  </button>
                </div>
              </td>
              <td>
                <strong>{product.subtotal}</strong>
              </td>
              <td>
                <button
                  type="button"
                  data-testid="remove-product"
                  onClick={() => handleRemoveProduct(product.id)}
                >
                  <MdDelete size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{formatPrice(total)}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
