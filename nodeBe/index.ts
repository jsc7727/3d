const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const { join } = require("path");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

type messageType = { name: string; message: string };

type positionType = { position: [number, number, number] };

io.on("connection", (socket) => {
  socket.on("join Room", async ({ roomId }: { roomId: string }) => {
    console.log("join Room");
    console.log(roomId);
    // 소켓이 들어가있는 룸들을 다 disconnect
    console.log(socket.rooms);
    console.log(socket.id);
    for (let room of Array.from(socket.rooms).slice(1)) {
      socket.leave(room);
    }
    // 새로 들어온 roomid 로 join
    socket.join(roomId);
    console.log(socket.rooms);
  });
  socket.on("message", ({ name, message }: messageType) => {
    console.log(name, message);
    // 받은 roomId로 이름과 메시지를 전송
    io.to(Array.from(socket.rooms)[1]).emit("message", { name, message });
  });

  socket.on("position", ({ position }: positionType) => {
    // 받은 roomId로 이름과 메시지를 전송
    socket.to(Array.from(socket.rooms)[1]).emit("position", { position });
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
});
server.listen(4001, function () {
  console.log("listening on port 4000");
});
