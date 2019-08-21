// content.js
// data format (dictionary) - videoID: [start-time, end-time]

var player = null
var oldID = null
var vidID = null
var ytActive = 0

const playerCatcher = new MutationObserver(function (mutationList, observer) {
  player = document.querySelectorAll('ytd-watch-flexy.ytd-page-manager')[0]
  if (player) {
    observer.disconnect()
    // ensures object exists before searching for video-id
    idCatcher.observe(player, idConfig)
  }
})

const playerConfig = { childList: true, subtree: true }
playerCatcher.observe(document, playerConfig)

const idConfig = { attributes: true }

const idCatcher = new MutationObserver(function (mutationsList, observer) {
  // prevents initial site loading from triggering updates twice
  oldID = vidID
  vidID = player.getAttribute('video-id')
  if (oldID !== vidID && vidID) {
    console.log(vidID)
    /* var times = [0, 10]
    if ( vidID == 'jsJd_pOyNYc' ){
        times = [3, 13]
    } else if ( vidID == 'ubrLxJrtcX0' ){
        times = [30, 50]
    }
    setValue(times) */
    getValue()
  };
})

function setValue (times) {
  chrome.storage.local.set({ vidID: times }, function () {
    if (chrome.extension.lastError) {
      console.log('An error occured: ' + chrome.extension.lastError.message)
    }
    console.log('setsetsetset')
  })
}

function getValue () {
  chrome.storage.local.get(['vidID'], function (result) {
    if (result.vidID) {
      var start = result.vidID[0]
      var end = result.vidID[1]
      console.log(start + ' | ' + end)
      skip(start, end)
    } else {
      console.log('no data for this vid boi')
    }
  })
  getTime()
}

function skip (start, end) {
  console.log('wewewewewew')
}

function injectScript (func) {}


function getTime () {
  var actualCode = '(' + function () {
    ytplayer = document.getElementById('movie_player')
    let timecheck = setInterval(function () {
      console.log(ytplayer.getCurrentTime())
    }, 1000)
  } + ')();'
  var script = document.createElement('script')
  script.textContent = actualCode;
  (document.head || document.documentElement).appendChild(script)
  script.remove()
}
