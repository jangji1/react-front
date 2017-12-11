import React from 'react';
import { Redirect } from 'react-router-dom';

class MyPage extends React.Component {
    render() {
        const isLogin = false;
        
        return (
            <div>
                {!isLogin && <Redirect to="/login"/>}
                <h1>마이페이지</h1>
            </div>
        );
    }
}

export default MyPage;