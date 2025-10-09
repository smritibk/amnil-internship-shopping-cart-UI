import { useEffect, useState } from "react";
import { Bar, BarChart } from "recharts";
import {
  getRevenueByProduct,
  getTotalRevenueByDate,
  mostPlacedProducts,
} from "../../services/orderService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { startOfMonth } from "date-fns";

export default function Dashboard() {
  const [totalSalesData, setTotalSalesData] = useState([]);
  const [totalRevenueProduct, setTotalRevenueProduct] = useState([]);

  // const today = new Date();
  // const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // const [startDate, setStartDate] = useState(
  //   firstDayOfMonth.toISOString().split("T")[0]
  // );
  // const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);

  // const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  // const [endDate, setEndDate] = useState(new Date());
  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");

  useEffect(() => {
    const fetchMostPlacedProducts = async () => {
      try {
        const data = await mostPlacedProducts();
        setTotalSalesData(data.topProducts || []);
        console.log("Most placed products data:", data);
      } catch (error) {
        console.error("Failed to load most placed products", error);
      }
    };
    fetchMostPlacedProducts();
  }, []);

  useEffect(() => {
    const fetchRevenueByProduct = async () => {
      try {
        const data = await getRevenueByProduct();
        setTotalRevenueProduct(data.totalRevenue || []);
        console.log("Total revenue by product:",data);
      } catch (error) {
        console.error("Failed to load total revenue", error);
      }
    };
    fetchRevenueByProduct();
  }, []);

  // useEffect(() => {
  //   const fetchDataByDate = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await getTotalRevenueByDate(startDate, endDate);
  //       setData(data.totalRevenue[0].totalRevenue || 0);
  //     } catch (error) {
  //       console.error("Failed to load sales data by date", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchDataByDate();
  // }, [startDate, endDate]);

  // const fetchRevenue = async () => {
  //   if (!startDate || !endDate) {
  //     setError("Please select both start and end dates.");
  //     return;
  //   }

  //   setLoading(true);
  //   setError("");

  //   try {
  //     const res = await getTotalRevenueByDate(startDate, endDate);
  //     console.log("Revenue by date fetched:", res);

  //     // Transform backend response (array of { productId, product.name, totalRevenue })
  //     const formattedData = res.data.totalRevenue.map((item) => ({
  //       name: item["product.name"], // comes from raw query include
  //       revenue: Number(item.totalRevenue),
  //     }));

  //     setData(formattedData);
  //   } catch (err) {
  //     console.error(err);
  //     setError("Failed to fetch total revenue.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div>
      <h2 className="text-4xl">Dashboard</h2>

      <div className="flex gap-50 mt-5">
      {/* {data} */}

        <div className=" border-amber-100 border-4 p-6 rounded-2xl">
          <BarChart width={500} height={500} barSize={50} barGap={50} margin={{bottom:50, right:50}} data={totalSalesData}>
         {/* <CartesianGrid  /> */}
        <XAxis angle={-50} dy={20} dataKey="product.name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="totalQuantity" fill="#8884d8" />
      </BarChart>

        </div>

         <div className=" border-amber-100 border-4 p-6 rounded-2xl">
          <BarChart width={500} height={500} barSize={50} barGap={50} margin={{bottom:50, right:50}} data={totalRevenueProduct}>
         
        <XAxis angle={-50} dy={20} dataKey="product.name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="totalRevenue" fill="#8884d8" />
      </BarChart>

        </div>

      {/* <div className="p-6 bg-white rounded-2xl shadow-md max-w-3xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Total Revenue by Date Range
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              className="border p-2 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              className="border p-2 rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <button
            onClick={fetchRevenue}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Filter
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          data.length > 0 && (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )
        )}
      </div> */}
    </div>
    </div>
  );
}
