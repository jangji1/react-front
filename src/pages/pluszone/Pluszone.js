import React from 'react';
import ClassNames from 'classnames';
import * as service from '../../services/Pluszone';

import Player from '../../components/player/Player';

import './Pluszone.css';

class Main extends React.Component {
    state = {
        data : {},
        page : 0,
        isMovie : false
    }

    getCourse = (elearnCourseId) => {
        service.getCourse(elearnCourseId)
        .then(res => {
            this.setState({
                data: res.data.result.data
            });
        });
    }

    componentWillMount() {
        this.getCourse(this.props.match.params.elearnCourseId);
    }

    movePage = (dir) => {
        const page = this.state.page;
        const lastPage = this.state.data.courseContentsList.length;

        if(dir === 'prev') {
            this.setState({
                page: page - 1,
                isMovie: false
            });
        } else if(dir === 'next') {
            if(this.state.page !== 0 && this.state.data.courseContentsList) {
                if(this.state.data.courseContentsList[this.state.page].type === 'movie') {
                    this.setState({
                        page: page + 1,
                        isMovie: true
                    });
                } else {
                    this.setState({
                        page: page + 1
                    });
                }
            } else {
                this.setState({
                    page: page + 1
                });
            }
        }
    }

    getContent = () => {
        let content = null;
        if(this.state.page !== 0 && this.state.data.courseContentsList) {
            // Img
            if(this.state.data.courseContentsList[this.state.page - 1].type === 'img') { 
                content = <img src={this.state.data.courseContentsList[this.state.page - 1].contentUrl} alt=""/>
            }
            // PDF
            else if(this.state.data.courseContentsList[this.state.page - 1].type === 'pdf') {
                content = this.state.data.courseContentsList[this.state.page - 1].contentUrl
            }
            // Movie
            else if(this.state.data.courseContentsList[this.state.page - 1].type === 'movie') {
                content = <Player ref={ref => this._player = ref }
                    source={this.state.data.courseContentsList[this.state.page - 1].contentUrl}
                    settings={{}}
                    page={this.state.page}
                    movePage={this.movePage}
                    movieInfo={this.state.data.courseContentsList[this.state.page - 1].movieInfo}/>
            }
        }

        return content;
    }

    getButton = () => {
        let button = null;
        if(this.state.data.courseContentsList) {
            if(this.state.page === this.state.data.courseContentsList.length) {
                button = null;
            } else if(this.state.data.courseContentsList[this.state.page].type === 'movie') {
                button = <button className="btn btn_play" onClick={() => this.movePage('next')}>학습하기</button>
            } else{
                button = <button className="btn btn_next" onClick={() => this.movePage('next')}>다음</button>
            }
        }

        return button;
    }

    render() {
        return (
            <div className="pluszone">
                {this.state.page === 0 ? (
                <div className="main">
                    {/*메인 페이지*/}
                    <div className="inner">
                        <div className="mark">학습내용</div>
                        <p className="lecture">{this.state.data.lectureNm}</p>
                        <div className="course">
                            <i><span className="courseNum">01</span><span className="courseNumTxt">강</span></i>
                            <h1>{this.state.data.courseNm}</h1>
                            <div className="goal">{this.state.data.courseGoal}</div>
                        </div>
                    </div>
                    <button className="btn btn_close">닫기</button>
                    <button className="btn btn_next" onClick={() => this.movePage('next')}>다음</button>
                </div>
                ) : (
                <div className="content">
                    {/*학습 페이지*/}
                    <header id="header" className={ClassNames({
                        'hide': this.state.isMovie
                    })}>
                        <h1>01강 {this.state.data.courseNm}</h1>
                        <button className="btn btn_close">닫기</button>
                    </header>
                    <main>
                        <div className="innertube">
                            {this.getContent()}
                        </div>
                    </main>
                    <footer id="footer" className={ClassNames({
                        'hide': this.state.isMovie
                    })}>
                        <button className="btn btn_prev" onClick={() => this.movePage('prev')}>이전</button>
                        {this.getButton()}
                    </footer>
                </div>
                )}
            </div>
        );
    }
}

export default Main;