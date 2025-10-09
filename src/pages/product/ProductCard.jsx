import { useState } from "react";
import { addToCart } from "../../services/cartService";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { setCartItems } = useCart();

  const handleAddToCart = async () => {
    if (isAdding) return;

    setIsAdding(true);
    setMessage("");

    try {
      const response = await addToCart(product.id, quantity);

      setCartItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.productId === product.id
        );
        if (existingItem) {
          return prevItems.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [
          ...prevItems,
          {
            productId: response.cartItem?.productId,
            quantity,
            id: response.cartItem?.id,
            cartId: response.cartItem?.cartId,
          },
        ];
      });

      if (response.success) {
        setMessage(`Added ${quantity} ${product.title} to cart!`);
        setQuantity(1); // Reset quantity after adding
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(response.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setMessage(error.response?.data?.message || "Error adding item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col">
      {/* Product Image */}
      <div className="h-100 w-full flex items-center justify-center p-2">
        <img
          src={product.image || "https://via.placeholder.com/200"}
          alt={product.title}
          className="max-h-full rounded-xl max-w-full object-contain"
        />
      </div>

      {/* Product Details */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
        {product.title}
      </h3>
      <p className="text-gray-500 text-sm mb-3 line-clamp-2">
        {product.description || "No description available"}
      </p>

      {/* Price */}
      <span className="text-green-600 font-bold text-lg mt-auto">
        ${product.price}
      </span>

      {/* Quantity Selector */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-gray-700 font-medium">Quantity:</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={decrementQuantity}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
          >
            -
          </button>
          <span className="w-8 text-center font-semibold">{quantity}</span>
          <button
            onClick={incrementQuantity}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`mt-2 p-2 rounded text-sm text-center ${
            message.includes("Added")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`mt-4 py-2 rounded-lg font-semibold transition ${
          isAdding
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isAdding ? "Adding..." : `Add to Cart (${quantity})`}
      </button>
    </div>
  );
}
