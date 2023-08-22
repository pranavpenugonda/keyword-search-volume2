const inputEl = document.getElementById('input');
const searchBtnEl = document.getElementById('searchBtn');
const volumeTextEl = document.getElementById('volumeText');
const spinnerEl = document.getElementById('spinner');

let apiKey = "AIzaSyDMa1068JLooNDcfLhLz1uloSl-Gv4AFD8";

function onDisplayResult(keyword, averageViews) {
    spinnerEl.classList.add('d-none');
    volumeTextEl.textContent = `The average views for '${keyword}' in the past year: ${averageViews.toFixed(2)}`;
}

function onSearch() {
    spinnerEl.classList.remove('d-none');
    const keyword = inputEl.value;
    let options = {
        method: "GET"
    };
    
    let videoSearchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&q=${keyword}&maxResults=10&type=video`;
    
    fetch(videoSearchUrl, options)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            const videoIds = data.items.map(item => item.id.videoId).join(',');
            let videoStatsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=statistics&id=${videoIds}`;
            
            fetch(videoStatsUrl, options)
                .then(function(response) {
                    return response.json();
                })
                .then(function(statsData) {
                    const viewsArray = statsData.items.map(item => parseInt(item.statistics.viewCount));
                    const totalViews = viewsArray.reduce((total, views) => total + views, 0);
                    const averageViews = totalViews / viewsArray.length;
                    onDisplayResult(keyword, averageViews);
                });
        });
}
