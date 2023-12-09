import React, {useState, useEffect} from 'react';
import styles from './Layout.module.scss';
import TreeDiagram from './TreeViewRelated/TreeDiagram/TreeDiagram';

import action_data from '../data/action_df.json'
import action_graph from '../data/action_graph.json'
import TreeReportView from './ReportViewRelated/TreeReportView/TreeReportView';
import SearchView from './SearchViewRelated/SearchView/SearchView';
import ForceGraph from './TreeViewRelated/ForceGraph/ForceGraph';

import data from '../data/data.json'
import AdjMatrix from './ReportViewRelated/AdjMatrix/AdjMatrix';
import WordCloud from './ReportViewRelated/WordCloud/WordCloud';

const Layout = () => {
  // select in TreeDiagram
  const [selNodeID, setSelNodeID] = useState([]);
  // select whenever selNodeID is updated
  const [selPaperID, setSelPaperID] = useState([]);
  // filter in SearchView > SearchPanel
  const [filterPaperID, setFilterPaperID] = useState([]);
  // sel in SearchView (by click)
  const [visPaperID, setVisPaperID] = useState([]);

  // update selected paper IDs
  let newSelPaperID = [];
  useEffect(() => {
    if(selNodeID.length > 0){
      selNodeID.forEach( (id) => {
          if(id != -1){
            newSelPaperID = newSelPaperID.concat(action_data[id].searched_papers);
          }
        }
      )
      setSelPaperID(newSelPaperID)
    }
    else{
      setSelPaperID([])
    }
  }, [selNodeID])

  useEffect(() => {
    console.log(visPaperID)
  }, [visPaperID])

  return ( <>
  <div className={styles.header}>
    <p className={styles.projecttitle}>JourneyVis</p>
    <p className={styles.team}>김민지 박상원 서현아</p>
  </div>
  <div className={styles.layout}>
    <div className={styles.left}>
      <TreeReportView 
        selNodeID={selNodeID}/>
    </div>
    <div className={styles.mid}>
      <div className={styles.midup}>
        <TreeDiagram 
          data = {action_graph} 
          selNodeID={selNodeID}
          setSelNodeID={setSelNodeID}/>
      </div>
      <div className={styles.middown}>
        <AdjMatrix/>
        <WordCloud visPaperID={visPaperID}/>
      </div>
    </div>
    <div className={styles.right}>
      <SearchView 
        selPaperID={selPaperID}
        filterPaperID={filterPaperID}
        setFilterPaperID={setFilterPaperID}
        visPaperID={visPaperID}
        setVisPaperID={setVisPaperID}
        />
    </div>
  </div>
  </> );
}
 
export default Layout;