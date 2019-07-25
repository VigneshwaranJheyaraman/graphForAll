import React from 'react';
import './App.css';
import Canvas from './components/Canvas';

function App() {
  //      <Canvas yAxis={[21,4,21,32,5,67,9,34,21,54,56,32,74,53,34,78,0,81]} xAxis={[72,54,12,23,78,78,23,78,32,98,77,32,43,86,56,42,21]}/>
  //      <Canvas yAxis={getRandomList(10)} xAxis={getRandomList(10)}/>
  //      <Canvas yAxis={[302, 145, 367, 221, 156, 197]} xAxis={[100, 200, 300, 350, 460, 480]}/>
  return (
    <div className="container-fluid">
      <Canvas yAxis={getRandomList(50)} xAxis={getRandomList(50)} graphColor= "#acd213"/>
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
