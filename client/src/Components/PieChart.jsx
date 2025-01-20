import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function BasicPie({ data1, data2, title }) {
  const renderLabel = (renderProps) => {
    const { datum } = renderProps;
    return (
      <text
        {...renderProps}
        key={datum.id}
        fill={datum.color}
        style={{ fontSize: '5px', fontWeight: 'bold' }}
      >
        {datum.label}: {datum.value}
      </text>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
      <p style={{ textAlign: 'center', fontWeight: 'bold' }}>{title}</p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <PieChart
          title={title}
          series={[
            {
              data: data1,
              innerRadius: 5,
              outerRadius: 50,
              paddingAngle: 5,
              cornerRadius: 5,
              align: 'center',
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 20, additionalRadius: -20, color: 'gray' },
            },
            {
              data: data2,
              innerRadius: 80,
              outerRadius: 100,
              paddingAngle: 5,
              cornerRadius: 5,
              align: 'center',
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
          ]}
          width={700}
          height={250}
          slotProps={{
            label: {
              children: renderLabel,
            },
          }}
          style={{ maxWidth: '100%', height: 'auto' }} // Assurer que le graphique ne dépasse pas les limites
        />
      </div>
    </div>
  );
}
