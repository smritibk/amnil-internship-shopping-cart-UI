import React from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      await resetPassword(token, newPassword);
      setMessage("");
      navigate("/");
    } catch (err) {
    //   setMessage("Invalid credentials. Please try again.");
      console.error(err.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      {token ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <p className="text-red-500 my-2">{message}</p>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </form>
      ) : (
        <p className="text-red-500">Invalid or expired token.</p>
      )}
    </div>
  );
};

export default ResetPassword;
