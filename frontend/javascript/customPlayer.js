
var shouldLoop = false;

/*************
 * SELECTORS
 ************/
const media = document.querySelector('video');
const controls = document.querySelector('.controlContainer');

const play = document.querySelector('.play');
const playIcon = document.querySelector('.playIcon');
const pauseIcon = document.querySelector('.pauseIcon');

const loop = document.querySelector('.loop');

const mute = document.querySelector('.mute');
const unmutedIcon = document.querySelector('.unmutedIcon');
const mutedIcon = document.querySelector('.mutedIcon');

const timerWrapper = document.querySelector('.timer');
const timeRangeSlider = document.querySelector('#rangeInput')
const timerBar = document.querySelector('#timerBar');
const loadedBar = document.querySelector('#loadedBar');
const elapsedBar = document.querySelector('#elapsedBar');
const playhead = document.querySelector('#playhead');

const elapsedTime = document.querySelector('#elapsedTime');
const totalTime = document.querySelector('#totalTime');


/****************
 * CONFIGURATION
 ****************/
media.removeAttribute('controls');
controls.style.visibility = 'visible';


/******************
 * EVENT LISTENERS
 ******************/
play.addEventListener('click', playPauseMedia);
mute.addEventListener('click', toggleSound);

loop.addEventListener('click', toggleLoopPlay);

media.addEventListener('timeupdate', updateTimer);
media.addEventListener('loadeddata', function(){
    totalTime.textContent = trimTime(formatTime(media.duration));
})
media.addEventListener('play', function(){
    toggleIcons(playIcon, pauseIcon, false);
})
media.addEventListener('click',playPauseMedia);



/*****************
 * FUNCTIONS
 *****************/
function playPauseMedia() {
    //press play
    if(media.paused) {
        media.play();
        toggleIcons(playIcon, pauseIcon, false);
    } 
    //press pause
    else {
        media.pause();
        toggleIcons(playIcon, pauseIcon, true);
    }
  }

function toggleSound(){
    //unmute
    if(media.muted){
        media.muted = false;
        toggleIcons(mutedIcon, unmutedIcon, false)
    }
    //mute
    else{
        media.muted = true;
        toggleIcons(mutedIcon, unmutedIcon, true);
    }
}

function toggleLoopPlay(){
    //activate play once
    if(shouldLoop){
        shouldLoop = false;
        loop.style.backgroundColor = 'transparent';
    }
    //activate loop video
    else{
        shouldLoop = true;
        loop.style.backgroundColor = '#bf1313';
    }
}
function toggleIcons(icon1, icon2, turnOff){
    if(turnOff){
    icon1.style.display = 'inline-block';
    icon2.style.display = 'none';
    }
    else{
    icon1.style.display = 'none';
    icon2.style.display = 'inline-block';
    }
}

function updateTimer(){

elapsedTime.textContent = formatTime(media.currentTime);


var elapsedLength = media.currentTime/media.duration * 100;
elapsedBar.style.width = elapsedLength + '%'
playhead.style.left = elapsedLength + '%';

if(media.buffered.length > 0){
    var bufferedLength = media.buffered.end(0)/media.duration * 100;
    loadedBar.style.width = bufferedLength + '%';
}

}


function formatTime(time)
{
    var hours = Math.floor(time / 3600);
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time - minutes * 60);
    var minuteValue;
    var secondValue;
    if (minutes < 10)
    {
        minuteValue = '0' + minutes;
    }
    else
    {
        minuteValue = minutes;
    }
    if (seconds < 10)
    {
        secondValue = '0' + seconds;
    }
    else
    {
        secondValue = seconds;
    }
    var mediaTime = minuteValue + ':' + secondValue;
    return mediaTime
}

function trimTime(time){
    while(time.charAt(0) === '0' || time.charAt(0) === ':'){
        time = time.slice(1);
    }
    return time;
}

