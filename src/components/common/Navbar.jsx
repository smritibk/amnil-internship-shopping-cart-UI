import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold hover:text-gray-200">
        🛒 ShoppingCart
      </Link>

      {/* Links */}
      <div className="flex space-x-6">
        <Link to="/products" className="hover:text-gray-200">
          Home
        </Link>
        <Link to="/cart" className="hover:text-gray-200">
          Cart
        </Link>
        <Link to="/" className="hover:text-gray-200">
          Login
        </Link>
        <Link to="/register" className="hover:text-gray-200">
          Register
        </Link>
      </div>
    </nav>
  );
}
