import React from "react";
import "./App.css";

import TreeChart from "./components/TreeChartRelated/TreeChart";
import ControlPanel from "./components/ControlPanelRelated/ControlPanel";

export default function App() {
  return (
    <div className="layout">
      <ControlPanel/>
      <div className="main">
        <TreeChart/>
      </div>
    </div>
  );
}
