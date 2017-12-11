import React from 'react';
import { Redirect } from 'react-router-dom';

import Header from '../components/header/Header';

class Home extends React.Component {
    render() {
        const history = this.props.history;
        
        return (
            <div>
                <Redirect to="/pluszone/155"/>
                <Header/>
                <main id="main">
                    <h1>홈</h1>
                    <button onClick={()=>{history.push('/login')}}>Redirect 로그인</button>
                </main>
            </div>
        );
    }
}

export default Home;