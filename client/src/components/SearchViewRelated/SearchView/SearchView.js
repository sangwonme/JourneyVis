import React, { useEffect } from 'react';
import styles from './SearchView.module.scss';

import action_data from '../../../data/action_df.json';
import paper_data from '../../../data/paper_df.json';
import PaperCard from '../PaperCard/PaperCard';
import SearchPanel from '../SearchPanel/SearchPanel';

const SearchView = ({selPaperID, filterPaperID, setFilterPaperID}) => {
  console.log(filterPaperID)
  return ( <>
  <h2>Searched Papers</h2>
  <SearchPanel
    selPaperID={selPaperID}
    setFilterPaperID={setFilterPaperID}/>
  <div className={styles.paperlist}>
    {
      filterPaperID &&
      filterPaperID.map(id => <PaperCard paperID={id}/>)
    }
  </div>
  </> );
}
 
export default SearchView;