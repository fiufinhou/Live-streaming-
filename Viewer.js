const socket = io();
const myPeer = new Peer(undefined, {
  host: 'https://fiufinhou.github.io/Live-streaming-/',
  port: '3001',
});

const remoteVideo = document.getElementById('remoteVideo');

myPeer.on('open', (id) => {
  socket.emit('join-room', '213', id, false);
});

myPeer.on('call', (call) => {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
      call.answer(stream);
      call.on('stream', (remoteStream) => {
        remoteVideo.srcObject = remoteStream;
      });
    })
    .catch((error) => {
      console.error('Error accessing media devices:', error);
    });
});

socket.on('user-connected', (userId, isInitiator) => {
  if (isInitiator) {
    const call = myPeer.call(userId, null);
    call.on('stream', (remoteStream) => {
      remoteVideo.srcObject = remoteStream;
    });
  }
});

socket.on('user-disconnected', (userId) => {
  // Handle user disconnection
});
