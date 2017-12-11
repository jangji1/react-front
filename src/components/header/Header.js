import React from 'react';
import { NavLink } from 'react-router-dom';

import './Header.css';

class Header extends React.Component {
    render() {
        return (
            <div className="header">
                <NavLink exact to="/" className="item" activeClassName="active">홈</NavLink>
                <NavLink to="/page1/sigong" className="item" activeClassName="active">페이지1</NavLink>
                <NavLink to="/page2" className="item" activeClassName="active">페이지2</NavLink>
                <NavLink to="/sample1" className="item" activeClassName="active">샘플1</NavLink>
                <NavLink to="/sample2" className="item" activeClassName="active">샘플2</NavLink>
                <NavLink to="/mypage" className="item" activeClassName="active">마이페이지</NavLink>
                <NavLink to="/login" className="item" activeClassName="active">로그인</NavLink>
                <NavLink to="/search" className="item" activeClassName="active">검색</NavLink>
                <NavLink to="/gradesup/focus/learn/main" className="item" activeClassName="active">내신UP</NavLink>
            </div>
        );
    }
}

export default Header;