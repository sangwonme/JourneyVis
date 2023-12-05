import React, { useRef, useEffect, useState} from "react";

const ActionNode = ({
  nodeDatum,
  foreignObjectProps,
  setSelectedAction,
  selectedAction
}) => {

  return (
  <g>
    <foreignObject {...foreignObjectProps}>
      <div id={`id${nodeDatum.name}`} className="nodeContainer" onClick={() => setSelectedAction(nodeDatum.name)}>

        <div className={`actionNode ${selectedAction==nodeDatum.name && 'selected'}`}></div>

        {
          selectedAction==nodeDatum.name &&
          <>
          <div className="triangle"></div>
          <div className="paperList">
            <p>Memo</p>
          </div>
          </>  
        }
      </div>
    </foreignObject>
  </g>
  );
}

export default ActionNode;

{/* <foreignObject {...foreignObjectProps}>
      <div style={{ border: "1px solid black", backgroundColor: "#dedede" }}>
        <h3 style={{ textAlign: "center" }}>{nodeDatum.name}</h3>
        {nodeDatum.children && (
          <button style={{ width: "100%" }} onClick={toggleNode}>
            {nodeDatum.__rd3t.collapsed ? "Expand" : "Collapse"}
          </button>
        )}
      </div>
    </foreignObject> */}