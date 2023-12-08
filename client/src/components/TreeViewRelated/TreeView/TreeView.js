import React from 'react';
import styles from './TreeView.module.scss';
import data from '../../../data/action_graph.json'
import TreeDiagram from '../TreeDiagram/TreeDiagram';

const TreeView = () => {
  return ( <>
    <TreeDiagram data={data}/>
  </> );
}
 
export default TreeView;