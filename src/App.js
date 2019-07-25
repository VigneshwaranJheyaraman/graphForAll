import React, {useEffect, useState} from 'react';
import './App.css';
import Canvas from './components/Canvas';

function App() {
  //      <Canvas yAxis={[21,4,21,32,5,67,9,34,21,54,56,32,74,53,34,78,0,81]} xAxis={[72,54,12,23,78,78,23,78,32,98,77,32,43,86,56,42,21]}/>
  //      <Canvas yAxis={getRandomList(10)} xAxis={getRandomList(10)}/>
  //      <Canvas yAxis={[302, 145, 367, 221, 156, 197]} xAxis={[100, 200, 300, 350, 460, 480]}/>
  let divRef = React.createRef();
  var [currentRef, setCurrentRef] =  useState(null);
  useEffect(() => {
    setCurrentRef(divRef.current);
  });
  return (
    <div className="container-fluid" ref= {divRef}>
      <Canvas yAxis={getRandomList(100)} xAxis={getRandomList(100)} graphColor= "#acd213" parentRef = {currentRef}/>
    </div>
  );
}

function getRandomList(size)
{
  let randomNumbers =[];
  let min = 1;
  for(var i=1;i<=size;i++)
  {
    let max = i;
    randomNumbers.push(Math.floor(Math.random() * max - min) + min);
  }
  return randomNumbers;
}
export default App;
