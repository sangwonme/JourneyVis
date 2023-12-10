import React, {useState} from 'react';
import styles from './TreeReportView.module.scss';

import action_data from '../../../data/action_df.json';
import paper_data from '../../../data/paper_df.json';

import * as d3 from 'd3';

const PaperDescription = ({paperID}) => {
  const paper = paper_data[paperID]
  const title = paper.title
  const author_list = paper.author_list
  const venue = paper.venue
  const year = paper.year
  const citation = paper.citation
  const url = paper.url

    // Step 1: Remove the leading and trailing single quotes
  const cleanedStr = author_list.slice(2, -2);

  // Step 2: Replace special characters (if necessary)
  const replacedStr = cleanedStr.replace(/\\xa0/g, " ");

  // Step 3: Parse the string
  // Remove the square brackets and split the string
  const authorList = replacedStr.slice(1, -1).split("', '");

  return (<>
  <div className={styles.paperContainer}>
    <p className={styles.papertitle}>{title}</p>
    {
      authorList &&
      authorList.map(author => <span className={styles.author}>{author}</span>)
    }
    <div className={styles.metadata}>
      <div className={styles.nonlink}>
        {/* <p className={styles.venue}>{venue}</p> */}
        {
          year > 0 &&
          <p className={styles.year}>{year}</p>
        }
        <p className={styles.citation}>💬 {citation}</p>
      </div>
      <a className={styles.url} href={url} target='_blank'>⛓️</a>
    </div>
  </div>
  </>)
}

const NodeDescription = ({nodeID}) => {
  const action = action_data[nodeID]
  const colormap = {
    'advanced_search': 'red',
    'cited_by': 'blue',
    'same_author': 'green',
    '': 'black'
  }
  const link_type = action.link_type
  const color = colormap[action.link_type || '']
  const papers_num = action.papers_num
  const searched_papers = action.searched_papers

  const [toggle, setToggle] = useState(false);
  const switchtoggle = () => {
    setToggle(!toggle);
  }


  return (<>
  <div className={styles.nodeContainer}>
    <p className={styles.title} style={{backgroundColor: color}}>{'A'+nodeID}</p>
    <div className={styles.actionDesc}>
      {
        (link_type == 'cited_by' || link_type == 'same_author') ?
        // seed
        <>
        <p className={styles.relation}>{link_type} from paper in A{action.parent} </p>
        <PaperDescription paperID={action.seedpaper_id}/>
        </>
        :
        // no seed
        <>
        <p className={styles.relation}>advanced_search</p>
        {
          action.parent &&
          <p className={styles.parentID}>This search action is driven from A{action.parent}</p>
        }
        <div className={styles.querycontainer}>
          <p className={styles.querytype}>Search Keyword</p>
          <p className={styles.query}>{action.query}</p>
        </div>
        <div className={styles.querycontainer}>
          <p className={styles.querytype}>Year</p>
          <p className={styles.query}>{action.startYear}~{action.endYear}</p>
        </div>
        </>
      }
    </div>
    {
    searched_papers && 
    <div className={styles.paperList}>
      <p className={styles.papersNum} onClick={switchtoggle}>{!toggle? '▶️': '▼'} Total {searched_papers.length} paper found.</p>
      {toggle && searched_papers.map(id => <PaperDescription paperID={id} />)}
    </div>
    }
    <a className={styles.actionUrl} href={action.url} target='_blank'>Explore more with this search action.</a>
  </div>
  </>);
}

const TreeReportView = ({selNodeID}) => {

  return ( <>
  <h2>Search Action History</h2>
  <div className={styles.container}>
    {
      selNodeID.length > 0 &&
      selNodeID.map(id => id =="-1"? <></> : <NodeDescription nodeID={id}/>)
    }
  </div>
  </> );
}
 
export default TreeReportView;