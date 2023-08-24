import PropTypes from "prop-types";
import PageStatistics from "./data/PageStatistics";

/** Session Chart Series and options used in Dashboard Analytics page  */

export const SessionChartSeries = (props) => {
  const weekData = props.sortedDays;
  const seshTotals = {};

  for (const days in weekData) {
    for (const browser in weekData[days]) {
      if (!seshTotals[browser]) {
        seshTotals[browser] = Array(Object.keys(weekData).length).fill(0);
      }
    }
  }

  let dayIndex = 0;
  for (const days in weekData) {
    for (const browser in seshTotals) {
      if (weekData[days][browser]) {
        seshTotals[browser][dayIndex] = weekData[days][browser].reduce(
          (accumulator, current) => accumulator + current,
          0
        );
      }
    }
    dayIndex++;
  }

  const chartData = Object.keys(seshTotals).map((browser) => ({
    name: browser,
    data: seshTotals[browser],
  }));

  return chartData;
};

SessionChartSeries.proptype = {
  reports: PropTypes.shape({
    metric: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};

export const SessionChartOptions = (props) => {
  const days = Object.keys(props.sortedDays);

  return {
    chart: {
      id: "weekly-sessions",
    },
    xaxis: {
      categories: days,
    },
    stroke: { curve: "smooth" },
    markers: {
      size: 4,
      shape: "square",
      showNullDataPoints: false,
    },
    title: {
      text: "Browser Sessions",
      align: "left",
    },
    border: {
      show: true,
      width: 7,
      color: "007bff",
    },
  };
};

SessionChartOptions.proptype = {
  reports: PropTypes.shape({
    dimensions: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

/** Traffic Channel Chart Series and options used in Dashboard Analytics page  */

export const TrafficChannelChartSeries = (props) => {
  const newReport = props.report.data.rows.map((row) => {
    return {
      dim: row.dimensions[0],
      met: row.metrics[0]?.values[0],
    };
  });

  const routes = {
    "/": 0,
    aboutusmemberlist: 0,
    announcements: 0,
    candidates: 0,
    conference: 0,
    contactus: 0,
    dashboard: 0,
    games: 0,
    grades: 0,
    helpandsupport: 0,
    officials: 0,
    teams: 0,
    teampreview: 0,
    tests: 0,
    trainingvideo: 0,
    subscription: 0,
    venues: 0,
    authentication: 0,
    foulreport: 0,
  };

  newReport.forEach((row) => {
    const path = row.dim.split("/");
    if (path[1] in routes) {
      routes[path[1]] += parseInt(row.met);
      routes["/"] = parseInt(newReport[0].met);
    }
  });

  const routeValues = Object.values(routes);

  return [{ name: "Visits", data: routeValues }];
};

TrafficChannelChartSeries.propTypes = {
  report: PropTypes.shape({
    data: PropTypes.shape({
      rows: PropTypes.arrayOf(
        PropTypes.shape({
          dimensions: PropTypes.arrayOf(PropTypes.string).isRequired,
          metrics: PropTypes.arrayOf(
            PropTypes.shape({
              values: PropTypes.arrayOf(PropTypes.string).isRequired,
            }).isRequired
          ).isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

export const TrafficChannelChartOptions = {
  chart: {
    id: "page-views",
  },
  xaxis: {
    categories: PageStatistics,
    labels: {
      rotate: -45,
      style: {
        fontSize: "10px",
        colors: ["#838485"],
      },
    },
  },
  plotOptions: { bar: { distributed: true, dataLabels: { position: "top" } } },
  dataLabels: {
    enabled: true,
    offsetY: -20,
    style: {
      fontSize: "9px",
      colors: ["#838485"],
    },
  },
  stroke: { curve: "smooth" },
  title: {
    text: "Page Views",
    align: "center",
  },
  border: {
    show: true,
    width: 7,
    color: "007bff",
  },
  grid: {
    show: false,
  },
  legend: {
    position: "bottom",
    show: false,
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          height: 250,
        },
      },
    },
  ],
};

/** User Country Chart Series and options used in Dashboard Analytics page  */

export const UserCountryChartSeries = (props) => {
  const userValues = props.report.map((row) => {
    return parseInt(row.metrics[0]?.values[0]);
  });

  return userValues;
};

UserCountryChartSeries.propTypes = {
  report: PropTypes.arrayOf(
    PropTypes.shape({
      dimensions: PropTypes.arrayOf(PropTypes.string).isRequired,
      metrics: PropTypes.arrayOf(
        PropTypes.shape({
          values: PropTypes.arrayOf(PropTypes.string).isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired
  ).isRequired,
};

export const UserCountyChartOptions = (props) => {
  const userCountry = props.report.map((row) => row.dimensions[0]);

  const userValues = props.report.map((row) => {
    return parseInt(row.metrics[0]?.values[0]);
  });

  const sumValues = userValues.reduce((acc, cur) => acc + cur, 0);

  const percentValue = userValues.map((value) =>
    Math.round((value / sumValues) * 100)
  );

  return {
    labels: userCountry,
    colors: ["#754FFE", "#19cb98", "#e53f3c", "#ffaa46"],
    chart: { type: "donut" },
    plotOptions: { pie: { donut: { size: "60%" } } },
    stroke: { width: 2 },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      markers: {
        width: 12,
        height: 12,
        strokeWidth: 0,
        radius: 6,
        hover: {
          size: 8,
        },
      },
      itemMargin: {
        horizontal: 5,
        vertical: 5,
      },
      formatter: function (val, opts) {
        const index = opts.seriesIndex;
        return `${val}: ${percentValue[index]}%`;
      },
    },
    title: {
      text: "User By Country",
      align: "center",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 250,
          },
        },
      },
    ],
  };
};

UserCountyChartOptions.propTypes = {
  report: PropTypes.arrayOf(
    PropTypes.shape({
      dimensions: PropTypes.arrayOf(PropTypes.string).isRequired,
      metrics: PropTypes.arrayOf(
        PropTypes.shape({
          values: PropTypes.arrayOf(PropTypes.string).isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired
  ).isRequired,
};

export const ChartData = [
  SessionChartSeries,
  SessionChartOptions,
  TrafficChannelChartSeries,
  TrafficChannelChartOptions,
  UserCountryChartSeries,
  UserCountyChartOptions,
];

export default ChartData;
