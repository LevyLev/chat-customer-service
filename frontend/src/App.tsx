import React, { useState, useEffect } from 'react';

interface DataItem {
  id: string;
  title: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/customer-service')
      .then((response) => response.json())
      .then((data: DataItem[]) => setData(data))
      .catch((error) => console.error('There was an error!', error));
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Data from My Backend</h1>
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item.title}</li> // Use your actual data structure
          ))}
        </ul>
      </header>
    </div>
  );
};

export default App;
