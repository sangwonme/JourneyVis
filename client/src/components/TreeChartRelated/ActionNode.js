import React, { useRef, useEffect, useState} from "react";

const ActionNode = ({
  nodeDatum,
  toggleNode,
  foreignObjectProps
}) => {

  const onClickNode = (nodeData) => {
    const divTag = nodeData['target'].closest('.nodeContainer');
    divTag.classList.toggle('clicked')
    console.log(nodeData['target']);
  };

  return (
  <g>
    <foreignObject {...foreignObjectProps}>
      <div id={`id${nodeDatum.name}`} className="nodeContainer" onClick={onClickNode}>
        <h3>{nodeDatum.name}</h3>
        <div className="paperList">
          hi
        </div>
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