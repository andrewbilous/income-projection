import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement } from 'chart.js';
import { forwardRef, useImperativeHandle, useRef } from 'react';

ChartJS.register(ArcElement);

type Props = { inputs: { consult: number; retainer: number; product: number } };

const DonutChart = forwardRef(({ inputs }: Props, ref) => {
  const chartRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    getBase64: () => chartRef.current?.toBase64Image()
  }));

  const data = {
    labels: ['Consulting', 'Retainer', 'Product'],
    datasets: [{
      data: [inputs.consult, inputs.retainer, inputs.product],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
      borderColor: '#ffffff',
      borderWidth: 2
    }]
  };

  return (
    <Doughnut
      ref={chartRef}
      data={data}
      options={{
        plugins: {
          legend: {
            display: true,
            position: 'right'
          }
        }
      }}
    />
  );
});

export default DonutChart;
