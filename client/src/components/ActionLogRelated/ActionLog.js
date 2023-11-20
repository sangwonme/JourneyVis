import React, { useRef, useEffect, useState} from "react";
import actionTree from "../../data/actionTree.json";

const ActionLog = (props) => {


	return (
		<div className="actionLogContainer">
      <p className="title">Query Log</p>
      {
        actionTree.map((e) => (
          <div>
            hi
          </div>
        ))
      }
    </div>
	);
};

export default ActionLog;
