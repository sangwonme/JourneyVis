import React, {useState} from "react";
import "./App.css";

import TreeChart from "./components/TreeChartRelated/TreeChart";
import ControlPanel from "./components/ControlPanelRelated/ControlPanel";
import ActionLog from "./components/ActionLogRelated/ActionLog";
import PaperList from "./components/PaperListRelated/PaperList";

export default function App() {

  const [selectedQuery, setSelectedQuery] = useState(null);

  return (
    <div className="layout">
      <ControlPanel/>
      <div className="main">
        <ActionLog 
          setSelectedQuery={setSelectedQuery}
          selectedQuery={selectedQuery}
          />
        <TreeChart selectedQuery={selectedQuery}/>
        <PaperList/>
      </div>
    </div>
  );
}
