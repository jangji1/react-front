import React from 'react';
import Player from '../../../../components/player/Player';

import './Main.css';

class Main extends React.Component {
    state = {
        settings: {
            //miniview: true,
            //width: 300,
            //height: 150,
            //top: 0,
            //left: 0,
            //startTime: 30,
            //endTime: 45,
            //currentTime: 5,
        }
    }

    render() {
        return (
            <div>
                <div className="gradesup">
                    <header id="header">
                        <h1>
                            <span>중학교 역사①</span> | <span>Ⅰ. 문명의 형성과 고조선의 성립 > 01 역사의 의미와 역사 학습의 목적</span>
                        </h1>
                    </header>
                    <main id="main">
                        <div className="innertube">
                            HTML Contents
                            <Player ref={ref => this._player = ref }
                                source={'/media/devstories.mp4'}
                                subtitles={'/media/devstories.vtt'}
                                settings={this.state.settings}
                            />
                        </div>
                    </main>
                    <nav id="nav">
                        <div className="innertube">
                            <article>
                                <h1>구간재생</h1>
                                <ul>
                                    <li><a href="javascript:void(0)" onClick={() => this._player.setOptions({}) }>원본</a></li>
                                    <li><a href="javascript:void(0)" onClick={() => this._player.setOptions({startTime: 5, endTime: 15}) }>A구간</a></li>
                                    <li><a href="javascript:void(0)" onClick={() => this._player.setOptions({startTime: 15, endTime: 30}) }>B구간</a></li>
                                    <li><a href="javascript:void(0)" onClick={() => this._player.setOptions({startTime: 30, endTime: 50}) }>C구간</a></li>
                                    <li><a href="javascript:void(0)" onClick={() => this._player.setOptions({startTime: 50, endTime: 70}) }>D구간</a></li>
                                </ul>
                            </article>
                        </div>
                    </nav>
                    <footer id="footer">
                        <div className="innertube">
                            <div className="pagination">
                                <a href="#">&lt;</a>
                                <a href="#">1</a>
                                <a href="#">2</a>
                                <a href="#">3</a>
                                <a href="#">&gt;</a>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }
}

export default Main;