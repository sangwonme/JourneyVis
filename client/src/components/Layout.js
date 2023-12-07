import React from 'react';
import styles from './Layout.module.scss';

const Layout = () => {
  return ( <>
  <div className={styles.layout}>
    <div className={styles.left}></div>
    <div className={styles.mid}></div>
    <div className={styles.right}></div>
  </div>
  </> );
}
 
export default Layout;