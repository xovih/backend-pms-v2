const { io } = require("socket.io-client")
const socket = io("http://ws-pms.divmu.pindad.co.id")

socket.on("connect", () => {
  console.log(`Backend Server Connected !`)
})

socket.on("disconnect", () => {
  console.log("Backend Server Disconnected !");
})

module.exports = socket