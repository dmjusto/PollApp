
var playList = [];
var thumbs = [];
var nextVideo = {};
var startIndex = 0;
var count = 5;
var isFirstVideo = true;
const timer = 1000;
const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
const targetUrl = 'https://ign-apis.herokuapp.com/videos?startIndex='

// Selectors
const videoSource = document.createElement('source');
const videoPlayer = document.querySelector("#videoPlayer");
const videoTitle = document.querySelector('#videoTitle'); 
const description = document.querySelector('#description');
const loadMoreBtn = document.querySelector('#loadMore');
const plSection = document.querySelector('.playlistSection');

videoPlayer.appendChild(videoSource);

//Event Listeners
videoPlayer.addEventListener('ended',function(){
    if(shouldLoop){
        videoPlayer.play();
    }
    else{
        playNext();
    }
});

loadMoreBtn.addEventListener('click', function(){
    const counter = thumbs.length;
    for(let i = 0; i < counter; i++){
        thumbs.shift().remove();
        playList.shift();
    }
    fetchVideos();
});


//API Fetch
fetchVideos();


/**************
 * Functions
 **************/
function fetchVideos()
{
    fetch(proxyUrl + targetUrl + startIndex + '&count=' + count)
        .then(response =>
        {
            return response.json();
        })
        .then(videos =>
        {
            startIndex += count;
            videos.data.forEach(video =>
            {
                playList.push(video);
            });
            if(isFirstVideo){
                loadNext();
                isFirstVideo = false;
                count--;
            }
            generatePlaylist();
        });
}

function playNext(){
    loadNext();
    thumbs.shift().remove();
    videoPlayer.play();
}

function loadNext(){
    nextVideo = playList.shift();
    videoSource.setAttribute('src', nextVideo.assets[1].url);
    videoPlayer.load();
    videoTitle.textContent = nextVideo.metadata.title;
    description.textContent = nextVideo.metadata.description;
    videoPlayer.poster = nextVideo.thumbnails[1].url;
}

function generatePlaylist(){
    playList.forEach(vid => {
        const container = makeContainer();
        const div1 = setupThumbnail(vid);
        const div2 = setupVideoTitle(vid);

        container.appendChild(div1);
        container.appendChild(div2);
        thumbs.push(container);
        plSection.appendChild(container);
    });

    function setupThumbnail(vid)
    {
        const image = makeImage(vid);
        const timeDisplay = setupTimeDisplay(vid);
        const div1 = makeThumbnail(image, timeDisplay);
        return div1;
    }

    function setupVideoTitle(vid)
    {
        const div2 = document.createElement('div');
        div2.setAttribute('class', 'col-lg-6 pr-0');
        const name = document.createElement('p');
        div2.appendChild(name);
        name.textContent = vid.metadata.title;
        return div2;
    }

    function makeThumbnail(image, timeDisplay)
    {
        const div1 = document.createElement('div');
        div1.setAttribute('class', 'col-lg-6 thumbnail text-right align-bottom pl-0');
        div1.appendChild(image);
        div1.appendChild(timeDisplay);
        return div1;
    }

    function setupTimeDisplay(vid)
    {
        const timeDisplay = document.createElement('p');
        var duration = new Date(null);
        duration.setSeconds(vid.metadata.duration);
        var MHSTime = duration.toISOString().substr(11, 8);
        var newDur = trimDuration(MHSTime);
        timeDisplay.textContent = newDur;
        return timeDisplay;
    }

    function makeImage(vid)
    {
        const image = document.createElement('img');
        image.setAttribute('class', 'img-fluid');
        image.setAttribute('style', 'cursor:pointer;');
        image.setAttribute('src', vid.thumbnails[0].url);
        return image;
    }

    function makeContainer()
    {
        const container = document.createElement('div');
        container.setAttribute('class', 'row playlistItem');
        //image event listener
        container.addEventListener('click', function ()
        {
            const index = thumbs.indexOf(this);
            nextVideo = playList[index];
            videoSource.setAttribute('src', nextVideo.assets[1].url);
            videoPlayer.load();
            videoTitle.textContent = nextVideo.metadata.title;
            description.textContent = nextVideo.metadata.description;
            videoPlayer.play();
            playList.splice(index, 1);
            thumbs.splice(index, 1);
            this.remove();
        });
        return container;
    }
}

function trimDuration(duration){
    while(duration.charAt(0) === '0' || duration.charAt(0) === ':'){
        duration = duration.slice(1);
    }
    return duration;
}

