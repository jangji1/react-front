import React from 'react';
import ClassNames from 'classnames';

import * as $ from 'jquery';
import 'jquery-ui-bundle/jquery-ui';
import Hammer from 'rc-hammerjs';

import './Player.css';

class Player extends React.Component {
    settings = this.props.settings;

    // player status
    state = {
        isFullscreen: false,
        isMiniview: false,
        isLock: false,
        isRepeat: false,
        isNav: false,
        repeata: null,
        repeatb: null,
        isPlay: false,
        seekbarValue: 0
    }
    
    /**
     * 메타데이타 로드
     */
    loadmetadata = () => {
        this.init();
        this.setOptions(this.settings);
    }

    /**
     * 초기화
     */
    init = () => {
        // 자동 재생
        if(this._myVideo.autoplay){}
        
        this.dragResize(); // 미니뷰 사이즈 조절/이동(jQuery-ui)
    }

    /**
     * 사용자 설정 변경
     */
    setOptions = (options) => {
        // 사용자 설정 값 세팅
        this.settings = options;
        
        // 시작, 종료시간이 지정되었을 때
        if(this.settings.startTime !== undefined && this.settings.endTime !== undefined) {
            this._myVideo.pause();
            this._myVideo.currentTime = this.settings.startTime;
            this.setStartEnd();
        } else {
            this._myVideo.currentTime = 0;
            this._myVideo.pause();
            this.setStartEnd();
        }

        // 미니뷰로 지정했을 때
        if(this.settings.miniview) {
            this.setState({
                isMiniview: false
            })
            this.miniview();
        }

        // 현 재생시간을 지정했을 때
        if(this.settings.currentTime !== undefined) {
            // 시작, 종료시간이 지정되었을 때
            if(this.settings.startTime !== undefined && this.settings.endTime !== undefined) {
                this._myVideo.currentTime = this.settings.startTime + this.settings.currentTime;
            }else{
                this._myVideo.currentTime = this.settings.currentTime;
            }
        }

        // 배속을 지정했을 때
        if(this.settings.speed != undefined) {
            if(this.settings.speed < 1.4 && this.settings.speed > 0.8) {
                this._myVideo.playbackRate = this.settings.speed;
            }
        } else {
            this._txtSpeed.innerHTML = this._myVideo.playbackRate.toFixed(1);
        }

        // 볼륨을 지정했을 때
        if(this.settings.volume != undefined) {
            this._rangeVolume.value = this.settings.volume;
            this._txtVolume.innerHTML = (this.video.settings.volume * 100) + '%';
        } else {
            this._rangeVolume.value = this._myVideo.volume;
            this._txtVolume.innerHTML = (this._myVideo.volume * 100) + '%';
        }
    }
    
    /**
     * 시작/종료 시간 설정
     */
    setStartEnd = () => {
        // 시작시간이 지정되었을 때
        if(this.settings.startTime !== undefined){
            let currentTime = this._myVideo.currentTime - this.settings.startTime;
            this._currentTime.innerHTML = this.secondsToHms( Math.floor(currentTime) ); // 현 재생시간
        } else {
            this._currentTime.innerHTML = this.secondsToHms( Math.floor(this._myVideo.currentTime) );
        }
        
        // 종료시간이 지정되었을 때
        if(this.settings.endTime !== undefined) {
            let endTime = this.settings.endTime - this.settings.startTime;
            this._totalTime.innerHTML = this.secondsToHms( Math.floor(endTime) ); // 총 재생시간
        } else {
            this._totalTime.innerHTML = this.secondsToHms( Math.floor(this._myVideo.duration) );
        }
    }
    
    /**
     * 시분초 변환
     */
    secondsToHms(s) {
        let hours   = Math.floor(s / 3600);
        let minutes = Math.floor((s - (hours * 3600)) / 60);
        let seconds = s - (hours * 3600) - (minutes * 60);
        let hms;

        if(hours   < 10) { hours   = "0" + hours; }
        if(minutes < 10) { minutes = "0" + minutes; }
        if(seconds < 10) { seconds = "0" + seconds; }

        if(hours === '00') hms = minutes + ':' + seconds;
        else hms = hours + ':' + minutes + ':' + seconds;

        return hms;
    }
    HmsToSeconds(hms) {
        var a = hms.split(':');
        var s = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 

        return s;
    }

    /**
     * 재생중
     */
    playing = () => {}

    /**
     * 볼륨 조정
     */
    alterVolume = (dir) => {
        if(dir && !this.state.isMiniview && !this.state.isLock) {
            var currentVolume = Math.floor(this._myVideo.volume * 10) / 10;
            if(dir === '+') {
                if(currentVolume < 1) this._myVideo.volume += 0.1;
            }else if(dir === '-') {
                if(currentVolume > 0) this._myVideo.volume -= 0.1;
            }
        }
        this.showVolume('show');
        this._rangeVolume.value = this._myVideo.volume;
        this._txtVolume.innerHTML = Math.floor(this._myVideo.volume * 100) + '%';
    }
    showVolume = (dir) => {
        if(dir) {
            if(dir === 'show') {
                this._volumeCtrl.classList.add('active');
            } else if(dir === 'hide') {
                this._volumeCtrl.classList.remove('active');
            }
        }
    }

    /**
     * 재생 일시정지
     */
    playpause = () => {
        if(this._myVideo.paused){
            if( Math.floor(this.settings.endTime) !== Math.floor(this._myVideo.currentTime) ) {
                this._myVideo.play();
            }
        }
        else{
            this._myVideo.pause();
        }
    }

    /**
     * 풀스크린
     */
    fullscreen = () => {
        this.setState({
            isFullscreen: !this.state.isFullscreen
        });
        /*
        if(!this.state.isFullscreen){
            if (this._myVideo.requestFullscreen) {
                this._myVideo.requestFullscreen();
            } 
            else if (this._myVideo['mozRequestFullScreen']) {
                this._myVideo['mozRequestFullScreen'](); // Firefox
            }
            else if (this._myVideo.webkitRequestFullscreen) {
                this._myVideo.webkitRequestFullscreen(); // Chrome and Safari
            }
            this.setState({
                isFullscreen: true
            });
        }
        else{
            if(document['cancelFullScreen']) {
                document['cancelFullScreen']();
            } 
            else if(document['mozCancelFullScreen']) {
                document['mozCancelFullScreen']();
            } 
            else if(document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
            this.setState({
                isFullscreen: false
            });
        }
        */
    }

    /**
     * seek bar
     */
    changeSeek = () => {
        let time;
        // 시작시간, 종료시간이 지정되었을 때
        if(this.settings.startTime !== undefined && this.settings.endTime !== undefined) {
            time = this.settings.startTime + (this.settings.endTime - this.settings.startTime) * (Number(this._seekbar.value) / 100);
        }else{
            time = this._myVideo.duration * (Number(this._seekbar.value) / 100);
        }

        // 구간반복 상태일때
        if(this.state.isRepeat) {
            if(!this.state.repeata) {
                this.setState({
                    repeata: time,
                    isRepeat: false
                })
                this._seekRepeatA.style.marginLeft = this._seekbar.value + '%';
                this._seekRepeatA.style.left = ((this._seekbar.value / 100) - 13) + 'px';
            }else if(!this.state.repeatb) {
                this.setState({
                    repeatb: time,
                    isRepeat: false
                })
                this._seekRepeatB.style.marginLeft = this._seekbar.value + '%';
                this._seekRepeatB.style.left = ((this._seekbar.value / 100) - 13) + 'px';
            }
        }

        this._myVideo.currentTime = time;
        //this._myVideo.pause();
        this.changeSeekStyle();
    }
    timeUpdate = () => {
        let value;
        // 시작시간, 종료시간이 지정되었을 때
        if(this.settings.startTime !== undefined && this.settings.endTime !== undefined) {
            // 지정된 종료시간에 도달하면 
            if( Math.floor(this.settings.endTime) === Math.floor(this._myVideo.currentTime) ) {
                this._myVideo.pause();
                //this._myVideo.currentTime = this.settings.startTime;
            }
            value = 100 - (this.settings.endTime - this._myVideo.currentTime ) * (100 / (this.settings.endTime - this.settings.startTime ));
            this._seekbar.value = String(value);
            this.changeSeekStyle();
        }else{
            value = ( 100 / (this.settings.endTime || this._myVideo.duration) ) * this._myVideo.currentTime;
            this._seekbar.value = String(value);
            this.changeSeekStyle();
        }
        
        // 시작시간이 지정되었을 때
        if(this.settings.startTime !== undefined){
            let currentTime = this._myVideo.currentTime - this.settings.startTime;
            this._currentTime.innerHTML = this.secondsToHms( Math.floor(currentTime) ); // 현 재생시간
        } else {
            this._currentTime.innerHTML = this.secondsToHms( Math.floor(this._myVideo.currentTime) );
        }

        // 반복구간이 설정되었을 때
        if(this.state.repeata && this.state.repeatb) {
            if( Math.floor(this._myVideo.currentTime) === Math.floor(this.state.repeatb) ) {
                this._myVideo.pause();
                this._myVideo.currentTime = this.state.repeata;
                this._myVideo.play();
            }
        }
    }
    inputSeek = () => {
        let time;
        // 시작시간, 종료시간이 지정되었을 때
        if(this.settings.startTime !== undefined && this.settings.endTime !== undefined) {
            time = this.settings.startTime + (this.settings.endTime - this.settings.startTime) * (Number(this._seekbar.value) / 100);
        }else{
            time = this._myVideo.duration * (Number(this._seekbar.value) / 100);
        }

        this._myVideo.currentTime = time;

        // 라벨
        if(this.settings.startTime !== undefined && this.settings.endTime !== undefined) {
            let currentTime = this._myVideo.currentTime - this.settings.startTime;
            this._seekLabel.innerHTML = this.secondsToHms(Math.floor(currentTime));
        } else {
            this._seekLabel.innerHTML = this.secondsToHms(Math.floor(time));
        }

        this._seekLabel.classList.add('active');
    }
    mousedownSeek = () => {
        this._myVideo.pause();
    }
    mouseupSeek = () => {
        this._myVideo.play();
        this._seekLabel.classList.remove('active');
    }
    changeSeekStyle = () => {
        this._seekLabel.style.marginLeft = this._seekbar.value + '%';
        this._seekLabel.style.left = ((this._seekbar.value / 100 * -20) - 30) + 'px';
        this._seekbar.style.backgroundSize = this._seekbar.value + '% 100%';
    }

    /**
     * 구간 반복
     */
    repeat = () => {
        if(this.state.repeata && this.state.repeatb) {
            this.setState({
                repeata: null,
                repeatb: null,
                isRepeat: false
            });
            return false;
        }

        if(!this.state.isRepeat) {
            if(this.state.repeata && this.state.repeatb) {
                this._myVideo.currentTime = this.state.repeata;
            }
            this.setState({
                isRepeat: true
            });
        }
    }

    /**
     * 영상 종료
     */
    ended = () => {
        this._myVideo.pause();
    }

    /**
     * 되감기/빨리감기
     */
    rewindForward = (dir) =>  {
        if(dir && !this.state.isMiniview && !this.isLock) {
            if(dir === '+') {
                // 종료시간이 지정되었을 때
                if(this.settings.endTime !== undefined) {
                    if(this._myVideo.currentTime > this.settings.endTime - 2) {
                        this._myVideo.currentTime = this.settings.endTime;
                    }else{
                        this._myVideo.currentTime += 2;
                    }
                }else{
                    this._myVideo.currentTime += 2;
                }
            }else if(dir === '-') {
                // 시작시간이 지정되었을 때
                if(this.settings.startTime !== undefined) {
                    if(this._myVideo.currentTime < this.settings.startTime + 2) {
                        this._myVideo.currentTime = this.settings.startTime;
                    }else{
                        this._myVideo.currentTime -= 2;
                    }
                }else{
                    this._myVideo.currentTime -= 2;
                }
            }
        }
    }

    /**
     * 미니뷰 사이즈 조절/이동(jQuery-ui)
     */
    dragResize = () => {
        $(this._customVideo).draggable({
            containment: "#main",
            disabled: true,
            scroll: false,
            snap: "#main",
            handle: ".myvideo"
        }).resizable({
            containment: "#main",
            aspectRatio: true,
            handles: "ne, se, sw, nw",
            minWidth: 150,
            disabled: true
        });
    }

    /**
     * 미니뷰
     */
    miniview = () => {
        // 잠금상태일때 동작 불가
        if(this.state.isLock) return false;
        if(!this.state.isMiniview){
            $(this._customVideo).draggable("enable"); // 사이즈 조절/이동 가능(jQuery-ui)
            $(this._customVideo).resizable("enable");
            this.setState({
                isMiniview: true
            });
        }else{
            $(this._customVideo).draggable("disable"); // 사이즈 조절/이동 불가(jQuery-ui)
            $(this._customVideo).resizable("disable");
            this.setState({
                isMiniview: false
            });
        }
    }

    /**
     * 잠금
     */
    lock = () => {
        this.setState({
            isLock: !this.state.isLock
        })
    }

    /**
     * 네비게이터
     */
    nav = () => {
        this.setState({
            isNav: !this.state.isNav
        })
    }

    /**
     * 배속
     */
    alterPlayBackRate = (dir) => {
        if(dir) {
            let currentPlayBackRate = this._myVideo.playbackRate;
            if(dir === '+') {
                if(currentPlayBackRate < 1.4) this._myVideo.playbackRate += 0.2;
            }else if(dir === '-') {
                if(currentPlayBackRate > 0.8) this._myVideo.playbackRate -= 0.2;
            }
        }
        this._txtSpeed.innerHTML = this._myVideo.playbackRate.toFixed(1);
    }

    /**
     * 캡처
     */
    capture = () => {
        var ratio = this._myVideo.videoWidth / this._myVideo.videoHeight;
        var w = this._myVideo.videoWidth; // 동영상 원본 사이즈
        var h = this._myVideo.videoHeight; // 동영상 원본 사이즈
        var context = this._canvas.getContext("2d");

        this._canvas.width = w;
        this._canvas.height = h;

        context.fillRect(0, 0, w, h);
        context.drawImage(this._myVideo, 0, 0, w, h);

        this._canvasImage.click();
    }

    /**
     * 캡처 다운로드
     */
    downloadCanvas = () => {
        this._canvasImage.href = this._canvas.toDataURL();
        this._canvasImage.download = "capture.png"; // 다운로드 이미지명
    }

    /**
     * 비디오 정보
     */
    getVideoInfo = () => {
        
    }

    // 앱 컨트롤 영역
    /**
     * 다시보기
     */
    replay = () => {
        this._myVideo.currentTime = 0;
        this._myVideo.play();
    }

    getPlayInfo = () => {
        return this._myVideo.paused
    }
    
    render() {
        const {
            source,
            subtitles,
            movePage,
            movieInfo
        } = this.props;

        return (
            <div className={ClassNames('custom-video', {
                'control-hide': this.state.isLock || this.state.isMiniview,
                'miniview': this.state.isMiniview,
                'origin' : !this.state.isMiniview,
                'full' : this.state.isFullscreen
            })}
            ref={ref => this._customVideo = ref }
            style={{
                width: this.settings.width + 'px',
                height: this.settings.height + 'px',
                top: this.settings.top + 'px',
                left: this.settings.left + 'px'
            }}>
                {/*비디오*/}
                <Hammer
                    onSwipeLeft={() => this.rewindForward('-') }
                    onSwipeRight={() => this.rewindForward('+') }
                    onSwipeUp={() => this.alterVolume('+') }
                    onSwipeDown={() => this.alterVolume('-') }
                    onPan={(e) => {
                        if(e.additionalEvent === "panup") {
                            this.alterVolume('+');
                        }else if(e.additionalEvent === "pandown") {
                            this.alterVolume('-');
                        }
                    } }
                    onPanEnd={() => this.showVolume('hide') }
                    direction={"DIRECTION_ALL"}
                    options={{recognizers: {
                        pan: { threshold: 10 }
                    }}}>
                    <video className="myvideo"
                        ref={ref => this._myVideo = ref }
                        onLoadedMetadata={this.loadmetadata}
                        onPlaying={this.playing}
                        onEnded={this.ended}
                        onTimeUpdate={this.timeUpdate}
                        onPlay={() => this.setState({isPlay: true})}
                        onPause={() => this.setState({isPlay: false})}
                        >
                        <source src={source} type="video/mp4"/>
                        <track label="Korea subtitles" kind="subtitles" srcLang="ko" src={subtitles} default/>
                    </video>
                </Hammer>
                {/*헤더*/}
                <div className="video-header">
                    <h1>
                        <button className="btn btn-back" onClick={() => movePage('prev')}></button>
                        <span>{movieInfo.title}</span>
                    </h1>
                </div>
                {/*배속*/}
                <div className="speed-control">
                    <div className="inner">
                        <button className="btn btn-slower"
                            ref={ref => this._btnSlower = ref }
                            onClick={() => {this.alterPlayBackRate('-')} }
                        >slower</button>
                        <span className="text" ref={ref => this._txtSpeed = ref }></span><br/>x
                        <button className="btn btn-faster"
                            ref={ref => this._btnFaster = ref }
                            onClick={() => {this.alterPlayBackRate('+')} }
                        >faster</button>
                    </div>
                </div>
                {/*볼륨*/}
                <div className="vol-control" ref={ref => this._volumeCtrl = ref }>
                    <div className="inner">
                        <progress ref={ref => this._rangeVolume = ref }></progress>
                        <span className="text" ref={ref => this._txtVolume = ref }></span>
                    </div>
                </div>
                {/*컨트롤*/}
                <div id="mycontrols" className="mycontrols">
                    <div id="main-control" className="main-control">
                        <div className="seeker">
                            <input type="range" value="0" className="seekbar" ref={ref => this._seekbar = ref }
                                onChange={this.changeSeek}
                                onInput={this.inputSeek}
                                onMouseDown={this.mousedownSeek}
                                onMouseUp={this.mouseupSeek}/>
                            <span className="seek-label"
                                ref={ref => this._seekLabel = ref }></span>
                            <span className={ClassNames('seek-repeata', {
                                    'hide': this.state.repeata == null
                                })}
                                ref={ref => this._seekRepeatA = ref }></span>
                            <span className={ClassNames('seek-repeatb', {
                                    'hide': this.state.repeatb == null
                                })}
                                ref={ref => this._seekRepeatB = ref }></span>
                        </div>
                        <div className="control-box">
                            <div className="left">
                                <span className="current-time"
                                    ref={ref => this._currentTime = ref }></span>
                                <span className="total-time"
                                    ref={ref => this._totalTime = ref }></span>
                                <button className={ClassNames('btn', 'btn-repeat', {
                                        'active': this.state.repeata !== null && this.state.repeatb !== null
                                    })}
                                    ref={ref => this._btnRepeat = ref }
                                    onClick={this.repeat}>A-B</button>
                            </div>
                            <div className="center">
                                <button className="btn btn-rewind"
                                    ref={ref => this._btnRewind = ref }
                                    onClick={() => {this.rewindForward('-')} }>Rewind</button>
                                <button className={ClassNames('btn','btn-playpause', {
                                        'icon-play': !this.state.isPlay,
                                        'icon-pause': this.state.isPlay
                                    })}
                                    ref={ref => this._btnPlaypause = ref }
                                    onClick={this.playpause}>Play/Pause</button>
                                <button className="btn btn-forward"
                                    ref={ref => this._btnForward = ref }
                                    onClick={() => {this.rewindForward('+')} }>Forward</button>
                            </div>
                            <div className="right">
                                <button className="btn btn-capture"
                                    ref={ref => this._btnCapture = ref }
                                    onClick={this.capture}>Capture</button>
                                <button className={ClassNames('btn','btn-full-normal', {
                                        'icon-normal': this.state.isFullscreen,
                                        'icon-full': !this.state.isFullscreen
                                    })}
                                    ref={ref => this._btnFullscreen = ref }
                                    onClick={this.fullscreen}>FullScreen</button>
                                {/*<button className="btn btn-mini" ref={ref => this._btnMini = ref }>Mini</button>*/}
                            </div>
                        </div>
                    </div>
                    {/*<div className="sub-control">
                        <button className="btn btn-fullscreen" ref={ref => this._btnFullscreen = ref }>Full</button>
                        <button className="btn btn-lock" ref={ref => this._btnLock = ref }>Lock</button>
                    </div>*/}
                </div>
                {/*네비게이터*/}
                <nav className="video-nav">
                    <button className={ClassNames('btn','btn-nav', {
                            'open': this.state.isNav
                        })}
                        onClick={this.nav}></button>
                    <div className={ClassNames('video-nav-cont', {
                            'hide': !this.state.isNav
                        })}>
                        <header className="video-nav-header">
                            <div className="inner">
                                <h1>
                                    <div class="teacher">[수학] 오슬아 선생님</div>
                                    <div class="subj">2017 에이급 수학 2-1 전범위: 천재</div>
                                </h1>
                            </div>
                        </header>
                        <div className="video-nav-list">
                            <ul>
                                <li><span><i>Ⅰ.</i>제곱근과 실수 연산</span>
                                    <ul>
                                        <li><span><i>02강</i>{movieInfo.title} </span>
                                            <ul>
                                                {movieInfo.courseMovieChapterList.map((chapter, i) => {
                                                    return (<CourseMovieChapterList 
                                                                startTime={this.HmsToSeconds(chapter.startTime)}
                                                                endTime={this.HmsToSeconds(chapter.endTime)}
                                                                title={chapter.title}
                                                                setOptions={this.setOptions}
                                                                key={i}
                                                        />
                                                    );
                                                })}
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                {/*캡처 영역*/}
                <canvas className="canvas hide"
                    ref={ref => this._canvas = ref }></canvas>
                <a className="canvas-image hide"
                    ref={ref => this._canvasImage = ref }
                    onClick={this.downloadCanvas}></a>
            </div>
        );
    }
}

class CourseMovieChapterList extends React.Component {
    render() {
        const {
            startTime,
            endTime,
            title,
            setOptions
        } = this.props;

        return(
            <li>
                <a href="javascript:void(0)"
                    onClick={() => setOptions({startTime: startTime, endTime: endTime })}>
                    {title}
                </a>
            </li>
        );
    }
}

Player.defaultProps = {
    source: '',
    subtitles: '',
    settings: {}
}

export default Player;