// // import React from "react";
// // import { Link } from "react-router-dom";

// // const OrderPage = () => {
// // 	// Dummy order details for demonstration
// // 	const orderDetails = {
// // 		orderId: "ORD123456",
// // 		date: new Date().toLocaleDateString(),
// // 		items: [
// // 			{ name: "Product 1", quantity: 2, price: 20 },
// // 			{ name: "Product 2", quantity: 1, price: 15 },
// // 		],
// // 		total: 55,
// // 	};

// // 	return (
// // 		<div className="min-h-screen flex items-center justify-center bg-gray-50">
// // 			<div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
// // 				<h2 className="text-2xl font-bold mb-4 text-green-700">Order Placed Successfully!</h2>
// // 				<div className="mb-4">
// // 					<div className="font-semibold">Order ID:</div>
// // 					<div>{orderDetails.orderId}</div>
// // 				</div>
// // 				<div className="mb-4">
// // 					<div className="font-semibold">Date:</div>
// // 					<div>{orderDetails.date}</div>
// // 				</div>
// // 				<div className="mb-4">
// // 					<div className="font-semibold">Items:</div>
// // 					<ul className="list-disc list-inside">
// // 						{orderDetails.items.map((item, idx) => (
// // 							<li key={idx}>
// // 								{item.name} (x{item.quantity}) - ${item.price}
// // 							</li>
// // 						))}
// // 					</ul>
// // 				</div>
// // 				<div className="mb-4 font-bold text-lg">Total: ${orderDetails.total}</div>
// // 				<Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold block text-center">
// // 					Continue Shopping
// // 				</Link>
// // 			</div>
// // 		</div>
// // 	);
// // };

// import React, { useEffect, useState } from "react";
// import { Link, useParams, useLocation, data } from "react-router-dom";
// import { getOrderById } from "../../services/orderService"; // <-- make sure you have this service
// import { getProductById } from "../../services/productService";

// const OrderPage = () => {
//   const { orderId } = useParams(); // assuming route is like /order/:orderId
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();
//   const { cartItems } = location.state || { cartItems: [] };

//   console.log(cartItems);

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center text-lg">
// //         Loading order details...
// //       </div>
// //     );
// //   }

//   const getProductDetails = async (id) => {
//     try {
//       const product = await getProductById(id);
//       return product;
//     } catch (error) {
//       console.error("Error fetching product details:", error);
//       return null;
//     }
//   };

//   if (!cartItems) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">
//         Order not found
//       </div>
//     );
//   }

// return (
//   <div className="min-h-screen flex items-center justify-center bg-gray-50">
//     <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
//       <h2 className="text-2xl font-bold mb-4 text-green-700">
//         Order Placed Successfully!
//       </h2>

//       <div className="mb-4">
//         <div className="font-semibold">Items:</div>
//         <ul className="space-y-3">
//           {cartItems.map((item, idx) => {
//               const product= getProductDetails(item.productId);

//               console.log("product",product.then(data=>console.log(data)))
//               let productData;
//              product.then(data => {
//                productData = data
//              })

//              console.log("Data", productData);
//             //
//             const totalPrice = item.product?.price * item.quantity;
//             return (
//               <li key={idx} className="border p-2 rounded">
//                 <div className="font-semibold text-gray-800">
//                   {item.product?.name || "Unknown Product"}
//                 </div>
//                 <div className="text-gray-600 text-sm">
//                   ${item.product?.price} each × {item.quantity}
//                 </div>
//                 <div className="text-green-600 font-bold">
//                   Total: ${totalPrice?.toFixed(2)}
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       </div>

//       {/* <div className="mb-4 font-bold text-lg">
//         Total: $
//         {cartItems
//           .reduce((sum, item) => sum + item.product?.price * item.quantity, 0)
//           .toFixed(2)}
//       </div> */}

//       <Link
//         to="/products"
//         className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold block text-center"
//       >
//         Continue Shopping
//       </Link>
//     </div>
//   </div>
// );
// };

// export default OrderPage;

import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { getProductById } from "../../services/productService";

const Order = () => {
  const location = useLocation();
  const { cartItems } = location.state || { cartItems: [] };

  const [productList, setProductList] = useState([]);

  const totalAmount = productList.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const itemsWithProducts = await Promise.all(
          cartItems.map(async (item) => {
            const product = await getProductById(item.productId);
            return { ...item, product: product.product };
          })
        );
        setProductList(itemsWithProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    if (cartItems.length > 0) {
      fetchProducts();
    }
  }, [cartItems]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-green-700">
          Order Placed Successfully!
        </h2>

        <div className="mb-4">
          <div className="font-semibold">Items:</div>
          <ul className="space-y-3">
            {productList.map((item, idx) => {
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
          Total: ${totalAmount.toFixed(2)}
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

export default Order;
