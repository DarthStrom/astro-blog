import * as d3 from "d3";
import * as echarts from "echarts";

const cycleTimeDiv = "#cycleTime";
const monteCarloDiv = "#monteCarlo";

const completedItems = [
  { startedDate: new Date(2024, 11, 26), doneDate: new Date(2025, 0, 1) },
  { startedDate: new Date(2024, 11, 25), doneDate: new Date(2025, 0, 2) },
  { startedDate: new Date(2024, 11, 12), doneDate: new Date(2025, 0, 3) },
  { startedDate: new Date(2025, 0, 6), doneDate: new Date(2025, 0, 6) },
  { startedDate: new Date(2024, 11, 31), doneDate: new Date(2025, 0, 6) },
  { startedDate: new Date(2024, 11, 31), doneDate: new Date(2025, 0, 8) },
  { startedDate: new Date(2025, 0, 6), doneDate: new Date(2025, 0, 9) },
  { startedDate: new Date(2025, 0, 13), doneDate: new Date(2025, 0, 14) },
  { startedDate: new Date(2025, 0, 13), doneDate: new Date(2025, 0, 14) },
  { startedDate: new Date(2025, 0, 9), doneDate: new Date(2025, 0, 15) },
];
const earliestDate = new Date(
  Math.min(...completedItems.map((c) => c.doneDate))
);
const latestDate = new Date(Math.max(...completedItems.map((c) => c.doneDate)));

const getCycleTime = (item) => {
  return (item.doneDate - item.startedDate) / (1000 * 3600 * 24) + 1;
};

const eightyFifthCycle = d3.quantile(completedItems, 0.85, getCycleTime);

const cycleTimeChart = echarts.init(document.querySelector(cycleTimeDiv));
window.addEventListener("resize", () => cycleTimeChart.resize());

cycleTimeChart.setOption({
  title: {
    text: "Cycle Time",
  },
  xAxis: {
    axisLabel: { formatter: "{M}/{d}" },
    name: "Completion Date",
    nameGap: 35,
    nameLocation: "middle",
    type: "time",
  },
  yAxis: {
    name: "Elapsed Days",
    nameGap: 35,
    nameLocation: "middle",
    nameRotate: 90,
  },
  series: [
    {
      type: "scatter",
      animationDuration: 500,
      data: completedItems.map((c) => [c.doneDate, getCycleTime(c)]),
      tooltip: {
        valueFormatter: (value) => value + (value === 1 ? " day" : " days"),
      },
    },
    {
      type: "line",
      animationDuration: 500,
      symbol: "none",
      endLabel: {
        show: true,
        formatter: "85th percentile\n{@[1]} days or less",
        fontSize: 16,
        offset: [-115, -20],
      },
      data: [
        [earliestDate, eightyFifthCycle],
        [latestDate, eightyFifthCycle],
      ],
    },
  ],
  tooltip: {
    trigger: "item",
  },
});

const makeDateRange = (firstDate, lastDate) => {
  let result = {};

  let d = new Date(firstDate);
  while (d <= lastDate) {
    result[d] = 0;
    d.setDate(d.getDate() + 1);
  }
  return result;
};

const doneDateCounts = makeDateRange(earliestDate, latestDate);

for (let item of completedItems) {
  doneDateCounts[item.doneDate]++;
}

let simulatedDates = {};

const iterations = 1000;
const totalItemCount = 100;
for (let i = 0; i < iterations; i++) {
  // start each iteration by calculating the number of items left to complete
  let numItemsLeft = totalItemCount - completedItems.length;

  let simulationDay = new Date(latestDate);

  // loop through future dates until there is no more work to do
  while (numItemsLeft > 0) {
    // the first day of the simulation will be the day after the latest date of the completed work
    simulationDay.setDate(simulationDay.getDate() + 1);

    // pick a random day and get the throughput
    const randomItemIndex = Math.floor(Math.random() * completedItems.length);
    const randomDay = completedItems[randomItemIndex].doneDate;
    const throughput = doneDateCounts[randomDay];

    // and subtract the throughput for that day from the work items left
    numItemsLeft -= throughput;
  }

  // once the work is done for this iteration, increment the count for the number of times the simulation ended on that day
  simulatedDates[simulationDay] = (simulatedDates[simulationDay] || 0) + 1;
}

const histogramData = Object.entries(simulatedDates)
  .map(([dateString, occurrences]) => [new Date(dateString), occurrences])
  .toSorted((a, b) => a[0] - b[0]);

let counted = 0;
let eightyFifthCompletion;

for (let i = 0; counted <= iterations * 0.85; i++) {
  eightyFifthCompletion = histogramData[i][0];
  counted += histogramData[i][1];
}

const monteCarloChart = echarts.init(document.querySelector(monteCarloDiv));
window.addEventListener("resize", () => monteCarloChart.resize());

monteCarloChart.setOption({
  title: {
    text: `Monte Carlo Simulation (${iterations} runs)`,
  },
  xAxis: {
    axisLabel: { formatter: "{M}/{d}" },
    name: "Completion Date",
    nameGap: 35,
    nameLocation: "middle",
    type: "time",
  },
  yAxis: {
    name: "Occurrences",
    nameGap: 35,
    nameLocation: "middle",
    nameRotate: 90,
  },
  series: [
    {
      type: "bar",
      animationDuration: 500,
      barWidth: "99%",
      label: {
        show: true,
        position: "top",
      },
      data: histogramData,
      tooltip: {
        formatter: (params) => params["value"][0].toDateString(),
      },
    },
    {
      type: "line",
      animationDuration: 500,
      symbol: "none",
      endLabel: {
        show: true,
        formatter: (params) =>
          "85th percentile\n" + params["value"][0].toDateString(),
        fontSize: 16,
      },
      data: [
        [eightyFifthCompletion, 0],
        [eightyFifthCompletion, Math.max(...histogramData.map((e) => e[1]))],
      ],
    },
  ],
  tooltip: {
    trigger: "item",
  },
});
