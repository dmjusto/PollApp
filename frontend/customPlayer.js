const media = document.querySelector('video');
const controls = document.querySelector('.controlContainer');
const play = document.querySelector('.play');
const playIcon = document.querySelector('.playIcon');
const pauseIcon = document.querySelector('.pauseIcon');

const timerWrapper = document.querySelector('.timer');
const timeRangeSlider = document.querySelector('#rangeInput')
const timerBar = document.querySelector('#timerBar');
const loadedBar = document.querySelector('#loadedBar');
const elapsedBar = document.querySelector('#elapsedBar');
const playhead = document.querySelector('#playhead');

const elapsedTime = document.querySelector('#elapsedTime');
const totalTime = document.querySelector('#totalTime');


media.removeAttribute('controls');
controls.style.visibility = 'visible';


play.addEventListener('click', playPauseMedia);
// timeRangeSlider.addEventListener('click', function(e){
//     console.log(e.target.value)
// })
media.addEventListener('timeupdate', updateTimer);
media.addEventListener('loadeddata', function(){
    totalTime.textContent = trimTime(formatTime(media.duration));
})
media.addEventListener('play', function(){
    toggleIcons();
})
media.addEventListener('click',playPauseMedia);




function playPauseMedia() {
    if(media.paused) {
        media.play();
        toggleIcons();
    } else {
        media.pause();
        toggleIcons();
    }
  }

  function toggleIcons(){
      if(media.paused){
        playIcon.style.display = 'inline-block';
        pauseIcon.style.display = 'none';
      }
      else{
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'inline-block';
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

