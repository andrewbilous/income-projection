import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { forwardRef, useImperativeHandle, useRef } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Props = { data: number[] };

const ProjectionChart = forwardRef((props: Props, ref) => {
  const chartRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    getBase64: () => chartRef.current?.toBase64Image()
  }));

  const labels = Array.from({ length: 12 }, (_, i) => `M${i + 1}`);

  return (
    <Line
      ref={chartRef}
      data={{
        labels,
        datasets: [{
          label: 'Monthly Income',
          data: props.data,
          borderColor: '#6b7280',
          backgroundColor: '#9ca3af'
        }]
      }}
      options={{ responsive: true }}
    />
  );
});

export default ProjectionChart;
