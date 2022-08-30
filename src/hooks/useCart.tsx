import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({
    productId,
    amount,
  }: UpdateProductAmount) => Promise<void>;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }
    return [];
  });

  function updateLocalStorage(newCart: Product[]) {
    localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));
  }

  async function getProductStock(productId: number) {
    var stockResponse = await api.get<Stock>(`stock/${productId}`);
    var { amount: stock } = stockResponse.data;
    return stock || 0;
  }

  const addProduct = async (productId: number) => {
    try {
      const stock = await getProductStock(productId);
      const alreadyExists = cart.find((product) => product.id === productId);
      const amount = (alreadyExists ? alreadyExists.amount : 0) + 1;
      const newCart = [...cart];

      if (stock < amount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      if (alreadyExists) {
        const cartUpdated = newCart.map((product) => {
          if (product.id === productId) {
            product.amount = amount;
          }
          return product;
        });

        setCart(cartUpdated);
        updateLocalStorage(cartUpdated);
      } else {
        const productResponse = await api.get<Product>(`products/${productId}`);
        const product = productResponse.data;

        const newProduct = {
          ...product,
          amount,
        };

        setCart([...newCart, newProduct]);
        updateLocalStorage([...newCart, newProduct]);
      }
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    const productFound = cart.find((product) => product.id === productId);
    if (productFound) {
      const cartWithoutRemovedProduct = cart.filter(
        (product) => product.id !== productId
      );
      setCart([...cartWithoutRemovedProduct]);
      updateLocalStorage([...cartWithoutRemovedProduct]);
    } else {
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if (amount <= 0) {
        toast.error("Quantidade solicitada é inválida");
        return;
      }
      const findProductInCart = cart.findIndex(
        (product) => product.id === productId
      );

      if (!findProductInCart) {
        toast.error("O produto informado não está no carrinho");
        return;
      }

      const stock = await getProductStock(productId);

      if (amount > stock) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      } else {
        const newCart = cart.map((product) => {
          if (product.id === productId) {
            product.amount = amount;
          }
          return product;
        });

        setCart(newCart);
        updateLocalStorage(newCart);
      }
    } catch {
      toast.error("Erro na alteração de quantidade do produto");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook
export function useCart(): CartContextData {
  const context = useContext(CartContext);
  return context;
}
