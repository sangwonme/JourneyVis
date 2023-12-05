import React, { useRef, useEffect, useState} from "react";
import actionTree from "../../data/actionTree.json";
import action from "../../data/action.json";
import paper from "../../data/paper.json";

const PaperList = (props) => {

  const [query, setQuery] = useState(null);
  const [authorID, setAuthorID] = useState(null);
  const [citedBy, setCitedBy] = useState(null);
  const [startYear, setStartYear] = useState(null);
  const [url, setUrl] = useState(null);
  const [searchedPapers, setSearchedPapers] = useState(null);

  useEffect(() => {
    setQuery(action['query'][props.selectedAction]);
    setAuthorID(action['authorID'][props.selectedAction]);
    setCitedBy(action['citedBy'][props.selectedAction]);
    setStartYear(action['startYear'][props.selectedAction]);
    setUrl(action['url'][props.selectedAction]);
    setSearchedPapers(action['searched_papers'][props.selectedAction]);
  }, [props.selectedAction]);  // Assuming props.selectedAction is the dependency triggering the updates


	return (
		<div className="paperListContainer">
      {
        // action description
        props.selectedAction != null &&
        <>
        <div className="actionDescription">
          
          <p className="title">Search Action <a href={url} target="_blank">🔗</a> </p>
          {query && <p className="actionType">
            Searched Query: 
            <p className="action">{query}</p>
          </p>}
          {authorID && <p className="actionType">
            Searched authorID: 
            <p className="action">{authorID}</p>
          </p>}
          {citedBy && <p className="actionType">
            Searched CitationID: 
            <p className="action">{citedBy}</p>
          </p>}
          {startYear && <p className="actionType">
            Filtered Year: 
            <p className="action">{startYear}~</p>
          </p>}
        </div>
        </>
      }

      {
        // paper list
        (searchedPapers != null && searchedPapers.length > 0)&& 
          <div className="paperListWrapper">
          {
          searchedPapers.map(paperID => (
            <div className="paper">
              <p className="paperTitle">{paper['title'][paperID]}</p>
            </div>
          ))
          }
          </div>
      }
    </div>
	);
};

export default PaperList;
