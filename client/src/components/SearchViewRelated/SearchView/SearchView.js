import React, { useEffect } from 'react';
import styles from './SearchView.module.scss';

import action_data from '../../../data/action_df.json';
import paper_data from '../../../data/paper_df.json';
import PaperCard from '../PaperCard/PaperCard';
import SearchPanel from '../SearchPanel/SearchPanel';

const SearchView = ({selPaperID, filterPaperID, setFilterPaperID, visPaperID, setVisPaperID}) => {
  
  // refresh visPaperID whenever filterPaperID is updated
  useEffect(() => {
    setVisPaperID([])
  }, [filterPaperID])

  const toggleChange = (id) => {
    setVisPaperID(visPaperID => {
      // Check if the id is already in the array
      if (visPaperID.includes(id)) {
        // Remove the id
        return visPaperID.filter(prevId => prevId !== id).sort((a, b) => a - b);
      } else {
        // Add the id and sort
        return [...visPaperID, id].sort((a, b) => a - b);
      }
    });
  };

  useEffect(() => {
    console.log(visPaperID)
  }, [visPaperID])


  return ( <>
  <h2>Searched Papers</h2>
  <SearchPanel
    selPaperID={selPaperID}
    setFilterPaperID={setFilterPaperID}/>
  <div className={styles.paperlist}>
    {
      filterPaperID &&
      filterPaperID.map(id => <PaperCard 
                                paperID={id} 
                                toggleChange={toggleChange}
                                visPaperID={visPaperID}
                                />)
    }
  </div>
  </> );
}
 
export default SearchView;