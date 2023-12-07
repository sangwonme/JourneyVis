import React from 'react';
import styles from './TreeView.module.scss';
import data from '../../../data/miserables.json'
import ForceGraph from '../ForceGraph/ForceGraph';

const TreeView = () => {
  return ( <>
    <ForceGraph data={data}/>
  </> );
}
 
export default TreeView;