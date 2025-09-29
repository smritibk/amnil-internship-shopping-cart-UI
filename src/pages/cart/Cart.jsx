import { useState, useEffect } from "react";
import { getProductById } from "../../services/productService";
import CartItem from "./CartCard";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { placeOrder } from "../../services/orderService";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  //   const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const { cartItems, setCartItems, totalItems } = useCart();
  const navigate = useNavigate();

console.log(cartItems)

  useEffect(() => {
    const fetchTotal = async () => {
      let total = 0;

      for (const item of cartItems) {
        try {
          const data = await getProductById(item.productId);
          total += data.product.price * item.quantity;
        } catch (err) {
          console.error("Error fetching product price:", err);
        }
      }

      setCartTotal(total);
    };

    if (cartItems.length > 0) {
      fetchTotal();
    } else {
      setCartTotal(0);
    }
  }, [cartItems]);

  //   const fetchCartItems = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await getCartItems();
  //       console.log(response.cartItems);

  //       if (response.cartItems) {
  //         const items = response.cartItems || [];
  //         setCartItems(items);

  //         // Calculate total cart count
  //         const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  //         setCartCount(totalItems);
  //       } else {
  //         setError("Failed to load cart items");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching cart:", error);
  //       setError("Error loading cart items");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchCartItems();
  //   }, []);

  const handleQuantityUpdate = (itemId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );

    // Update cart count
    // const totalItems = cartItems.reduce(
    //   (sum, item) => sum + (item.id === itemId ? newQuantity : item.quantity),
    //   0
    // );
    // setCartCount(totalItems);
  };

  const handleItemRemove = (itemId) => {
    // const removedItem = cartItems.find((item) => item.id === itemId);
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));

    // Update cart count
    // setCartCount((prevCount) => prevCount - (removedItem?.quantity || 0));
  };

  const place = async () => {
    try {
      const response = await placeOrder({paymentMethod:"cod"});
      if (response.message) {
        // Clear cart on successful order placement
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  // Navigation Component integrated within CartPage
  const CartNavigation = () => (
    <nav className="bg-white shadow-lg mb-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link
            to="/"
            className="text-xl font-bold text-gray-800 hover:text-blue-600"
          >
            🏪 MyStore
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/products"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              📦 Products
            </Link>

            <div className="relative">
              <Link
                to="/cart"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center space-x-2"
              >
                <span>🛒 Cart</span>
                {totalItems > 0 && (
                  <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>

            <Link
              to="/profile"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              👤 Account
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* <CartNavigation /> */}
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  //   if (error) {
  //     return (
  //       <div className="min-h-screen bg-gray-50">
  //         {/* <CartNavigation /> */}
  //         <div className="flex items-center justify-center py-20">
  //           <div className="text-center">
  //             <div className="text-red-600 text-4xl mb-4">❌</div>
  //             <div className="text-red-600 text-lg mb-4">{error}</div>
  //             <button
  //               onClick={fetchCartItems}
  //               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
  //             >
  //               Try Again
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <CartNavigation /> */}

      <div className="container mx-auto px-4 mt-8 max-w-6xl pt-4 pb-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Shopping Cart
              </h1>
              <p className="text-gray-600">
                {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
              </p>
            </div>

            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                to="/products"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                Continue Shopping
              </Link>

              {cartItems.length > 0 && (
                <button
                  onClick={() => {
                    place();
                    navigate("/order", { state: {cartItems} });
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold transition-colors"
                >
                  Place Order
                </button>
              )}
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="text-gray-400 text-8xl mb-6">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start
              shopping to discover amazing products!
            </p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Cart Items
                  </h2>
                  <button
                    // onClick={fetchCartItems}
                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center space-x-1"
                  >
                    <span>🔄</span>
                    <span>Refresh Cart</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdate={handleQuantityUpdate}
                      onRemove={handleItemRemove}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-6 border-b pb-4">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">Items ({totalItems}):</span>
                    <span className="font-semibold">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>

                  <hr className="my-4" />

                  {/* <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">
                      $
                      {(
                        calculateTotal() +
                        (calculateTotal() > 50 ? 0 : 5.99) +
                        calculateTotal() * 0.1
                      ).toFixed(2)}
                    </span>
                  </div> */}
                </div>

                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-3 text-lg">
                  Proceed to Checkout
                </button>

                <div className="text-center text-sm text-gray-500 mt-4">
                  <p>✅ Secure checkout</p>
                  <p>🚚 Free shipping on orders over $50</p>
                  <p>↩️ 30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
