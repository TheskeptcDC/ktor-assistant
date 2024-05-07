document.addEventListener('DOMContentLoaded', function () {
    const videoPlayer = document.getElementById('videoPlayer');
    const videoThumbnails = document.getElementById('videoThumbnails');
    const transcriptSection = document.getElementById('transcript');

    fetch('/videos')
        .then(response => response.json())
        .then(videos => {
            videos.forEach(video => {
                const videoWrapper = document.createElement('div');
                videoWrapper.classList.add('videoWrapper');

                const videoElement = document.createElement('video');
                videoElement.src = video.url;
                videoElement.controls = true;
                videoElement.classList.add('thumbnailVideo'); // Add CSS class
                videoElement.onclick = (event) => {
                    event.preventDefault();
                    videoPlayer.src = video.url;
                    videoPlayer.play();
                };
                videoWrapper.appendChild(videoElement);

                const thumbnailImg = document.createElement('img');
                thumbnailImg.src = video.thumbnailUrl;
                thumbnailImg.style.width = '120px';
                thumbnailImg.style.height = 'auto';
                videoWrapper.appendChild(thumbnailImg);

                videoThumbnails.appendChild(videoWrapper);
            });
        });

    // Update transcript section as the video plays
    videoPlayer.addEventListener('timeupdate', function() {
        const currentTime = videoPlayer.currentTime;
        fetchTranscript(currentTime)
            .then(transcript => {
                // Update transcript section with the fetched transcript
                transcriptSection.textContent = transcript;
            })
            .catch(error => {
                console.error('Error fetching transcript:', error);
            });
    });

    // Function to fetch transcript based on current time
    function fetchTranscript(currentTime) {
        // Replace this with your logic to fetch transcript based on currentTime
        // For demonstration purposes, returning a dummy transcript
        return new Promise((resolve) => {
            const dummyTranscript = `Transcript for current time ${currentTime}`;
            resolve(dummyTranscript);
        });
    }
});


// Function to upload video file
function uploadVideo(formData) {
    console.log("Video Form Data:", formData); // Log the form data before sending the request

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/upload', true); // Include the port number here
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log(xhr.responseText);
        } else {
            console.error('Video upload failed');
        }
    };
    xhr.send(formData);
}


// Event listener for video form submission
document.getElementById('videoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log("Video form submitted"); // Log to check if event listener is triggered
    
    const formData = new FormData();
    const fileInput = document.getElementById('videoInput');
    const file = fileInput.files[0];
    formData.append('video', file);
    uploadVideo(formData);
});

// Function to upload text file
function uploadText(formData) {
    console.log("Text Form Data:", formData); // Log the form data before sending the request

    const url = 'http://localhost:8080/upload'; // Include the full URL with the port number

    fetch(url, {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        console.log('Success:', data);
        alert('File uploaded successfully.');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error uploading file.');
    });
}

// Event listener for text form submission
document.getElementById('textForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get file name and content
    const textFileNameElement = document.getElementById('textFileName');
    const textInputElement = document.getElementById('textInput');
    const fileNameWithExtension = textFileNameElement.value.trim() + '.txt';
    const textContent = textInputElement.value.trim();

    if (!fileNameWithExtension) {
        alert('Please enter a file name for the text file.');
        return;
    }

    if (!textContent) {
        alert('Please enter some text.');
        return;
    }

    // Create Blob object from text content
    const blob = new Blob([textContent], { type: 'text/plain' });

    // Create FormData object to send to server
    const formData = new FormData();
    formData.append('text', blob, fileNameWithExtension);

    // Upload text to server
    uploadText(formData);
});

function toggleSection(sectionId) {
    const sectionContent = document.getElementById(sectionId);
    sectionContent.style.display = sectionContent.style.display === 'block' ? 'none' : 'block';
}