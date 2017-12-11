import React from 'react';

import Header from '../components/header/Header';

class Page1 extends React.Component {
    render() {
        const match = this.props.match;

        return (
            <div>
                <Header/>
                <main id="main">
                    <h1>{match.params.name} 페이지1</h1>
                </main>
            </div>
        );
    }
}

export default Page1;