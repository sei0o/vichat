var io = require("socket.io");

var server = io.listen(9999);

server.on("connection", function(socket){
  var room = "";
  
  socket.on("message", function(message){
    message.from = socket.id; // 誰からかわかるように
    
    console.log("message: ", message.type);
    
    var to = message.sendto;
    if (to) {
      server.to(to).emit("message", message);
      return;
    }
    
    emitRoom("message", message); // 指定がなければbroadcast
  });
  
  socket.on("disconnect", function(){
    // ここがイベント名と同じ"disconnect"だと、
    // emitRoomでdisconnectがemitされて、
    // またdisconnectに帰って....というように無限ループになる
    emitRoom("user disconnected", { from: socket.id }); 
  });
  
  socket.on("enter", function(_room){
    console.log("Entered room: " + _room + " " + socket.id );
    room = _room;
    socket.join(room);
  });
  
  socket.on("hangup", function(){
    emitRoom("hangedup", { from: socket.id });
  });
  
  function emitRoom(type, data) {
    console.log(socket.id);
    console.log(server.nsps["/"].adapter.rooms["p"]);
    socket.broadcast.to(room).emit(type, data);
  }
});

console.log("Server Launched");