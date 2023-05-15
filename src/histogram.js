import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './histogram.css';


function App() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const response = await axios.get('https://www.terriblytinytales.com/test.txt');
    const content = response.data;
    const words = content.match(/\b(\w+)\b/g);
    const frequencies = {};
    words.forEach((word) => {
      frequencies[word] = (frequencies[word] || 0) + 1;
    });
    const sortedFrequencies = Object.entries(frequencies).sort((a, b) => b[1] - a[1]);
    setData(sortedFrequencies.slice(0, 20).map(([word, frequency]) => ({ word, frequency })));
  };

  const handleExport = () => {
    const csv = data.map(({ word, frequency }) => `${word},${frequency}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'histogram.csv');
  };

  return (
    <div>
      <button onClick={fetchData}>Submit</button><br/>
      {data && (
        <>
          <BarChart width={800} height={400} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="word" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="frequency" fill="#8884d8" />
          </BarChart>
          <button onClick={handleExport}>Export</button>
        </>
      )}
    </div>
  );
}

export default App;
