import React from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesDashboard = () => {
  // Mock Data - November 2025
  const monthlyData = [
    { month: 'Jul', sales: 485000 },
    { month: 'Aug', sales: 620000 },
    { month: 'Sep', sales: 580000 },
    { month: 'Oct', sales: 920000 },
    { month: 'Nov', sales: 118000 }, // Eid & Winter boost
  ];

  const categoryData = [
    { name: "Women's Wear", value: 48, color: "#8b5cf6" },
    { name: "Men's Wear", value: 28, color: "#3b82f6" },
    { name: "Footwear", value: 15, color: "#10b981" },
    { name: "Accessories", value: 9, color: "#f59e0b" },
  ];

  const topProducts = [
    { id: "#28471", name: "Cotton Panjabi for Men", brand: "Feather Doll's by Selina Deepa", sold: 312, revenue: "৳8,88,200" },
    { id: "#28473", name: "Katan Benarasi Saree", brand: "Feather Doll's by Selina Deepa", sold: 89, revenue: "৳16,46,500" },
    { id: "#28475", name: "Hand-Embroidered Salwar Kameez", brand: "Feather Doll's by Selina Deepa", sold: 156, revenue: "৳10,53,000" },
    { id: "#28472", name: "Block Printed Sharee", brand: "Feather Doll's by Selina Deepa", sold: 198, revenue: "৳8,31,600" },
    { id: "#28474", name: "Leather Sandals (Nagra)", brand: "Feather Doll's by Selina Deepa", sold: 420, revenue: "৳8,35,800" },
  ];

  return (
    <div className="px-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Sales Analytics</h1>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Total Revenue (Nov 2025)</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">৳ 1,18,000</p>
          <p className="text-sm text-green-600 mt-2">↑ 28% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">4,821</p>
          <p className="text-sm text-green-600 mt-2">↑ 35% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Avg. Order Value</p>
          <p className="text-3xl font-bold text-green-600 mt-2">৳ 24,480</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Conversion Rate</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">4.8%</p>
          <p className="text-sm text-green-600 mt-2">↑ 0.6% from last month</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Sales Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Sales Trend (2025)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `৳${(v / 100000).toFixed(1)}L`} />
              <Tooltip formatter={(v) => `৳${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Top Selling Products (November 2025)</h3>
          <Link to="#" className="text-sm text-blue-600 hover:underline">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 uppercase text-xs text-gray-700">
              <tr>
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-6">Product Name</th>
                <th className="py-3 px-6">Brand</th>
                <th className="py-3 px-6">Units Sold</th>
                <th className="py-3 px-6">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">{p.id}</td>
                  <td className="py-4 px-6">{p.name}</td>
                  <td className="py-4 px-6 text-gray-600">{p.brand}</td>
                  <td className="py-4 px-6 font-semibold text-blue-600">{p.sold}</td>
                  <td className="py-4 px-6 font-semibold text-green-600">{p.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;