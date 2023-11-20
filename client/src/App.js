import React from "react";
import "./App.css";

import TreeChart from "./components/TreeChartRelated/TreeChart";
import ControlPanel from "./components/ControlPanelRelated/ControlPanel";
import ActionLog from "./components/ActionLogRelated/ActionLog";
import PaperList from "./components/PaperListRelated/PaperList";

export default function App() {
  return (
    <div className="layout">
      <ControlPanel/>
      <div className="main">
        <ActionLog/>
        <TreeChart/>
        <PaperList/>
      </div>
    </div>
  );
}
