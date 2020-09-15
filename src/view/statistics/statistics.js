import AbstractView from '../abstract';
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {toFirstUpperCase, convertDurationValue} from '../../utils/common.js';
import {TRANSFERS, pointTypeEmoji, PointGroupType} from '../../const.js';

const BAR_HEIGHT = 55;

const moneyChartConfig = {
  key: `price`,
  datalabelsFormater: (val) => `€ ${val}`,
  title: `MONEY`,
};

const transportChartConfig = {
  key: `count`,
  datalabelsFormater: (val) => `${val}x`,
  title: `TRANSPORT`,
};

const timeSpentChartConfig = {
  key: `duration`,
  datalabelsFormater: (val) => `${convertDurationValue(val)}`,
  title: `TIME SPENT`,
};

const convertToData = (points) => {
  const chartData = {};
  points.forEach((point) => {
    if (!chartData[point.type]) {
      chartData[point.type] = {
        label: pointTypeEmoji[point.type],
        price: point.price,
        duration: point.duration,
        count: 1,
        groupType: TRANSFERS.includes(toFirstUpperCase(point.type))
          ? PointGroupType.TRANSFER
          : PointGroupType.ACTVITY,
      };
    } else {
      chartData[point.type].price += point.price;
      chartData[point.type].duration += point.duration;
      chartData[point.type].count++;
    }
  });

  return chartData;
};

const renderChart = (chartCtx, chartData, chartConfig) => {
  const labels = [];
  const data = [];

  const {
    key,
    datalabelsFormater,
    title,
  } = chartConfig;

  chartData.forEach((item) => {
    labels.push(item.label);
    data.push(item[key]);
  });

  return new Chart(chartCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: datalabelsFormater,
        }
      },
      title: {
        display: true,
        text: title,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 35,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: BAR_HEIGHT
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics statistics--hidden">
      <h2 class="visually-hidden">
        Trip statistics
      </h2>
      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900">
        </canvas>
      </div>
      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900">
        </canvas>
      </div>
      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900">
        </canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractView {
  constructor(points) {
    super();
    this._data = convertToData(points);

    this._setChart();
  }


  getTemplate() {
    return createStatisticsTemplate();
  }

  _getMoneyChartData() {
    return Object.values(this._data).sort((itemA, itemB) => itemB.price - itemA.price);
  }

  _getTransportChartData() {
    return Object.values(this._data).
      filter((item) => item.groupType === PointGroupType.TRANSFER)
      .sort((itemA, itemB) => itemB.count - itemA.count);
  }

  _getTimeSpentChartData() {
    return Object.values(this._data).sort((itemA, itemB) => itemB.duration - itemA.duration);
  }

  _setChart() {

    const element = this.getElement();
    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    moneyCtx.height = BAR_HEIGHT * 6;
    transportCtx.height = BAR_HEIGHT * 4;
    timeSpendCtx.height = BAR_HEIGHT * 6;

    this._moneyChart = renderChart(
        moneyCtx,
        this._getMoneyChartData(),
        moneyChartConfig
    );

    this._transportChart = renderChart(
        transportCtx,
        this._getTransportChartData(),
        transportChartConfig
    );

    this._timeSpentChart = renderChart(
        timeSpendCtx,
        this._getTimeSpentChartData(),
        timeSpentChartConfig
    );
  }
}
