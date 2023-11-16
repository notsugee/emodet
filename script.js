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


inputFile.addEventListener('change', function () {
    selectedFile = inputFile.files[0];
    if (selectedFile) {
        profilePic.src = URL.createObjectURL(selectedFile);
    }
});


function takeSnap() {
    const picture = webcam.snap();
    profilePic.src = picture;
    selectedFile = dataURItoBlob(picture);
    
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
    fetch('http://localhost:8000/predict', {
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