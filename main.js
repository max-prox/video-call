// main.js
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');

let localStream;
let remoteStream;
let peerConnection;

// Configure media constraints
const mediaConstraints = {
  video: true,
  audio: true
};

// Start the call
startButton.addEventListener('click', startCall);

// Stop the call
stopButton.addEventListener('click', stopCall);

async function startCall() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    localVideo.srcObject = localStream;

    // Set up peer connection
    peerConnection = new RTCPeerConnection();

    // Add local stream to peer connection
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // Set up event handlers for ICE candidates and remote stream
    peerConnection.onicecandidate = handleICECandidate;
    peerConnection.ontrack = handleRemoteStream;

    // Create offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Send offer to the other peer (you would typically use a signaling server for this)
    // For simplicity, let's assume the other peer's code is similar, and the offer is received through signaling
    const receivedOffer = offer; // Replace this with the actual received offer
    await peerConnection.setRemoteDescription(new RTCSessionDescription(receivedOffer));

    // Create answer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // Send answer back to the other peer (again, signaling server needed)
    // For simplicity, let's assume the other peer's code is similar, and the answer is received through signaling
    const receivedAnswer = answer; // Replace this with the actual received answer
    await peerConnection.setRemoteDescription(new RTCSessionDescription(receivedAnswer));

    // At this point, the call is set up, and video/audio should be flowing between peers
  } catch (error) {
    console.error('Error starting call:', error);
  }
}

function handleICECandidate(event) {
  // Send the ICE candidate to the other peer (via signaling server)
  // For simplicity, let's assume the other peer's code is similar, and the candidate is received through signaling
  const receivedCandidate = event.candidate; // Replace this with the actual received ICE candidate
  peerConnection.addIceCandidate(new RTCIceCandidate(receivedCandidate));
}

function handleRemoteStream(event) {
  // Display the remote stream in the remote video element
  remoteStream = event.streams[0];
  remoteVideo.srcObject = remoteStream;
}

function stopCall() {
  // Close the peer connection and stop local media
  if (peerConnection) {
    peerConnection.close();
  }
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
  }

  // Clear video elements
  localVideo.srcObject = null;
  remoteVideo.srcObject = null;
}
