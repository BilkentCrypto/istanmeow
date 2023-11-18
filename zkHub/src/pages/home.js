import React from 'react';
import Header from '../components/header';
import Body from '../components/body';
import Content from '../components/content';
import Detail from '../components/detail';

function Home() {
    return (
        <div className='bg-red  w-full min-h-screen flex flex-col'>
            <Header />
            <div className='flex-1 bg-white h-full mt-8 md:mt-20'>
                <Body />
                <Content/>
                <Detail/>
            </div>
        </div>
    );
}

export default Home;
