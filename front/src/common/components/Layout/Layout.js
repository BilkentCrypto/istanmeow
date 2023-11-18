import React from 'react';

import Header from '../Header';
import Sidenav from '../Sidenav';
import Footer from '../Footer/Footer';

export default function Layout({ children, showFooter, headerText = '' }) {
  return (
    <div className="flex bg-white dark:bg-neutral-800">
      <div className=" self-start sticky top-0 ">
        <Sidenav />
      </div>
      <div className="flex-1 flex flex-col">
        <Header headerText={headerText} />
        <div className="flex flex-col flex-1 justify-between">{children}</div>
        {showFooter ? <Footer /> : null}
      </div>
    </div>
  );
}
