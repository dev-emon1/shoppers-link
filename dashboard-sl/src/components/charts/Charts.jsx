import ReactApexChart from "react-apexcharts";

export const Chart = ({ chartData, role }) => {
  const isAdmin = role === "admin";
  // console.log(chartData.total_orders, role);
  // console.log(chartData.total_sale, role);


  /**
   * DATA MAPPING
   * Note: Assuming chartData is the JSON object you shared.
   * If your API provides a 'monthly_stats' array, map that instead.
   * For now, we place the current data in the current month (Jan 2026).
   */
  const currentMonthIndex = new Date().getMonth(); // Jan is 0

  const sales = Array(12).fill(0);
  const orders = Array(12).fill(0);

  // Fill the current month with data from your JSON
  if (chartData) {
    sales[currentMonthIndex] = chartData.total_sale || 0;
    orders[currentMonthIndex] = chartData.total_orders || 0;
  }

  const series = [
    {
      name: isAdmin ? "Total Orders (Platform)" : "My Orders",
      type: "column",
      data: orders,
    },
    {
      name: isAdmin ? "Total Sales (৳)" : "My Sales (৳)",
      type: "line",
      data: sales,
    }
  ];

  const options = {
    chart: {
      height: 350,
      type: "line",
      toolbar: { show: false },
      background: "transparent",
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      }
    },
    stroke: {
      width: [0, 4],
      curve: "smooth",
    },
    title: {
      text: isAdmin ? "Platform Growth Analysis" : "Shop Performance Analysis",
      align: "left",
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: isAdmin ? "#1a3353" : "#333"
      }
    },
    // Using your specific colors: Blue for columns, Green/Orange for lines
    colors: isAdmin ? ["#3b82f6", "#fdd008ff"] : ["#3801b9ff", "#f5740bff"],
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      axisBorder: { show: false },
    },
    yaxis: [
      {
        title: { text: "Orders" },
        min: 0,
        // Calculate max dynamically or set a sensible floor
        max: Math.max(...orders) + 5,
        labels: { formatter: (val) => val.toFixed(0) }
      },
      {
        opposite: true,
        title: { text: "Sales (BDT)" },
        min: 0,
        max: Math.max(...sales) + 1000,
        labels: {
          formatter: (val) => `৳${val.toLocaleString()}`
        }
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return y.toLocaleString();
          }
          return y;
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    grid: {
      borderColor: '#f1f1f1',
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </div>
  );
};