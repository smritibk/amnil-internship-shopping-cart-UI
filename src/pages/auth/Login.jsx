import React, { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setError("");

    try {
      const data = await login({ email, password });
      // console.log(res);

      // if (!res.ok) {
      //   throw new Error("Invalid credentials");
      // }

      // const data = await res.json();

      // Save token
      localStorage.setItem("accessToken", data.accessToken);

      // Redirect
      navigate("/products");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          required
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
