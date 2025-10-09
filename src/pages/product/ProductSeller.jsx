import { useEffect, useState } from "react";
import {
    addProduct,
    getCategories,
    getProductSeller,
} from "../../services/productService";
import SellerProductCard from "./ProductCardSeller";

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    image: "",
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  //fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch seller products
  useEffect(() => {
    const fetchSellerProducts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 4 };
        const data = await getProductSeller(params);
        setProducts(data.productDetails || []);
      } catch (error) {
        console.error("Failed to load seller products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerProducts();
  }, [page]);

  // Handle input change for new product
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle product addition
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
        const created = await addProduct(newProduct);
        setProducts((prev) => [created, ...prev]);
    //   console.log("new product", newProduct);
      setShowAddForm(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        image: "",
      });
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Handle product update (after edit)
  const handleEditProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Seller Dashboard</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showAddForm ? "Close" : "Add Product"}
        </button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddProduct}
          className="bg-white border rounded-lg p-6 mb-6 shadow-md space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Product Description"
            value={newProduct.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={newProduct.price}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={newProduct.stock}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
          <select
            name="categoryId"
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={newProduct.image}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Product
          </button>
        </form>
      )}

      {/* Product Grid */}
      {loading ? (
        <p className="text-gray-500 text-center mt-10">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">
          No products found. Add your first product!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {products.map((product) => (
            <SellerProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="font-semibold">Page {page}</span>
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={products.length < 4}
        >
          Next
        </button>
      </div>
    </div>
  );
}
