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

updateImage.addEventListener('click', function () {
    inputFile.click();
});

let getFile = document.getElementById("file");

getFile.onchange = function () {
    profilePic.src = URL.createObjectURL(getFile.files[0]);
};

// Function to play audio based on emotion
function playEmotionAudio(emotion) {
    switch (emotion) {
        case "angry":
            angryAudio.play();
            break;
        // Add cases for other emotions and play corresponding audio files
        case "disgusted":
            disgustedAudio.play();
            break;
        case "fearful":
            fearfulAudio.play();
            break;
        case "happy":
            happyAudio.play();
            break;
        case "neutral":
            neutralAudio.play();
            break;
        case "sad":
            sadAudio.play();
            break;
        case "surprised":
            surprisedAudio.play();
            break;
        default:
            console.log("Unsupported emotion");
    }
}