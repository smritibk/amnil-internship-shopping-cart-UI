import { useState, useEffect } from "react";
import { updateCartItem, removeFromCart } from "../../services/cartService";
import { getProductById } from "../../services/productService";
export default function CartItem({ item, onUpdate, onRemove }) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [product, setProduct] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(item.productId);
        setProduct(data.product);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    }
    fetchProduct();
  }, [item.productId]);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;

    setIsUpdating(true);
    try {
      const response = await updateCartItem(item.id, newQuantity);
      if (response.message) {
        setQuantity(newQuantity);
        onUpdate(item.id, newQuantity);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      const response = await removeFromCart(item.id);
      if (response.message) {
        onRemove(item.id);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  const totalPrice = product.price * quantity;

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 mb-4 transition-all ${
        isRemoving ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="w-20 h-20 flex-shrink-0">
          <img
            src={item.productImage || "https://via.placeholder.com/80"}
            alt={product.name}
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        {/* Product Details */}
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm">${product.price} each</p>
          <p className="text-green-600 font-semibold">
            Total: ${totalPrice.toFixed(2)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={isUpdating || quantity <= 1}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
          >
            -
          </button>
          <span className="w-8 text-center font-semibold">
            {isUpdating ? "..." : quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isUpdating}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
          >
            +
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="text-red-600 hover:text-red-800 p-2 disabled:opacity-50"
          title="Remove item"
        >
          {isRemoving ? (
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
