import React, { useState } from "react";
import { useEffect } from "react";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import ProductCard from "./ProductCard";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      const params = {
        page: 1,
        limit: 10,
        searchText: searchTerm,
      };
      if (selectedCategoryIds.length > 0) {
        params.categoryIds = selectedCategoryIds.join(",");
      }
      const products = await getProducts(params);
      setProducts(products.productDetails);
    };
    fetchProducts();
  }, [searchTerm, selectedCategoryIds]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data.categories || []);
    };
    fetchCategories();
  }, []);

  const toggleCategory = (id) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      {/* Category Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        {categories.map((cat) => (
          <label key={cat.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedCategoryIds.includes(cat.id)}
              onChange={() => toggleCategory(cat.id)}
            />
            <span>{cat.name}</span>
          </label>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product) => (
          <div key={product.id} className="border p-2 rounded">
            {/* Product name */}
            <h2 className="text-lg font-semibold mb-2">{product.name}</h2>

            {/* Product card */}
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
