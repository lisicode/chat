const ws = require("nodejs-websocket");
console.log("开始建立连接...")

ws.createServer((connect) => {
  connect.on("text", function (str) {
    console.log("收到的信息为:" + str)
    connect.sendText("success");
  })

  connect.on("close", function (code, reason) {
    console.log("关闭连接")
  });

  connect.on("error", function (code, reason) {
    console.log("异常关闭")
  });
}).listen(8080)

console.log("WebSocket建立完毕")
