import React, { useEffect, useState, useMemo } from "react";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";

import { Chart } from "../../../components/charts/Charts";
import PieCharts from "../../../components/charts/PieCharts";
import { useAuth } from "../../../utils/AuthContext";
import API from "../../../utils/api";
import { activities, statusCardsData as initialCards } from "../../../data/admin/index/overviewData";
import OrderDetailsModal from "../order-management/OrderDetailsModal";

const Overview = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await API.get("/overView");
        // console.log(response.data.data);

        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching overview data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const dynamicCards = useMemo(() => {
    if (!data) return [];

    const statMap = {
      "Total Customers": data.total_customers,
      "Total Vendors": data.total_vendors,
      "Total Orders": data.total_orders,
      // Change this key to "Total Sales" to match your initialCards title
      "Total Sales": `৳${(data.total_sale || 0).toLocaleString()}`,
      "Pending Orders": data.total_pending_orders,
      "Total Products": data.total_products,
      "Refund Request": data.total_refunds || 0, // Ensure this exists in your API data too
      "Low Inventory": data.low_stock_count,
    };

    return initialCards
      .filter((item) => item.roles.includes(user.type))
      .map((item) => {
        // Log to see what is failing if a count still shows 0
        // console.log(`Mapping ${item.title}: Found value ${statMap[item.title]}`);

        return {
          ...item,
          // If the title exists in our map, use it; otherwise, default to 0
          count: statMap[item.title] ?? 0,
        };
      });
  }, [data, user.type]);
  // console.log(dynamicCards);

  if (loading) return <div className="p-4 animate-pulse">Loading Dashboard...</div>;
  if (!data) return <div className="p-4 text-red-500">Error loading dashboard data.</div>;

  return (
    <div className="p-4">
      {/* 1. Status Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 lg:gap-6">
        {dynamicCards.map((item) => (
          <div key={item.id} className="w-full lg:w-[300px] bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-between items-center p-4">
              <span className="text-3xl text-main p-4 bg-mainSoft rounded-md flex items-center justify-center">
                {item.icon && <item.icon />}
              </span>
              <div className="flex flex-col items-end">
                <span className="text-textLight text-xs">{item.title}</span>
                <span className="text-2xl lg:text-3xl text-textSecondary font-bold">
                  {item.count}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 text-xs text-textSecondary bg-bgPage p-2">
              <p className="flex items-center">
                <span className={`${item.isIncrease ? "text-green" : "text-red"} mr-2 flex items-center`}>
                  {item.isIncrease ? <MdOutlineArrowDropUp className="w-5 h-5" /> : <MdOutlineArrowDropDown className="w-5 h-5" />}
                  {item.percentage}
                </span>
                {item.time}
              </p>
              <Link to={item.url} className="font-semibold text-xs cursor-pointer hover:underline">View more</Link>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Charts & Activity Section */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mt-8">
        <div className="w-full  p-4 bg-white shadow-md rounded-2xl">
          <h3 className="font-semibold mb-4 text-gray-700">Sales Analytics</h3>
          <Chart chartData={data?.monthly_stats} />
        </div>
        {/* <div className="w-full lg:w-1/3 bg-white shadow-md rounded-2xl p-4 flex items-center justify-center">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Order Distribution</h3>
            <PieCharts />
          </div>
        </div> */}
      </div>

      {/* 3. Top Products Table (Dynamic from data.top_products if available, else static placeholder) */}
      <div className="w-full bg-white mt-8 rounded-md p-4 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg text-black">Top Selling Products</h3>
          <Link to="/vendor/orders/order-list" className="text-sm font-semibold text-main hover:underline">View All</Link>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left uppercase">
            <thead className="text-xs bg-bgPage border-b border-border">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4 text-center">Price</th>
                <th className="py-3 px-4 text-center">Stock</th>
                {/* <th className="py-3 px-4 text-right">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(data.top_selling_products || []).length > 0 ? (
                data.top_selling_products.map((prod) => {
                  // Extract the first variant for price/stock
                  const firstVariant = prod.variants?.[0] || {};
                  // Extract the primary image or first available image
                  const primaryImage = prod.images?.find(img => img.is_primary === 1) || prod.images?.[0];

                  // Construct image URL (adjust 'http://localhost:8000/storage/' to your actual base URL)
                  const imageUrl = primaryImage
                    ? `http://localhost:8000/storage/${primaryImage.image_path}`
                    : '/placeholder-product.png';

                  return (
                    <tr key={prod.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <img
                          className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                          src={imageUrl}
                          alt={prod.name}
                          onError={(e) => { e.target.src = '/placeholder-product.png'; }} // Fallback if link breaks
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 line-clamp-1">{prod.name}</span>
                          <span className="text-[10px] text-gray-400">{prod.category?.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-gray-700">
                        ৳{parseFloat(firstVariant.final_price || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs font-medium ${prod.stock_quantity < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                          {prod.stock_quantity} in stock
                        </span>
                      </td>
                      {/* <td className="py-3 px-4 text-right">
                        <Link
                          to={`/products/${prod.id}`}
                          className="text-xs font-bold text-main bg-mainSoft px-3 py-1.5 rounded hover:bg-main hover:text-white transition-all"
                        >
                          View
                        </Link>
                      </td> */}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-gray-400">
                    No top selling products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Pie Chart & Recent Orders Section */}
      <div className="flex flex-col lg:flex-row gap-4 mt-8">
        <div className="w-full bg-white rounded-md p-4 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-black">Recent Orders</h3>
            <Link to="/vendor/orders/order-list" className="text-sm font-semibold text-main hover:underline">View All</Link>
          </div>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left uppercase">
              <thead className="text-xs bg-bgPage border-b border-border">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  {/* <th className="py-3 px-4 text-right">Active</th> */}
                </tr>
              </thead>
              <tbody>
                {data.recent_orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-bold text-gray-700">#{order.unid}</td>
                    <td className="py-3 px-4 font-semibold">৳{parseFloat(order.subtotal).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;