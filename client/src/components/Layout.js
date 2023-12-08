import React, {useState, useEffect} from 'react';
import styles from './Layout.module.scss';
import TreeDiagram from './TreeViewRelated/TreeDiagram/TreeDiagram';

import action_graph from '../data/action_graph.json'
import TreeReportView from './ReportViewRelated/TreeReportView/TreeReportView';

const Layout = () => {
  const [selNodeID, setSelNodeID] = useState([]);

  useEffect(() => {
    console.log("Selected Node IDs:", selNodeID);
  }, [selNodeID]);

  return ( <>
  <div className={styles.header}></div>
  <div className={styles.layout}>
    <div className={styles.left}>
      <TreeReportView selNodeID={selNodeID}/>
    </div>
    <div className={styles.mid}>
      <div className={styles.midup}>
        <TreeDiagram data = {action_graph} setSelNodeID={setSelNodeID}/>
      </div>
    </div>
    <div className={styles.right}></div>
  </div>
  </> );
}
 
export default Layout;