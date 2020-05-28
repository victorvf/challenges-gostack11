import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const productsStoraged = await AsyncStorage.getItem(
        '@GoMarketplace:products',
      );

      if (productsStoraged) {
        setProducts([...JSON.parse(productsStoraged)]);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const productExits = products.find(
        productCurrent => productCurrent.id === product.id,
      );

      if (productExits) {
        const productsQuantityUpdated = products.map(productCurrent =>
          productCurrent.id === product.id
            ? { ...product, quantity: productCurrent.quantity + 1 }
            : productCurrent,
        );

        setProducts(productsQuantityUpdated);
      } else {
        const newProducts = [...products, { ...product, quantity: 1 }];

        setProducts(newProducts);
      }

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const productsIncrementedQuantity = products.map(product =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product,
      );

      setProducts(productsIncrementedQuantity);

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const productsDecrementedQuantity = products.map(product => {
        if (product.id === id) {
          const productEqualZero =
            product.quantity === 0
              ? product
              : { ...product, quantity: product.quantity - 1 };

          return productEqualZero;
        }

        return product;
      });

      setProducts(productsDecrementedQuantity);

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
