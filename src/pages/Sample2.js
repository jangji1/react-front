import React from 'react';

import * as service from '../services/Sample2';

class Sample2 extends React.Component {

    state = {
      title: '',
      comments: []
    };
    
    fetchPostInfo = async (id) => {
        const info = await Promise.all([
            service.getPost(id),
            service.getComments(id)
        ]);
        this.setState({
            title: info[0].data.title,
            comments: info[1].data
        });
    }

    componentDidMount() {
        this.fetchPostInfo(1);
    }

    render() {
        return (
            <div>
                <h1>API 호출 Sample</h1>
                <h2>{this.state.title}</h2>
                <ul>
                    {this.state.comments.map((comment, i) => {
                        return (<Comment 
                                    body={comment.body}
                                    key={i}
                                />
                        );
                    })}
                </ul>
            </div>
        );
    }
}

class Comment extends React.Component {
    render() {
        return(
            <li>{this.props.body}</li>
        );
    }
}

export default Sample2;