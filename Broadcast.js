const socket = io();
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001',
});

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

function startBroadcast() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
      localVideo.srcObject = stream;

      myPeer.on('open', (id) => {
        socket.emit('join-room', '213', id, true);
      });

      myPeer.on('call', (call) => {
        call.answer(stream);
      });

      socket.on('user-connected', (userId, isInitiator) => {
        if (isInitiator) {
          const call = myPeer.call(userId, stream);
          call.on('stream', (remoteStream) => {
            remoteVideo.srcObject = remoteStream;
          });
        }
      });

      socket.on('user-disconnected', (userId) => {
        // Handle user disconnection
      });
    })
    .catch((error) => {
      console.error('Error accessing media devices:', error);
    });
}
