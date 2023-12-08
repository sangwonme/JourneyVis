import React from 'react';
import styles from './TreeReportView.module.scss';

import action_data from '../../../data/action_df.json';

import * as d3 from 'd3';



const TreeReportView = ({selNodeID}) => {

  console.log(Object.keys(action_data))

  return ( <>
  <div className={styles.container}>
    {selNodeID}
  </div>
  </> );
}
 
export default TreeReportView;