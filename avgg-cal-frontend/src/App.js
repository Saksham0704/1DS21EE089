import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [numberType, setNumberType] = useState('p');
  const [average, setAverage] = useState(null);
  const [numbersBefore, setNumbersBefore] = useState([]);
  const [numbersAfter, setNumbersAfter] = useState([]);

  const fetchAverage = async () => {
    try {
      const response = await axios.get(`http://localhost:9856/numbers/${numberType}`);
      setAverage(response.data.average);
      setNumbersBefore(response.data.numbersBefore);
      setNumbersAfter(response.data.numbersAfter);
      console.log(response)
    } catch (error) {
      console.error('Error fetching average:', error);
    }
  };

  return (
    <div className="App">
      <h1>Average Calculator</h1>
      <div>
        <label>
          Select number type:
          <select value={numberType} onChange={(e) => setNumberType(e.target.value)}>
            <option value="p">Prime</option>
            <option value="f">Fibonacci</option>
            <option value="e">Even</option>
            <option value="r">Random</option>
          </select>
        </label>
        <button onClick={fetchAverage}>Fetch Average</button>
      </div>
      {average !== null && (
        <div>
          <h2>Average: {average}</h2>
          <h3>windowPrevState: {numbersBefore.join(', ')}</h3>
          <h3>windowCurrState: {numbersAfter.join(', ')}</h3>
        </div>
      )}
    </div>
  );
}

export default App;

