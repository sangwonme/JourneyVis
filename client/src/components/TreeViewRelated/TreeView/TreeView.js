import React from 'react';
import styles from './TreeView.module.scss';
import data from '../../../data/actionTree.json'
import TreeDiagram from '../TreeDiagram/TreeDiagram';

const TreeView = () => {
  return ( <>
    <TreeDiagram data={data[2]}/>
  </> );
}
 
export default TreeView;