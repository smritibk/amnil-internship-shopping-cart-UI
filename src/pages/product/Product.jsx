import React, { useState } from "react";
import { useEffect } from "react";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import ProductCard from "./ProductCard";
import { Range } from "react-range";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [max, setMax] = useState(10000);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      const params = {
        page,
        limit: 4,
        searchText: searchTerm,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sortBy,
        sortOrder,
      };
      if (selectedCategoryIds.length > 0) {
        params.categoryIds = selectedCategoryIds.join(",");
      }
      const products = await getProducts(params);

      setMax(Math.ceil(max / 100) * 100);
      setProducts(products.productDetails);
    };
    fetchProducts();
  }, [searchTerm, selectedCategoryIds, priceRange, sortBy, sortOrder, page]);

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

      <div>
        <p className="text-sm text-gray-600 mb-4">
          ${priceRange[0]} – ${priceRange[1]}
        </p>
        <Range
          step={10}
          min={0}
          max={max}
          values={priceRange}
          onChange={(values) => {
            if (values[0] >= values[1]) return;
            setPriceRange(values);
          }}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="h-2 bg-gray-200 rounded relative cursor-pointer w-48 ms-2"
            >
              <div
                className="absolute h-2 bg-blue-500 rounded"
                style={{
                  left: `${(priceRange[0] / max) * 100}%`,
                  width: `${((priceRange[1] - priceRange[0]) / max) * 100}%`,
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props }) => {
            const { key, ...rest } = props;
            return (
              <div
                key={key}
                {...rest}
                className="h-5 w-5 bg-blue-600 rounded-full shadow-md cursor-pointer"
              />
            );
          }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-5">
        <select
          id="sortBy"
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [newSortBy, newSortOrder] = e.target.value.split("-");
            setSortBy(newSortBy);
            setSortOrder(newSortOrder);
          }}
          className="border rounded-lg py-2 px-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="createdAt-DESC">Date Added (Newest)</option>
          <option value="createdAt-ASC">Date Added (Oldest)</option>
          <option value="price-DESC">Price: High → Low</option>
          <option value="price-ASC">Price: Low → High</option>
          <option value="name-DESC">Name: Z → A</option>
          <option value="name-ASC">Name: A → Z</option>
        </select>
      </div>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        {products?.map((product) => (
          <div key={product.id} className="border p-2 rounded">
            {/* Product name */}
            <h2 className="text-lg font-semibold mb-2">{product.name}</h2>

            {/* Product card */}
            <ProductCard product={product} />
          </div>
        ))}
      </div>

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
};

export default Product;
