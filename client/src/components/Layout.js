import React from 'react';
import styles from './Layout.module.scss';
import TreeDiagram from './TreeViewRelated/TreeDiagram/TreeDiagram';

import action_graph from '../data/action_graph.json'

const Layout = () => {
  return ( <>
  <div className={styles.layout}>
    <div className={styles.left}></div>
    <div className={styles.mid}>
      <TreeDiagram data = {action_graph}/>
    </div>
    <div className={styles.right}></div>
  </div>
  </> );
}
 
export default Layout;