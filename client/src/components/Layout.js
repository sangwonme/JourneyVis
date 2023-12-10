import React, {useState, useEffect} from 'react';
import styles from './Layout.module.scss';
import TreeDiagram from './TreeViewRelated/TreeDiagram/TreeDiagram';

import action_data from '../data/action_df.json'
import TreeReportView from './ReportViewRelated/TreeReportView/TreeReportView';
import SearchView from './SearchViewRelated/SearchView/SearchView';
import ForceGraph from './TreeViewRelated/ForceGraph/ForceGraph';

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
          selNodeID={selNodeID}
          setSelNodeID={setSelNodeID}/>
      </div>
      <div className={styles.middown}>
        {
          visPaperID.length > 0 ? 
          <>
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Similarity between papers</p>
            <AdjMatrix visPaperID={visPaperID}/>
          </div>
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Main keywords</p>
            <WordCloud visPaperID={visPaperID}/>
          </div>
          </>
          :
          <p className={styles.noSelection}>There is no paper founded in current search actions.</p>
        }
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