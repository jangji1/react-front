import React from 'react';

class Search extends React.Component {
    render() {
        const location = this.props.location;

        return (
            <div>
                <h1>"{new URLSearchParams(location.search).get('keyword')}" 검색결과</h1>
            </div>
        );
    }
}

export default Search;