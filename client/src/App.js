import React, {useEffect, useState} from "react";
import "./App.css";

import TreeChart from "./components/TreeChartRelated/TreeChart";
import ControlPanel from "./components/ControlPanelRelated/ControlPanel";
import ActionLog from "./components/ActionLogRelated/ActionLog";
import PaperList from "./components/PaperListRelated/PaperList";

export default function App() {

  const [selectedQuery, setSelectedQuery] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  useEffect(()=>{
    console.log(selectedAction)
  }, [selectedAction])

  return (
    <div className="layout">
      <ControlPanel/>
      <div className="main">
        <ActionLog 
          setSelectedQuery={setSelectedQuery}
          selectedQuery={selectedQuery}
          />
        <TreeChart 
          selectedQuery={selectedQuery}
          setSelectedAction={setSelectedAction}
          selectedAction={selectedAction}
          />
        <PaperList
          selectedAction={selectedAction}
        />
      </div>
    </div>
  );
}
