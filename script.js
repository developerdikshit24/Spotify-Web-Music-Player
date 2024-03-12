let currentSong = new Audio();
let songs;
let currFolder;
let button = document.querySelector(".button");
let playbar = document.querySelector(".playbar")
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/spotify_clone/${folder}`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}`)[1])
        }
    }

    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML +=
            `<li>
                 <img class="invert music" src="./Spotify_clone/img/music.svg" alt="music">
                 <div class="info">
                     <div>${song.replaceAll("-", " ").replaceAll("/", "").split(".mp3")[0]}</div>

                 <div class ="foldername">${currFolder.split("songs/")[1].replaceAll("-", " ")}</div>
                 </div>
               <div class="playnow flex justify-content align-item">
                <span>Play Now</span>
                <img id="listplay" class=" icon invert ply-btn" src="./Spotify_clone/img/playbar.svg" alt="play">
                </div>
            </li>`
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).
        forEach((e) => {
            e.addEventListener("click", (element) => {
                playmusic(e.querySelector(".info>div").innerHTML.replace("", "/") + ".mp3")
                play.src = "./Spotify_clone/img/paused.svg"
                playbar.classList.add('animation');
            }
            )
        }
        )

    return songs
}
let playmusic = (audio, pause = false) => {
    currentSong.src = `/spotify_clone/${currFolder}` + audio.replaceAll(" ", "-");
    if (!pause) {

        currentSong.play()
    }
    document.querySelector(".song-info").innerHTML = audio.replaceAll("-", " ").replaceAll("/", "").split(".mp3")[0];
    document.querySelector(".song-time").innerHTML = "00:00/00:00";
}


// let num = Math.random() * 4;
// let rand = Math.round(num);
async function getFolder() {
    let folderUrl = await fetch(`/spotify_clone/songs`)
    let response = await folderUrl.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchor = div.getElementsByTagName("a");
    let array = Array.from(anchor)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        let cardContain = document.querySelector(".cardContainer");
        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/songs/")[1];
            let folderUrl = await fetch(`/spotify_clone/songs/${folder}/info.json`)
            response = await folderUrl.json()
            cardContain.innerHTML = cardContain.innerHTML + `<div data-folder="${folder}" class="card">
                    <img src="/spotify_clone/songs/${folder}/cover.jpg" alt=""> 
                    <div class="play">
                        <img src="./Spotify_clone/img/play.svg" alt="play">
                        </div>
                    <h2 class="title">${response.title}</h2>
                    <p class="discription">${response.description}</p>
                </div>
                `
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach((e) => {
        e.addEventListener("click", async (item) => {
            songs = await getSongs(`/songs/${item.currentTarget.dataset.folder}`)
            if (songs == "") {
                alert("No Songs Found ")
                playbar.classList.remove('animation');
            }
            else {
                playmusic(songs[0]);
                playbar.classList.add('animation');
                play.src = "./Spotify_clone/img/paused.svg"
            }
        }
        )
    }
    )

}

// Log In Banner Show If Not Login....
let logInContainer = document.querySelector(".container-login");
function logClick() {
    let logItm = localStorage.getItem("user-data")
    if (!logItm) {
        document.addEventListener("DOMContentLoaded", () => {
            button.innerHTML = `<button onclick="clickbtn()"   class="t-btn signUp-btn">Sign up </button>
                    <button onclick="clickbtn()"  class="t-btn logIn-btn">Log in </button>`

            logInContainer.style.display = "block"
        }
        )
    } else if (logItm) {
        logInContainer.style.display = "none"
    }
    document.querySelector(".cross").addEventListener("click", (e) => {
        logInContainer.style.display = "none"

    }
    )
}



function logInData() {
    let name = document.querySelector(".name");
    let email = document.querySelector(".email");
    if (name.value == "" || email.value == "") {
        document.querySelector(".input-msg").style.display = "block"

    } else {
        button.innerHTML = ` <img class = " invert user" src ="./Spotify_clone/img/user.svg" alt ="user">
        <div class ="user-name"><h3> ${name.value}</h3>
        <p class =" user-email" >${email.value.slice("@")}</p> 
        </div>
        <button onclick=" removeData() " class= "logIn-btn logout" > Log Out </button>`
        localStorage.setItem("user-data", button.innerHTML);
        logInContainer.style.display = "none"

    }
}
function getItems() {
    button.innerHTML = localStorage.getItem("user-data")

}
function removeData() {
    document.querySelector(".logout").addEventListener("click", () => {
        localStorage.removeItem("user-data")
        button.innerHTML = `<button  onclick="clickbtn()"  class=" t-btn signUp-btn">Sign up </button>
        <button onclick="clickbtn()" class=" t-btn logIn-btn">Log in </button>`

    }
    )
}
let clickbtn = (e) => {
    logInContainer.style.display = "block"
    let form = logInContainer.innerHTML;

}
async function main() {
    await getSongs(`songs/bollywood-dance-music`)
    playmusic(songs[0], true)
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "./Spotify_clone/img/paused.svg"
            playbar.classList.add('animation');
        }
        else {
            currentSong.pause()
            play.src = "./Spotify_clone/img/playbar.svg"
            playbar.classList.remove('animation');
        }
    })

    // song time set by using top function
    // { function secondsToMinutesSeconds(seconds) }
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".song-time").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        // song auto next if song end 
        if (currentSong.currentTime == currentSong.duration) {
            let index = songs.indexOf(currentSong.src.split(`${currFolder}`).slice(-1)[0]);
            if ((index + 1) < songs.length) {
                playmusic(songs[index + 1]);
                play.src = "./Spotify_clone/img/paused.svg"
                playbar.classList.add('animation');
            } else {
                play.src = "./Spotify_clone/img/playbar.svg"
                playbar.classList.remove('animation');
            }
        }
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    }
    )

    //  Seekbar moving and seeking the songs 
    document.querySelector(".seekbar").addEventListener("click", (element) => {
        let persent = element.offsetX / element.target.getBoundingClientRect().width * 100;
        let circle = document.querySelector(".circle");
        circle.style.left = (persent + "%");
        currentSong.currentTime = (currentSong.duration) * persent / 100;
    }
    )
    // Seekbar Next Option
    let next = document.querySelector("#next");
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split(`${currFolder}`).slice(-1)[0]);
        console.log(index, songs);
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1]);
            playbar.classList.add('animation');
            play.src = "./Spotify_clone/img/paused.svg"
        }
    }
    )
    // Seekbar previous Option
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split(`${currFolder}`).slice(-1)[0]);
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
            playbar.classList.add('animation');
            play.src = "./Spotify_clone/img/paused.svg"
        }
    }
    )
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (e.target.value == 0) {
            document.querySelector(".vol").src = "./Spotify_clone/img/mute.svg"
        } else {
            document.querySelector(".vol").src = "./Spotify_clone/img/volume.svg"
        }
    }
    )

    document.querySelector(".range>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .50;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 50;
        }

    })
    //  Hamburger Click Event
    let hambg = document.querySelector(".hambg img");
    let crosshm = document.querySelector(".crosshm");
    hambg.addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    }
    )
    crosshm.addEventListener("click", () => {
        document.querySelector(".left").style.left = -100 + "%";
    }
    )


}


logClick();
getItems();
getFolder();
main();