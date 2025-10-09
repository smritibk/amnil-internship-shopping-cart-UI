import { createContext, useContext, useEffect, useState } from "react";
import { getCartItems } from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user || user.role !== "customer") {
        setCartItems([]);
        return;
      }

      try {
        const response = await getCartItems();
        console.log(response.cartItems);

        if (response.cartItems) {
          const items = response.cartItems || [];
          setCartItems(items);

        
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        // setError("Error loading cart items");
      }
    };
    fetchCartItems();
  }, [user]);

  //   Calculate total cart count
            const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
