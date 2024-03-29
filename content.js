// content.js
// data format (dictionary) - videoID: [start-time, end-time]

var player = null // video player element on page
var oldID = null // last-updated video-id
var vidID = null // current video-id

function injectScript (func, var1, var2, var3) {
  var actualCode = '(' + func + ')(' + var1 + ',' + var2 + ',' + JSON.stringify(var3) + ')'
  var script = document.createElement('script')
  script.textContent = actualCode;
  (document.head || document.documentElement).appendChild(script)
  script.remove()
}

function skip (start, end, currID) {
  injectScript(function (start, end, currID) {
    ytplayer = document.getElementById('movie_player')
    if (start) {
      ytplayer.seekTo(start)
    }
    if (end) {
      var timecheck = setInterval(function () {
        // prevents old timers from not being reaped on new videos (ex. manual early skip)
        if (currID !== ytplayer.getVideoData().video_id) {
          clearInterval(timecheck)
        } else if (ytplayer.getCurrentTime() >= end) {
          ytplayer.nextVideo()
          clearInterval(timecheck)
        }
      }, 1000)
    }
  }, start, end, currID)

  console.log('wewewewewew')
}

function setValue (id, times) {
  chrome.storage.local.set({ [id]: times }, function () {
    if (chrome.extension.lastError) {
      console.log('An error occured: ' + chrome.extension.lastError.message)
    }
    console.log('set+' + id)
  })
}

function getValue (id) {
  chrome.storage.local.get(id, function (result) {
    console.log('getvalue+' + id)
    if (result) {
        console.log('yeet')
    }
    if (result[id]) {
      var start = result[id][0]
      var end = result[id][1]
      console.log(start + ' | ' + end)
      skip(start, end, id)
    } else {
      console.log('no data for this vid boi')
    }
  })
}

// monitors change in video-id for new videos
const idConfig = { attributes: true }
const idCatcher = new MutationObserver(function (mutationsList, observer) {
  // oldID prevents initial site loading from triggering program twice
  oldID = vidID
  vidID = player.getAttribute('video-id')
  if (oldID !== vidID && vidID) {
    // dummy data, set w/ UI here
    console.log(vidID)
    var times = [0, 10]
    if (vidID === 'jsJd_pOyNYc') {
      times = [3, 13]
    } else if (vidID === 'ubrLxJrtcX0') {
      times = [30, 50]
    }
    //setValue(vidID, times)
    getValue(vidID)
  };
})

// finds the video player
const playerConfig = { childList: true, subtree: true }
const playerCatcher = new MutationObserver(function (mutationList, observer) {
  player = document.querySelectorAll('ytd-watch-flexy.ytd-page-manager')[0]
  if (player) {
    observer.disconnect()
    // ensures object exists before searching for video-id
    idCatcher.observe(player, idConfig)
  }
})

playerCatcher.observe(document, playerConfig)

// autoskip 5-second delay between videos
var movieplayer = document.getElementById('movie_player')
const endCatcher = new MutationObserver(function (mutationList, observer) {
  if (movieplayer.classList.contains('ended-mode')) {
    injectScript(function () {
      ytplayer = document.getElementById('movie_player')
      ytplayer.nextVideo()
    })
  }
})

endCatcher.observe(movieplayer, idConfig)
