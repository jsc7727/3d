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

type messageType = { roomId: string; name: string; message: string };

type positionType = {
  position: [number, number, number];
  rotation: any;
  roomId?: string;
};

io.on("connection", (socket) => {
  socket.on("join Room", async ({ roomId }: { roomId: string }) => {
    console.log("join Room", roomId, socket.id);
    for (let room of Array.from(socket.rooms)) {
      io.in(roomId).emit("disconnectingAnotherUser", socket.id);
      socket.leave(room);
    }
    // 새로 들어온 roomid 로 join
    socket.join(roomId);
    const userList = Array.from(
      io.sockets.adapter.rooms.has(roomId)
        ? io.sockets.adapter.rooms.get(roomId)
        : []
    );
    io.in(roomId).emit("setUserList", {
      userId: socket.id,
      roomId,
      userList,
    });
  });

  socket.on("message", ({ roomId, name, message }: messageType) => {
    console.log(name, message);
    // 받은 roomId로 이름과 메시지를 전송
    // io.to(Array.from(socket.rooms)[1]).emit("message", { name, message });
    socket.to(roomId).emit("message", { name, message });
  });

  socket.on("position", ({ roomId, position, rotation }: positionType) => {
    // 받은 roomId로 이름과 메시지를 전송
    // socket
    //   .to(Array.from(socket.rooms)[1])
    //   .emit("position", { userId: socket.id, position, rotation });
    socket
      .to(roomId)
      .emit("position", { userId: socket.id, position, rotation });
  });

  socket.on("changeRoom", () => {
    for (let roomId of Array.from(socket.rooms)) {
      io.in(roomId).emit("disconnectingAnotherUser", socket.id);
    }
  });

  socket.on("disconnecting", () => {
    console.log("disconnecting 디스커넥트", socket.rooms);
    for (let roomId of Array.from(socket.rooms)) {
      console.log("check room", roomId);
      socket.to(roomId).emit("disconnectingAnotherUser", socket.id);
    }
  });

  socket.on("disconnect", () => {
    console.log("disconnect 디스커넥트 ---------------------------");
    for (let room of Array.from(socket.rooms)) {
      socket.leave(room);
    }
  });
});
server.listen(4001, function () {
  console.log("listening on port 4000");
});
