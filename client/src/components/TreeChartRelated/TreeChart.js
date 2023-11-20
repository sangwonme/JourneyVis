import React, { useRef, useEffect, useState} from "react";
import Tree from "react-d3-tree";
import actionTree from "../../data/actionTree.json";
import { useCenteredTree } from "../../helpers";
import ActionNode from "./ActionNode";

const drawPath = (linkDatum, foreignObjectProps) => {
  const { source, target } = linkDatum;
  const sx = source.x - foreignObjectProps.height/2 + 50
  const sy = source.y + foreignObjectProps.width/200 + 50
  const ex = target.x - foreignObjectProps.height/2 + 50
  const ey = target.y - foreignObjectProps.width/200 - 50
  return `M${sy},${sx}
       C${sy*(1/2)+ey*(1/2)},${sx}  
        ${sy*(1/2)+ey*(1/2)},${ex}  
        ${ey},${ex}`;
};


const TreeChart = (props) => {
  const [translate, containerRef] = useCenteredTree();
  const nodeSize = { x: 400, y: 400 };
  const customNodeSize = { x: 400, y: 400}
  const foreignObjectProps = { 
                                width: customNodeSize.x, 
                                height: customNodeSize.y,
                                x: -customNodeSize.x/2,
                                y: -customNodeSize.y/2
                              };

  

	return (
		<div ref={containerRef} className="treeChartContainer">
    <Tree
        data={actionTree[2]}
        translate={translate}
        nodeSize={nodeSize}
        zoomable={true}
        renderCustomNodeElement={(rd3tProps) =>{
          return ActionNode({ ...rd3tProps, foreignObjectProps })
        }
        }
        pathFunc={(linkData) => drawPath(linkData, foreignObjectProps)}
        orientation="horizontal"
      />
    </div>
	);
};

export default TreeChart;
