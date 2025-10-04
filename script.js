console.log("Welcome to Spotify");

// Variables
let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let songItems = Array.from(document.getElementsByClassName('songItem'));
let currentSongText = document.getElementById('currentSong');
let nextBtn = document.getElementById('next');
let prevBtn = document.getElementById('previous');
let volumeSlider = document.getElementById('volumeSlider');

// Songs array
let songs = [
    {songName: "Let Me Love You - Justin Bieber", filePath: "songs/1.mp3", coverPath: "1.jpg"},
    {songName: "Faded - Alan Walker", filePath: "songs/2.mp3", coverPath: "2.jpg"},
    {songName: "Alone - Alan Walker", filePath: "songs/3.mp3", coverPath: "3.jpg"},
    {songName: "On & On - Cartoon", filePath: "songs/4.mp3", coverPath: "4.jpg"},
    {songName: "Spectre - Alan Walker", filePath: "songs/5.mp3", coverPath: "5.jpg"},
    {songName: "Fearless - Lost Sky", filePath: "songs/6.mp3", coverPath: "6.jpg"},
    {songName: "Invincible - DEAF KEV", filePath: "songs/7.mp3", coverPath: "7.jpg"},
    {songName: "Heroes Tonight - Janji", filePath: "songs/8.mp3", coverPath: "8.jpg"},
    {songName: "Skyline - Elektronomia", filePath: "songs/9.mp3", coverPath: "9.jpg"},
    {songName: "Shine - Spektrem", filePath: "songs/10.mp3", coverPath: "10.jpg"}
];

// Initialize song items
songItems.forEach((element, i) => {
    element.getElementsByTagName("img")[0].src = songs[i].coverPath;
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
});

// Initialize audio element
audioElement.addEventListener('loadeddata', () => {
    console.log('Audio loaded successfully');
});

audioElement.addEventListener('error', (e) => {
    console.error('Error loading audio:', e);
    showError('Failed to load audio file');
});

// Play/Pause Master Button
masterPlay.addEventListener('click', () => {
    if(audioElement.paused || audioElement.currentTime <= 0){
        audioElement.play().catch(error => {
            console.error('Error playing audio:', error);
            showError('Failed to play audio');
        });
        masterPlay.classList.replace('fa-play-circle', 'fa-pause-circle');
        gif.style.opacity = 1;
    } else {
        audioElement.pause();
        masterPlay.classList.replace('fa-pause-circle', 'fa-play-circle');
        gif.style.opacity = 0;
    }
});

// Update progress bar
audioElement.addEventListener('timeupdate', () => {
    if (audioElement.duration) {
        myProgressBar.value = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    }
});

// Seek functionality
myProgressBar.addEventListener('input', () => {
    if (audioElement.duration) {
        audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
    }
});

// Volume control
volumeSlider.addEventListener('input', () => {
    audioElement.volume = volumeSlider.value / 100;
});

// Initialize volume
audioElement.volume = 0.7;

// Function to play a song
function playSong(){
    songItems.forEach(e => e.classList.remove('active'));
    songItems[songIndex].classList.add('active');

    audioElement.src = songs[songIndex].filePath;
    audioElement.currentTime = 0;
    
    audioElement.play().catch(error => {
        console.error('Error playing song:', error);
        showError('Failed to play song');
    });

    masterPlay.classList.replace('fa-play-circle', 'fa-pause-circle');
    gif.style.opacity = 1;

    currentSongText.innerText = songs[songIndex].songName;
    
    // Update individual play buttons
    updatePlayButtons();
}

// Function to update all play buttons
function updatePlayButtons() {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element, index) => {
        if (index === songIndex) {
            element.classList.remove('fa-play-circle');
            element.classList.add('fa-pause-circle');
        } else {
            element.classList.remove('fa-pause-circle');
            element.classList.add('fa-play-circle');
        }
    });
}

// Click on song
songItems.forEach((element, index) => {
    element.addEventListener('click', () => {
        songIndex = index;
        playSong();
    });
});

// Next/Previous buttons
nextBtn.addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    playSong();
});

prevBtn.addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    playSong();
});

// Auto play next
audioElement.addEventListener('ended', () => {
    songIndex = (songIndex + 1) % songs.length;
    playSong();
});

// Individual song play buttons
Array.from(document.getElementsByClassName('songItemPlay')).forEach((element, index) => {
    element.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the song item click
        
        if (songIndex === index && !audioElement.paused) {
            // If clicking on currently playing song, pause it
            audioElement.pause();
            masterPlay.classList.replace('fa-pause-circle', 'fa-play-circle');
            gif.style.opacity = 0;
            updatePlayButtons();
        } else {
            // Play the clicked song
            songIndex = index;
            playSong();
        }
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            masterPlay.click();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextBtn.click();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            prevBtn.click();
            break;
        case 'ArrowUp':
            e.preventDefault();
            songIndex = (songIndex - 1 + songs.length) % songs.length;
            playSong();
            break;
        case 'ArrowDown':
            e.preventDefault();
            songIndex = (songIndex + 1) % songs.length;
            playSong();
            break;
    }
});

// Error handling function
function showError(message) {
    // Create a simple error notification
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-family: 'Varela Round', sans-serif;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    // Remove error after 3 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 3000);
}

// Initialize the first song
updatePlayButtons();