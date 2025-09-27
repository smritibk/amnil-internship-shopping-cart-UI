// import React from "react";
// import { Link } from "react-router-dom";

// const OrderPage = () => {
// 	// Dummy order details for demonstration
// 	const orderDetails = {
// 		orderId: "ORD123456",
// 		date: new Date().toLocaleDateString(),
// 		items: [
// 			{ name: "Product 1", quantity: 2, price: 20 },
// 			{ name: "Product 2", quantity: 1, price: 15 },
// 		],
// 		total: 55,
// 	};

// 	return (
// 		<div className="min-h-screen flex items-center justify-center bg-gray-50">
// 			<div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
// 				<h2 className="text-2xl font-bold mb-4 text-green-700">Order Placed Successfully!</h2>
// 				<div className="mb-4">
// 					<div className="font-semibold">Order ID:</div>
// 					<div>{orderDetails.orderId}</div>
// 				</div>
// 				<div className="mb-4">
// 					<div className="font-semibold">Date:</div>
// 					<div>{orderDetails.date}</div>
// 				</div>
// 				<div className="mb-4">
// 					<div className="font-semibold">Items:</div>
// 					<ul className="list-disc list-inside">
// 						{orderDetails.items.map((item, idx) => (
// 							<li key={idx}>
// 								{item.name} (x{item.quantity}) - ${item.price}
// 							</li>
// 						))}
// 					</ul>
// 				</div>
// 				<div className="mb-4 font-bold text-lg">Total: ${orderDetails.total}</div>
// 				<Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold block text-center">
// 					Continue Shopping
// 				</Link>
// 			</div>
// 		</div>
// 	);
// };

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../../services/orderService"; // <-- make sure you have this service
import { getProductById } from "../../services/productService";

const OrderPage = () => {
  const { orderId } = useParams(); // assuming route is like /order/:orderId
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await getOrderById(orderId);
        // Fetch product details for each item
        const itemsWithProducts = await Promise.all(
          data.items.map(async (item) => {
            try {
              const productData = await getProductById(item.productId);
              return {
                ...item,
                product: productData.product,
              };
            } catch (err) {
              console.error("Error fetching product:", err);
              return item; // fallback with item only
            }
          })
        );
        setOrder({ ...data, items: itemsWithProducts });
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">
        Order not found
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-green-700">
          Order Placed Successfully!
        </h2>

        <div className="mb-4">
          <div className="font-semibold">Order ID:</div>
          <div>{order.id}</div>
        </div>

        <div className="mb-4">
          <div className="font-semibold">Date:</div>
          <div>{new Date(order.createdAt).toLocaleDateString()}</div>
        </div>

        <div className="mb-4">
          <div className="font-semibold">Items:</div>
          <ul className="space-y-3">
            {order.items.map((item, idx) => {
              const totalPrice = item.product?.price * item.quantity;
              return (
                <li key={idx} className="border p-2 rounded">
                  <div className="font-semibold text-gray-800">
                    {item.product?.name || "Unknown Product"}
                  </div>
                  <div className="text-gray-600 text-sm">
                    ${item.product?.price} each × {item.quantity}
                  </div>
                  <div className="text-green-600 font-bold">
                    Total: ${totalPrice?.toFixed(2)}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mb-4 font-bold text-lg">
          Total: ${order.items.reduce((sum, item) => sum + item.product?.price * item.quantity, 0).toFixed(2)}
        </div>

        <Link
          to="/products"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold block text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderPage;
