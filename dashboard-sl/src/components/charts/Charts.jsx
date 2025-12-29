import ReactApexChart from "react-apexcharts";

export const Chart = ({ chartData }) => {
  // We extract the series data from props. 
  // If data hasn't loaded yet, we provide an empty array.
  const series = [
    {
      name: "Orders",
      type: "column",
      data: chartData?.orders || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "Sales (৳)",
      type: "line",
      data: chartData?.sales || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ];

  const options = {
    chart: {
      height: 350,
      type: "line",
      toolbar: { show: false }
    },
    stroke: {
      width: [0, 4],
      curve: 'smooth'
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      text: "Monthly Performance Analysis",
      align: "left",
    },
    // X-Axis categories (Months)
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    // We use two Y-axes: one for Order Count, one for Money (Sales)
    yaxis: [
      {
        title: { text: "Orders" },
      },
      {
        opposite: true,
        title: { text: "Sales (BDT)" },
      },
    ],
    colors: ["#008FFB", "#FEB019"], // Blue for orders, Orange for sales
  };

  return (
    <div id="chart" className="mt-6">
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
        width={"100%"}
      />
    </div>
  );
};