import React from 'react';
import { Route, Link } from 'react-router-dom';

import Header from '../components/header/Header';

class Page2_1 extends React.Component {
    render() {
        const match = this.props.match;

        return (
            <div>
                <h2>{match.params.title}</h2>
            </div>
        );
    }
}

class Page2 extends React.Component {
    render() {
        return (
            <div>
                <Header/>
                <main id="main">
                    <h1>페이지2</h1>
                    <div>
                        <Link to="/page2/page1">페이지1</Link>
                        <Link to="/page2/page2">페이지2</Link>
                        <Link to="/page2/page3">페이지3</Link>
                    </div>
                    <Route
                        path="/page2/:title"
                        component={Page2_1}
                    />
                </main>
            </div>
        );
    }
}

export default Page2;