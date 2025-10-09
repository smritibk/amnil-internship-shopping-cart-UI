import { useState } from "react";
import { Edit, Trash2, X, Save } from "lucide-react";
import { deleteProduct, editProduct } from "../../services/productService";

export default function SellerProductCard({ product, onDelete, onUpdate }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  // Editable fields
  const [editData, setEditData] = useState({
    name: product.name,
    description: product.description || "",
    price: product.price,
    stock: product.stock || 0,
  });

  const handleEditClick = () => setIsEditing(true);
  const handleCloseModal = () => setIsEditing(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await editProduct(product.id, editData);
      console.log(response)
      if (response.success) {
        setMessage("Product updated successfully!");
        onUpdate?.(product.id, editData);
        setIsEditing(false);
      } else {
        setMessage(response.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setMessage(error.response?.data?.message || "Error updating product");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    setIsDeleting(true);
    try {
      const response = await deleteProduct(product.id);
      if (response.success) {
        setMessage("Product deleted successfully!");
        onDelete?.(product.id);
      } else {
        setMessage(response.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage(error.response?.data?.message || "Error deleting product");
    } finally {
      setIsDeleting(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col">
      {/* Product Image */}
      <div className="h-100 w-full flex items-center justify-center p-2">
        <img
          src={product.image || "https://via.placeholder.com/200"}
          alt={product.name}
          className="max-h-full rounded-xl max-w-full object-contain"
        />
      </div>

      {/* Product Details */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
        {product.name}
      </h3>
      <p className="text-gray-500 text-sm mb-3 line-clamp-2">
        {product.description || "No description available"}
      </p>

      {/* Price & Stock Info */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-green-600 font-bold text-lg">
          ${product.price}
        </span>
        <span
          className={`text-sm font-medium px-2 py-1 rounded ${
            product.stock > 0
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
        </span>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mt-3 p-2 rounded text-sm text-center ${
            message.includes("successfully")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex space-x-3">
        <button
          onClick={handleEditClick}
          className="flex-1 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition flex items-center justify-center space-x-2"
        >
          <Edit size={18} />
          <span>Edit</span>
        </button>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 transition ${
            isDeleting
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          <Trash2 size={18} />
          <span>{isDeleting ? "Deleting..." : "Delete"}</span>
        </button>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Edit Product
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editData.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={editData.stock}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex space-x-3">
              <button
                onClick={handleSave}
                className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition flex items-center justify-center space-x-2"
              >
                <Save size={18} />
                <span>Save Changes</span>
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
