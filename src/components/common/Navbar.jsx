import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/");
    }
  };

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
          {totalItems}
        </Link>
        {user && (
          <button onClick={handleLogout} className="hover:text-gray-200">
            Logout
          </button>
        )}
        {!user && (
          <>
            <Link to="/" className="hover:text-gray-200">
              Login
            </Link>
            <Link to="/register" className="hover:text-gray-200">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
