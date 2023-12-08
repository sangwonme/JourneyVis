import React, {useState, useEffect} from 'react';
import styles from './Layout.module.scss';
import TreeDiagram from './TreeViewRelated/TreeDiagram/TreeDiagram';

import action_data from '../data/action_df.json'
import action_graph from '../data/action_graph.json'
import TreeReportView from './ReportViewRelated/TreeReportView/TreeReportView';
import SearchView from './SearchViewRelated/SearchView/SearchView';

const Layout = () => {
  const [selNodeID, setSelNodeID] = useState([]);
  const [selPaperID, setSelPaperID] = useState([]);
  const [filterPaperID, setFilterPaperID] = useState([]);

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

  // useEffect(() => {
  //   console.log('papers: ' + selPaperID)
  // }, [selPaperID])

  useEffect(() => {
    console.log('papers: ' + filterPaperID)
  }, [filterPaperID])

  return ( <>
  <div className={styles.header}></div>
  <div className={styles.layout}>
    <div className={styles.left}>
      <TreeReportView 
        selNodeID={selNodeID}/>
    </div>
    <div className={styles.mid}>
      <div className={styles.midup}>
        <TreeDiagram 
          data = {action_graph} 
          setSelNodeID={setSelNodeID}/>
      </div>
    </div>
    <div className={styles.right}>
      <SearchView 
        selPaperID={selPaperID}
        filterPaperID={filterPaperID}
        setFilterPaperID={setFilterPaperID}
        />
    </div>
  </div>
  </> );
}
 
export default Layout;