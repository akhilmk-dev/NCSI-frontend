'use client';
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const DonutChart = ({ data }) => {
  const options = {
  chart: {
    type: 'pie',
    height: 200,
    spacing: [0, 0, 0, 0],
  },
  title: {
    text: '',
  },
  tooltip: {
  useHTML: true,
  backgroundColor: 'transparent', // Remove background to rely on custom styling
  borderWidth: 0, // Remove default border
  shadow: false, // Optional: remove default shadow
  formatter: function () {
    return `
      <div style="
        border: 1.5px solid ${this.point.color};
        border-radius: 3px;
        padding: 8px 12px;
        background-color: rgba(255, 255, 255, 0.85);
        color: #000;
        font-size: 12px;
        box-shadow:1px 1px 4px #00000070;
      ">
        <strong style="color: #000; font-weight: bold;">
          ${this.point.name}
        </strong>: ${this.point.y.toFixed(2)}%
      </div>
    `;
  },
},
  plotOptions: {
    pie: {
      innerSize: '50%',
      size: '80%',
      startAngle: 180,  // <- Start drawing at 9 o'clock
      endAngle: 540, 
      dataLabels: {
        enabled: false,
        connectorWidth: 0,
        distance: 0,
        format: '{point.name}: {point.y}%',
        style: {
          color: '#ffffff',
          textOutline: 'none',
          fontWeight: 'bold',
        },
      },
    },
  },
  series: [
    {
      data: data.map((item) => ({
        name: item.name,
        y: item.y,
        color: item.color,
      })),
    },
  ],
};

  return (
    <>
      <div
        className="row donut-chart"
        style={{ display: 'flex', justifyContent: 'center' }}
        data-highcharts-chart="0"
      >
        <div className="col">
          <div id="container" className="donut-chart-continer">
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        </div>
      </div>

      <div className="row donut-chart-legents text-center">
        {data.map(({ name, y, color, count }, index) => (
          <div className="col" key={index}>
            <span
              className="font-number text-55 wow fadeInRight"
              style={{
                color,
                visibility: 'visible',
                animationDuration: '0.5s',
                animationDelay: `${0.2 + index * 0.2}s`,
                animationName: 'fadeInRight',
              }}
            >
              {y.toFixed(2)}%
            </span>
            <br />
            <span
              className="text-20 wow fadeInRight"
              style={{
                visibility: 'visible',
                animationDuration: '0.5s',
                animationDelay: `${0.4 + index * 0.2}s`,
                animationName: 'fadeInRight',
              }}
            >
              {name}
            </span>
            <br />
            <span
              className="font-number text-35 wow fadeInRight"
              style={{
                color,
                visibility: 'visible',
                animationDuration: '0.5s',
                animationDelay: `${0.6 + index * 0.2}s`,
                animationName: 'fadeInRight',
              }}
            >
              {count}
            </span>
            <br />
          </div>
        ))}
      </div>
    </>
  );
};

export default DonutChart;
