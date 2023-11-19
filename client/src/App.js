import React from "react";
import Tree from "react-d3-tree";
import orgChartJson from "./data/treeData.json";
import { useCenteredTree } from "./helpers";
import "./App.css";
import TreeChart from "./components/TreeChart";

const containerStyles = {
  width: "100vw",
  height: "100vh"
};

const renderForeignObjectNode = ({
  nodeDatum,
  toggleNode,
  foreignObjectProps
}) => (
  <g>
    <foreignObject {...foreignObjectProps}>
      <div style={{ border: "1px solid black", backgroundColor: "#dedede" }}>
        <h3 style={{ textAlign: "center" }}>{nodeDatum.name}</h3>
        {nodeDatum.children && (
          <button style={{ width: "100%" }} onClick={toggleNode}>
            {nodeDatum.__rd3t.collapsed ? "Expand" : "Collapse"}
          </button>
        )}
      </div>
    </foreignObject>
  </g>
);

const customPathFunction = (linkDatum, orientation) => {
  const { source, target } = linkDatum;
  return orientation === 'horizontal'
    ? `M${source.y},${source.x}
       C${source.y*(1/2)+target.y*(1/2)},${source.x}  
        ${source.y*(1/2)+target.y*(1/2)},${target.x}  
        ${target.y},${target.x}`
    : `M${source.x},${source.y}L${target.x},${target.y}`;
};

export default function App() {
  const [translate, containerRef] = useCenteredTree();
  const nodeSize = { x: 1000, y: 500 };
  const foreignObjectProps = { width: 200, height: nodeSize.y, x:-100};

  return (
    <div>
      <TreeChart/>
    </div>
  );
}
