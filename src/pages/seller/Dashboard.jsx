import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  dailyRevenueByDate,
  getRevenueByProduct,
  mostPlacedProducts,
} from "../../services/orderService";
import { startOfMonth } from "date-fns";

export default function Dashboard() {
  const [totalSalesData, setTotalSalesData] = useState([]);
  const [totalRevenueProduct, setTotalRevenueProduct] = useState([]);

  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(new Date());

  // for most placed product
  useEffect(() => {
    const fetchMostPlacedProducts = async () => {
      try {
        const data = await mostPlacedProducts();
        setTotalSalesData(data.topProducts || []);
        // console.log("Most placed products data:", data);
      } catch (error) {
        console.error("Failed to load most placed products", error);
      }
    };
    fetchMostPlacedProducts();
  }, []);

  //for most revenue by product
  useEffect(() => {
    const fetchRevenueByProduct = async () => {
      try {
        const data = await getRevenueByProduct();
        setTotalRevenueProduct(data.totalRevenue || []);
        // console.log("Total revenue by product:", data);
      } catch (error) {
        console.error("Failed to load total revenue", error);
      }
    };
    fetchRevenueByProduct();
  }, []);

  //for daily revenue
  useEffect(() => {
    const dailyRevenue = async () => {
      try {
        const data = await dailyRevenueByDate({ startDate, endDate });
        console.log("daily revenue", data.dailyRevenue);
        setDailyRevenue(data.dailyRevenue || []);
      } catch (error) {
        console.error("Failed to load daily revenue", error);
      }
    };
    dailyRevenue();
  }, [startDate, endDate]);

  return (

    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Sales Analytics Dashboard
      </h2>

      {/* Date Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="flex flex-col items-start">
          <label className="text-gray-700 font-medium mb-1 text-sm">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col items-start">
          <label className="text-gray-700 font-medium mb-1 text-sm">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Daily Revenue Trend
        </h3>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dailyRevenue}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Charts Section */}
      <div className="flex flex-wrap justify-center gap-8">
        <div className="border border-amber-200 bg-white shadow-md p-6 rounded-2xl flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Total Quantity by Product
          </h3>
          <BarChart
            width={500}
            height={500}
            barSize={50}
            barGap={50}
            margin={{ bottom: 50, right: 50 }}
            data={totalSalesData}
          >
            <XAxis angle={-50} dy={20} dataKey="product.name" />
            <YAxis label={{ value: "Total Quantity", angle: -90 }} />
            <Tooltip />
            <Legend wrapperStyle={{ paddingTop: 50 }} />
            <Bar dataKey="totalQuantity" fill="#8884d8" />
          </BarChart>
        </div>

        <div className="border border-amber-200 bg-white shadow-md p-6 rounded-2xl flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Total Revenue by Product
          </h3>
          <BarChart
            width={500}
            height={500}
            barSize={50}
            barGap={50}
            margin={{ bottom: 50, right: 50, left: 20 }}
            data={totalRevenueProduct}
          >
            <XAxis angle={-50} dy={20} dataKey="product.name" />
            <YAxis
              label={{
                value: "Total Revenue By Products",
                style: { textAnchor: "middle" },
                angle: -90,
                offset: -5,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Bar dataKey="totalRevenue" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}
