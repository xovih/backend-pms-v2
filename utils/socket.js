const { io } = require("socket.io-client")
const socket = io("http://ws-pms.divmu.pindad.co.id")
// const socket = io("http://192.168.206.179:4502")

socket.on("connect", () => {
  console.log(`Backend Server Connected !`)
})

socket.on("disconnect", () => {
  console.log("Backend Server Disconnected !");
})

module.exports = socket