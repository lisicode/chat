const http = require('http');
const mysql = require('mysql');
const md5 = require('md5-node');
const WebSocket = require('ws');

const connection = () => {
  let config = mysql.createConnection({
    host: 'localhost',
    user: 'lisi',
    password: '123456',
    database: 'chat'
  });
  config.connect((err) => {
    if (err) {
      setTimeout('connection()', 2000);
    }
  });
  config.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connection();
    } else {
      throw err;
    }
  });
  return config
};

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  req.on('data', (e) => {
    let data = JSON.parse(e.toString());
    switch (data.api) {
      case 'A001':
        let querySignInAccount = `SELECT * FROM user WHERE account LIKE ${data.signInData.account}`;
        let signInAccount = `INSERT INTO user(account, password, friends, room) VALUES ('${data.signInData.account}', '${md5(data.signInData.password)}', '[]', '[]')`;
        connection().query(querySignInAccount, (err, result) => {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return false;
          } else {
            if (result.length) {
              if (result[0].password === md5(data.signInData.password)) {
                let sendData = {
                  status: '0000',
                  msg: '登录成功',
                  userData: {
                    account: result[0].account,
                  }
                };
                res.end(JSON.stringify(sendData));
              } else {
                let sendData = {
                  status: '0001',
                  msg: '密码错误'
                };
                res.end(JSON.stringify(sendData));
              }
            } else {
              connection().query(signInAccount, (err, result) => {
                if (err) {
                  console.log('[SELECT ERROR] - ', err.message);
                  let sendData = {
                    status: '0001',
                    msg: '注册失败'
                  };
                  res.end(JSON.stringify(sendData));
                  return false;
                } else {
                  let sendData = {
                    status: '0000',
                    msg: '注册成功',
                    userData: {
                      account: data.signInData.account,
                    }
                  };
                  res.end(JSON.stringify(sendData));
                }
              });
            }
          }
        });
        break;
      case 'A002':
        let queryFriendsAccount = `SELECT * FROM user WHERE account LIKE ${data.queryData}`;
        connection().query(queryFriendsAccount, (err, result) => {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return false;
          } else {
            if (result.length) {
              let sendData = {
                status: '0000',
                account: result[0].account
              };
              res.end(JSON.stringify(sendData));
            } else {
              let sendData = {
                status: '0001',
                msg: '此好友还没有注册'
              };
              res.end(JSON.stringify(sendData));
            }
          }
        });
        break;
      case 'A003':
        // 查询添加人好友列表
        let queryFriendsList = `SELECT * FROM user WHERE account LIKE ${data.account}`;
        connection().query(queryFriendsList, (err, result) => {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return false;
          } else {
            let updateList = JSON.parse(result[0].friends);
            if (updateList.includes(data.friendsData)) {
              let sendData = {
                status: '0001',
                msg: '已在好友列表中'
              };
              res.end(JSON.stringify(sendData));
            } else {
              // 添加好友
              updateList.push(data.friendsData);
              let addFriends = `UPDATE user SET friends = '${JSON.stringify(updateList)}' WHERE account = ${data.account}`;
              connection().query(addFriends, (err, result) => {
                if (err) {
                  console.log('[SELECT ERROR] - ', err.message);
                  return false;
                } else {
                  // 查询被添加人好友列表
                  let addOther = `SELECT * FROM user WHERE account LIKE ${data.friendsData}`;
                  connection().query(addOther, (err, result) => {
                    if (err) {
                      console.log('[SELECT ERROR] - ', err.message);
                      return false;
                    } else {
                      // 添加对方
                      let updateList = JSON.parse(result[0].friends);
                      if (updateList.includes(data.account)) {
                        let sendData = {
                          status: '0001',
                          msg: '已在好友列表中'
                        };
                        res.end(JSON.stringify(sendData));
                      } else {
                        updateList.push(data.account);
                        let addFriends = `UPDATE user SET friends = '${JSON.stringify(updateList)}' WHERE account = ${data.friendsData}`;
                        connection().query(addFriends, (err, result) => {
                          if (err) {
                            console.log('[SELECT ERROR] - ', err.message);
                            return false;
                          } else {
                            let sendData = {
                              status: '0000',
                              msg: '添加成功'
                            };
                            res.end(JSON.stringify(sendData));
                          }
                        });
                      }
                    }
                  })
                }
              });
            }
          }
        });
        break;
      case 'A004':
        let getFriendsList = `SELECT * FROM user WHERE account LIKE ${data.account}`;
        connection().query(getFriendsList, (err, result) => {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return false;
          } else {
            if (result.length) {
              let sendData = {
                status: '0000',
                friendsList: result[0].friends
              };
              res.end(JSON.stringify(sendData));
            } else {
              let sendData = {
                status: '0001',
                msg: '暂无好友'
              };
              res.end(JSON.stringify(sendData));
            }
          }
        });
        break;
      case "A005":
        // 匹配信息池
        let matchingRoomId = `SELECT * FROM user WHERE account LIKE ${data.id} OR account LIKE ${data.toId}`;
        connection().query(matchingRoomId, (err, result) => {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return false;
          } else {
            // 合并信息池id
            let a = JSON.parse(result[0].room);
            let b = JSON.parse(result[1].room);
            let c = a.concat(b);
            // 查找信息池id
            let matching = (arr) => {
              let tmp = [];
              if (Array.isArray(arr)) {
                arr.concat().sort().sort((a, b) => {
                  if (a === b && tmp.indexOf(a) === -1) tmp.push(a);
                });
              }
              return tmp;
            }
            // 信息池id不存在
            if (matching(c).length === 0) {
              // 创建信息池id
              let createRoom = `INSERT INTO message(message) VALUES ('[]')`;
              connection().query(createRoom, (err, result) => {
                if (err) {
                  console.log('[SELECT ERROR] - ', err.message);
                  return false;
                } else {
                  // 信息池id
                  let roomId = result.insertId;
                  // 添加发送方信息池id
                  let queryRoomId = `SELECT * FROM user WHERE account LIKE ${data.id}`
                  connection().query(queryRoomId, (err, result) => {
                    if (err) {
                      console.log('[SELECT ERROR] - ', err.message);
                      return false;
                    } else {
                      let arr = JSON.parse(result[0].room)
                      arr.push(roomId)
                      let addRoomId = `UPDATE user SET room = '${JSON.stringify(arr)}' WHERE account = ${data.id}`;
                      connection().query(addRoomId, (err, result) => {
                        if (err) {
                          console.log('[SELECT ERROR] - ', err.message);
                          return false;
                        } else {
                          // 添加接收方信息池id
                          let queryRoomId = `SELECT * FROM user WHERE account LIKE ${data.toId}`
                          connection().query(queryRoomId, (err, result) => {
                            if (err) {
                              console.log('[SELECT ERROR] - ', err.message);
                              return false;
                            } else {
                              let arr = JSON.parse(result[0].room)
                              arr.push(roomId)
                              let addRoomId = `UPDATE user SET room = '${JSON.stringify(arr)}' WHERE account = ${data.toId}`;
                              connection().query(addRoomId, (err, result) => {
                                if (err) {
                                  console.log('[SELECT ERROR] - ', err.message);
                                  return false;
                                } else {
                                  // 返回信息池id
                                  let sendData = {
                                    status: '0000',
                                    roomId: roomId,
                                  };
                                  res.end(JSON.stringify(sendData));
                                }
                              })
                            }
                          });
                        }
                      })
                    }
                  })
                }
              })
            } else {
              // 返回信息池id
              let sendData = {
                status: '0000',
                roomId: matching(c)[0],
              };
              res.end(JSON.stringify(sendData));
            }
          }
        });
        break;
      case "A006":
        console.log(data)
        break;
    }
  });
}).listen(8080);

let ws = new WebSocket.Server({port: 8081}, () => {
  let allUserData = [];
  ws.on('connection', (client) => {
    client.on('message', (e) => {
      let data = JSON.parse(e);
      switch (data.type) {
        case 'login':
          for (let i in allUserData) {
            if (allUserData[i].id === data.id) {
              allUserData.splice(i, 1)
            }
          }
          allUserData.push({
            id: data.id,
            ws: client
          });
          break;
        case 'send':
          allUserData.some((item, i) => {
            if (item.id === data.toId) {
              allUserData[i].ws.send(JSON.stringify(data));
            }
          });
          break;
      }
    });
    client.on('close', (msg) => {
      console.log('前端主动断开连接' + msg);
    })
  });
});

