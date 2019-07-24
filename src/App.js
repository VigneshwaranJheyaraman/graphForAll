import React from 'react';
import './App.css';
import Canvas from './components/Canvas';

function App() {
  return (
    <div className="container-fluid">
      <Canvas yAxis={getRandomList(50)} xAxis={getRandomList(50)}/>
    </div>
  );
}

function getRandomList(size)
{
  let randomNumbers =[];
  for(var i=0;i<size;i++)
  {
    randomNumbers.push(Math.floor(Math.random() * size));
  }
  return randomNumbers;
}
export default App;
