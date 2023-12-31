const updateImage = document.querySelector('.btn');
const inputFile = document.querySelector('#file');
const profilePic = document.getElementById("profile-pic");
const playIcon = document.getElementById("icon");
const angryAudio = document.getElementById("angry");
const disgustedAudio = document.getElementById("disgusted");
const fearfulAudio = document.getElementById("fearful");
const happyAudio = document.getElementById("happy");
const neutralAudio = document.getElementById("neutral");
const sadAudio = document.getElementById("sad");
const surprisedAudio = document.getElementById("surprised");
const submitButton = document.getElementById("submit-btn");
const predictedClassElement = document.getElementById("predicted-class");
const webCamElement = document.getElementById("webCam");
const canvasElement = document.getElementById("canvas");
const webcam = new Webcam(webCamElement, "user", canvasElement);
webcam.start();

let currentAudio = null; // Variable to track the currently playing audio

function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
}

updateImage.addEventListener('click', function () {
    inputFile.click();
});


let getFile = document.getElementById("file");


function takeSnap() {
    const picture = webcam.snap();
    profilePic.src = picture;
    selectedFile = dataURItoBlob(picture);

    // Pause the current audio and reset the icon to play
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        playIcon.src = 'images/play.png';
        currentAudio = null;
    }

    // Function to upload the image and get the predicted class
    uploadImage(selectedFile);
}

getFile.onchange = function () {
    const selectedFile = getFile.files[0];
    // Check if a file is selected
    if (selectedFile) {
        profilePic.src = URL.createObjectURL(selectedFile);
        // Function to upload the image and get the predicted class
        //uploadImage(selectedFile);
    }
};

function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    // Send a POST request to the FastAPI backend
    fetch('https://emodetapi.onrender.com/predict', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            // Display the predicted class on the right card
            displayPredictedClass(data.predicted_class);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayPredictedClass(predictedClass) {
    predictedClassElement.textContent = `predicted emotion: ${predictedClass}`;

    // Pause the current audio if it is playing
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        playIcon.src = 'images/play.png';
    }

    // Get the new audio element based on the predicted emotion
    const audioElement = emotionAudioMap[predictedClass];

    if (audioElement) {
        // Play the new audio
        audioElement.play();
        playIcon.src = 'images/pause.png';

        // Set the new audio as the current audio
        currentAudio = audioElement;
    }
}




document.getElementById("upload-btn").addEventListener("click", function () {
    //inputFile.click();
});

document.getElementById("file").addEventListener("change", function () {
    const selectedFile = document.getElementById("file").files[0];
    if (selectedFile) {
        document.getElementById("profile-pic").src = URL.createObjectURL(selectedFile);
        uploadImage(selectedFile);
    }
});

document.getElementById("snap-btn").addEventListener('click', function () {
    const picture = webcam.snap();
    document.getElementById("profile-pic").src = picture;
    const selectedFile = dataURItoBlob(picture);
    // Function to upload the image and get the predicted class
    uploadImage(selectedFile);
});

const emotionAudioMap = {
    'angry': new Audio('media/angry.mp3'),
    'disgusted': new Audio('media/disgusted.mp3'),
    'fearful': new Audio('media/fearful.mp3'),
    'happy': new Audio('media/happy.mp3'),
    'neutral': new Audio('media/neutral.mp3'),
    'sad': new Audio('media/sad.mp3'),
    'surprised': new Audio('media/surprised.mp3')
};



playIcon.addEventListener('click', function () {
    console.log("Play icon clicked");
    const predictedEmotion = predictedClassElement.textContent.split(': ')[1];
    console.log("Predicted Emotion:", predictedEmotion);
    const audioElement = emotionAudioMap[predictedEmotion];

    console.log("Audio Element:", audioElement);
    console.log("Audio Source:", audioElement ? audioElement.src : "N/A");
    console.log("Emotion Audio Map:", emotionAudioMap);

    if (audioElement) {
        if (currentAudio && currentAudio !== audioElement) {
            currentAudio.pause();
            currentAudio.currentTime = 0; // Reset the current audio to the beginning
            playIcon.src = 'images/play.png';
        }

        audioElement.onended = function () {
            playIcon.src = 'images/play.png';
            currentAudio = null;
        };

        if (audioElement.paused) {
            audioElement.play().then(() => {
                playIcon.src = 'images/pause.png';
                currentAudio = audioElement;
            }).catch((error) => {
                console.error('Error playing audio:', error);
            });
        } else {
            audioElement.pause();
            playIcon.src = 'images/play.png';
            currentAudio = null;
        }
    }
});

inputFile.addEventListener('change', function () {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    playIcon.src = 'images/play.png';
    currentAudio = null;

    selectedFile = inputFile.files[0];
    if (selectedFile) {
        profilePic.src = URL.createObjectURL(selectedFile);
    }
});