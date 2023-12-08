import React, { useEffect, useState } from 'react';
import styles from './SearchPanel.module.scss';

import paper_data from '../../../data/paper_df.json';

const SearchPanel = ({ selPaperID, setFilterPaperID }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // search logic
    useEffect(() => {
      let newFilterPaperID = [];
      selPaperID.forEach((id) => {
        if(paper_data[id].title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paper_data[id].abstract.toLowerCase().includes(searchTerm.toLowerCase())
        ){
          newFilterPaperID.push(id);
        }
      })
      setFilterPaperID(newFilterPaperID);
    }, [searchTerm])

    // refresh search logic
    useEffect(() => {
      setFilterPaperID(selPaperID);
    }, [selPaperID])

    return (
        <input
            className={styles.inputField}
            type="text"
            placeholder="Filter..."
            value={searchTerm}
            onChange={handleChange}
        />
    );
};

export default SearchPanel;
