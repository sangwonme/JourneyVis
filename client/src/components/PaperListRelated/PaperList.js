import React, { useRef, useEffect, useState} from "react";

const PaperList = (props) => {

  let selectedAction = props.selectedAction;
  useEffect(() => {
    selectedAction = props.selectedAction;
  }, [props])

	return (
		<div className="paperListContainer">
    </div>
	);
};

export default PaperList;
