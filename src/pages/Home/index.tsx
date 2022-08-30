import { useEffect, useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { useCart } from "../../hooks/useCart";
import { api } from "../../services/api";
import { formatPrice } from "../../utils/format";

import { ProductList } from "./styles";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

// interface CartItemsAmount {
//   [key: number]: number;
// }

interface ProductFromAPI {
  id: number;
  title: string;
  price: string;
  image: string;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  useEffect(() => {
    async function loadProducts() {
      const { data } = await api.get("/products");
      data.forEach((item: ProductFromAPI, index: number) => {
        var priceFormatted = formatPrice(Number(item.price));
        data[index].priceFormatted = priceFormatted;
      });

      setProducts(data);
    }

    loadProducts();
  }, []);

  async function handleAddProduct(id: number) {
    await addProduct(id);
  }

  function amountProductLabel(productId: number) {
    const findCartItem = cart.find((product) => product.id === productId);
    return findCartItem ? findCartItem.amount : 0;
  }
  return (
    <ProductList>
      {products.map((product) => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(product.id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {amountProductLabel(product.id)}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

export default Home;
