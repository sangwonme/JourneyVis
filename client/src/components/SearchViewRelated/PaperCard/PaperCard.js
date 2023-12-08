import React from 'react';
import styles from './PaperCard.module.scss';

import action_data from '../../../data/action_df.json';
import paper_data from '../../../data/paper_df.json';

const PaperCard = ({paperID}) => {
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
        <p className={styles.year}>{year}</p>
        <p className={styles.citation}>{citation}</p>
      </div>
      <a className={styles.url} href={url} target='_blank'>⛓️</a>
    </div>
  </div>
  </>)
}
 
export default PaperCard;