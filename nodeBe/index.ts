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

type positionType = { position: [number, number, number]; rotation: any };

// io.on("connection", (socket) => {
//   socket.on("join Room", async ({ roomId }: { roomId: string }) => {
//     console.log("join Room");
//     console.log(roomId);
//     // 소켓이 들어가있는 룸들을 다 disconnect
//     console.log(socket.rooms);
//     console.log(socket.id);
//     for (let room of Array.from(socket.rooms).slice(1)) {
//       socket.leave(room);
//     }
//     // 새로 들어온 roomid 로 join
//     socket.join(roomId);
//     console.log(socket.rooms);
//   });
//   socket.on("message", ({ name, message }: messageType) => {
//     console.log(name, message);
//     // 받은 roomId로 이름과 메시지를 전송
//     io.to(Array.from(socket.rooms)[1]).emit("message", { name, message });
//   });

//   socket.on("position", ({ position, rotation }: positionType) => {
//     // 받은 roomId로 이름과 메시지를 전송
//     socket
//       .to(Array.from(socket.rooms)[1])
//       .emit("position", { position, rotation });
//   });

//   socket.on("disconnect", () => {
//     console.log("disconnect");
//   });
// });
// server.listen(4001, function () {
//   console.log("listening on port 4000");
// });

io.on("connection", (socket) => {
  socket.on("join Room", async ({ roomId }: { roomId: string }) => {
    console.log("join Room", roomId, socket.id);
    for (let room of Array.from(socket.rooms).slice(1)) {
      socket.leave(room);
    }
    // 새로 들어온 roomid 로 join
    socket.join(roomId);
    // const userList = Array.from(
    //   io.sockets.adapter.rooms.has(roomId)
    //     ? io.sockets.adapter.rooms.get(roomId)
    //     : []
    // );
    // console.log("userList", userList);
    // socket.to(roomId).emit("join", {
    //   userId: socket.id,
    //   roomId,
    //   userList,
    // });
  });

  socket.on("message", ({ name, message }: messageType) => {
    console.log(name, message);
    // 받은 roomId로 이름과 메시지를 전송
    io.to(Array.from(socket.rooms)[1]).emit("message", { name, message });
  });

  socket.on("position", ({ position, rotation }: positionType) => {
    // 받은 roomId로 이름과 메시지를 전송
    socket
      .to(Array.from(socket.rooms)[1])
      .emit("position", { userId: socket.id, position, rotation });
  });

  socket.on("disconnect", () => {
    for (let room of Array.from(socket.rooms).slice(1)) {
      console.log("check room", room);
      socket.leave(room);
    }
  });
});
server.listen(4002, function () {
  console.log("listening on port 4000");
});
