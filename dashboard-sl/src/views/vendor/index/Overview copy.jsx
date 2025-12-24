import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";

import { Chart } from "../../../components/charts/Charts";
import {
  activities,
  statusCardsData,
} from "../../../data/admin/index/overviewData";
import { Link } from "react-router-dom";
import PieCharts from "../../../components/charts/PieCharts";
import { useAuth } from "../../../utils/AuthContext";
// import { useEffect, useState } from "react";

const Overview = () => {
  const { user } = useAuth();
  const orders = [
    {
      id: "#14321",
      amount: 132,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    },
    {
      id: "#14322",
      amount: 250,
      paymentStatus: "Paid",
      orderStatus: "Processing",
    },
    {
      id: "#14323",
      amount: 560,
      paymentStatus: "Pending",
      orderStatus: "Delivered",
    },
    {
      id: "#14324",
      amount: 300,
      paymentStatus: "Paid",
      orderStatus: "Cancelled",
    },
    {
      id: "#14325",
      amount: 780,
      paymentStatus: "Paid",
      orderStatus: "Delivered",
    },
  ];
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 lg:gap-6">
        {statusCardsData
          .filter(item => item.roles.includes(user.type))
          .map((item) => (
            <div key={item.id}>
              <div className="w-[300px] bg-white1 rounded-lg shadow-md">
                <div className="flex justify-between items-center p-4">
                  <span className="text-3xl text-main p-4 bg-mainSoft rounded-md flex items-center justify-center">
                    {item.icon && <item.icon />}
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-textLight text-xs">{item.title}</span>
                    <span className="text-4xl text-textSecondary font-bold">
                      {item.count}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 text-xs text-textSecondary bg-bgPage p-2">
                  <p className="flex items-center">
                    <span
                      className={`${item.isIncrease ? "text-green" : "text-red"
                        } mr-2 flex items-center`}
                    >
                      {item.isIncrease ? (
                        <MdOutlineArrowDropUp className="w-5 h-5" />
                      ) : (
                        <MdOutlineArrowDropDown className="w-5 h-5" />
                      )}
                      {item.percentage}
                    </span>
                    {item.time}
                  </p>
                  <span className="font-semibold text-xs cursor-pointer">
                    View more
                  </span>
                </div>
              </div>
            </div>
          ))}

      </div>

      {/* Chart Section */}
      <div className="flex justify-between gap-4   mt-8">
        <div className="w-full max-w-3xl p-4 bg-white shadow-md rounded-2xl">
          <Chart />
        </div>
        <div>
          <div className="w-full max-w-md py-6 px-4 bg-white shadow-md rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <span className="cursor-pointer text-textDark dark:text-bgSurface">
                <BsThreeDotsVertical />
              </span>
            </div>
            <div className="space-y-6">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="relative pl-4 border-l border-gray-300"
                >
                  {/* <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-blue-500 rounded-full"></div> */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-800 text-sm">
                        {activity.title}
                      </p>
                      <span className="text-xs text-textLight">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Amet minim mollit non deserunt ullamco est sit aliqua
                      dolor do amet sint.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <img
                        src={activity.avatar}
                        alt={activity.user}
                        className="h-6 w-6 rounded-full"
                      />
                      <span className="text-xs font-medium text-textDark">
                        {activity.user}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="w-full bg-white mt-6 rounded-md p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-black pb-3">
              Top Products
            </h3>
            <Link
              to="#"
              className="text-sm font-semibold text-black dark:text-white hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left bg-bgSurface dark:bg-bgDark text-black dark:text-white uppercase">
              <thead className="text-sm text-black dark:text-white bg-bgPage uppercase border-b border-border">
                <tr>
                  <th scope="col" className="py-3 px-4">
                    No
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Image
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Name
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Category
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Brand
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Price
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Discount
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Stock
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: "#28471",
                    name: "Cotton Panjabi for Men",
                    category: "Men's Wear",
                    brand: "Aarong",
                    price: "৳2,850",
                    discount: "12%",
                    stock: 87,
                    img: "/images/products/panjabi-aarong.jpg"
                  },
                  {
                    id: "#28472",
                    name: "Block Printed Sharee",
                    category: "Women's Wear",
                    brand: "Tangail Saree Kuthir",
                    price: "৳4,200",
                    discount: "8%",
                    stock: 42,
                    img: "/images/products/tangail-sharee.jpg"
                  },
                  {
                    id: "#28473",
                    name: "Katan Benarasi Saree",
                    category: "Women's Wear",
                    brand: "Kay Kraft",
                    price: "৳18,500",
                    discount: "15%",
                    stock: 18,
                    img: "/images/products/benarasi-kaykraft.jpg"
                  },
                  {
                    id: "#28474",
                    name: "Leather Sandals (Nagra)",
                    category: "Footwear",
                    brand: "Bata Heritage",
                    price: "৳1,990",
                    discount: "20%",
                    stock: 120,
                    img: "/images/products/nagra-bata.jpg"
                  },
                  {
                    id: "#28475",
                    name: "Hand-Embroidered Salwar Kameez",
                    category: "Women's Wear",
                    brand: "Anjan's",
                    price: "৳6,750",
                    discount: "10%",
                    stock: 35,
                    img: "/images/products/anjans-kameez.jpg"
                  }
                ].map((product, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-4 font-medium whitespace-nowrap">
                      {product.id}
                    </td>
                    <td className="py-3 px-4 font-medium whitespace-nowrap">
                      <img
                        className="w-11 h-11 object-cover rounded"
                        src={product.img}
                        alt={product.name}
                      />
                    </td>
                    <td className="py-3 px-4 font-medium whitespace-nowrap">
                      {product.name}
                    </td>
                    <td className="py-3 px-4 font-medium whitespace-nowrap">
                      {product.category}
                    </td>
                    <td className="py-3 px-4 font-medium whitespace-nowrap">
                      {product.brand}
                    </td>
                    <td className="py-3 px-4 font-medium whitespace-nowrap">
                      {product.price}
                    </td>
                    <td className="py-3 px-4 font-medium whitespace-nowrap text-green-600">
                      {product.discount}
                    </td>
                    <td className="py-3 px-4 font-medium whitespace-nowrap">
                      {product.stock}
                    </td>
                    <td className="py-3 px-4 font-medium whitespace-nowrap">
                      <Link to="#" className="text-blue-600 hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex items-center justify-center dark:bg-bgDark">
          <div className="bg-white">
            <PieCharts />
          </div>
        </div>
        <div className="w-full bg-white mt-6 rounded-md p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-black pb-3">
              Recent Orders
            </h3>
            <Link
              to="#"
              className="text-sm font-semibold text-black dark:text-white hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left bg-bgSurface dark:bg-bgDark text-black dark:text-white uppercase">
              <thead className="text-sm text-black dark:text-white bg-bgPage uppercase border-b border-border">
                <tr>
                  <th scope="col" className="py-3 px-4">
                    Order ID
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Price
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Payment Status
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Order Status
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Active
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-4 font-medium whitespace-nowrap">
                      {order.id}
                    </td>

                    <td className="py-3 px-4 font-medium whitespace-nowrap">
                      ৳{order.amount}
                    </td>

                    <td className="py-3 px-4 font-medium whitespace-nowrap">
                      {order.paymentStatus}
                    </td>

                    <td className="py-3 px-4 font-medium whitespace-nowrap">
                      {order.orderStatus}
                    </td>

                    <td className="py-3 px-4 font-medium whitespace-nowrap">
                      <Link to="#" className="text-blue-600 hover:underline">
                        View
                      </Link>
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
