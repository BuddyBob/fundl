import React from "react";
import Letter from "./Letter";
import './Grid.css'

const Grid = () =>{
  return (
    <div className="grid">
      {" "}
      <div className="row">
        <Letter lpos={0} attempt={0} />
        <Letter lpos={1} attempt={0} />
        <Letter lpos={2} attempt={0} />
        <Letter lpos={3} attempt={0} />
        <Letter lpos={4} attempt={0} />
      </div>
      <div className="row">
        <Letter lpos={0} attempt={1} />
        <Letter lpos={1} attempt={1} />
        <Letter lpos={2} attempt={1} />
        <Letter lpos={3} attempt={1} />
        <Letter lpos={4} attempt={1} />
      </div>
      <div className="row">
        <Letter lpos={0} attempt={2} />
        <Letter lpos={1} attempt={2} />
        <Letter lpos={2} attempt={2} />
        <Letter lpos={3} attempt={2} />
        <Letter lpos={4} attempt={2} />
      </div>
      <div className="row">
        <Letter lpos={0} attempt={3} />
        <Letter lpos={1} attempt={3} />
        <Letter lpos={2} attempt={3} />
        <Letter lpos={3} attempt={3} />
        <Letter lpos={4} attempt={3} />
      </div>
      <div className="row">
        <Letter lpos={0} attempt={4} />
        <Letter lpos={1} attempt={4} />
        <Letter lpos={2} attempt={4} />
        <Letter lpos={3} attempt={4} />
        <Letter lpos={4} attempt={4} />
      </div>
      <div className="row">
        <Letter lpos={0} attempt={5} />
        <Letter lpos={1} attempt={5} />
        <Letter lpos={2} attempt={5} />
        <Letter lpos={3} attempt={5} />
        <Letter lpos={4} attempt={5} />
      </div>
    </div>
  );
}

export default Grid;