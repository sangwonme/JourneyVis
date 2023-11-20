import React, { useRef, useEffect, useState} from "react";
import actionTree from "../../data/actionTree.json";

function formatDate(input) {
  const date = new Date(input);
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // Formatting to ensure two digits
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedMonth}/${formattedDay} ${formattedHours}:${formattedMinutes}`;
}


const ActionLog = (props) => {

  const setSelectedQuery = props.setSelectedQuery;
  
  let selectedQuery = props.selectedQuery;
  useEffect(() => {
    selectedQuery = props.selectedQuery;
  }, [props])

	return (
		<div className="actionLogContainer">
      <p className="title">Query Log</p>
      {
        actionTree.map((action, i) => (
          <div className={`actionLogWrapper ${i==selectedQuery && 'selected'}`} key={i} onClick={() => setSelectedQuery(i)}>
            <div className="timeStampWrapper">
              {/* TODO : calcualate right timestamp */}
              <p>{formatDate(action.attributes.timestamp_start)}</p>
              <p>{formatDate(action.attributes.timestamp_end)}</p>
            </div>
            <p className="query">{action.attributes.query}</p>
          </div>
        ))
      }
    </div>
	);
};

export default ActionLog;
