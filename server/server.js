const http = require('http');
const mysql = require('mysql');
const fs = require('fs');
const url = require("url");
const md5 = require('md5-node');
const uuid = require('node-uuid')
const WebSocket = require('ws');

const connection = () => {
  let config = mysql.createConnection({
    host: 'localhost',
    user: 'lisi',
    password: '123456',
    database: 'chat',
    multipleStatements: true
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
  let body = '';
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    let data = JSON.parse(body);
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
                delete result[0].password;
                let sendData = {
                  status: '0000',
                  msg: '登录成功',
                  data: result[0]
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
                  connection().query(querySignInAccount, (err, result) => {
                    if (err) {
                      console.log('[SELECT ERROR] - ', err.message);
                      return false;
                    } else {
                      delete result[0].password;
                      let sendData = {
                        status: '0000',
                        msg: '注册成功',
                        data: result[0]
                      };
                      res.end(JSON.stringify(sendData));
                    }
                  });
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
                nickname: result[0].nickname,
                photo: result[0].photo,
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
            let arr = JSON.parse(result[0].friends);
            if (arr.length) {
              let str = '';
              for (let i in arr) {
                str += `SELECT * FROM user WHERE account = ${arr[i]};`
              }
              let friendsData = [];
              connection().query(str, (err, result) => {
                if (err) {
                  console.log('[SELECT ERROR] - ', err.message);
                  return false;
                } else {
                  if (Array.isArray(result[0])) {
                    for (let i in result) {
                      friendsData.push({
                        account: result[i][0].account,
                        photo: result[i][0].photo,
                        nickname: result[i][0].nickname,
                      })
                    }
                    let sendData = {
                      status: '0000',
                      friendsList: friendsData
                    };
                    res.end(JSON.stringify(sendData));
                  } else {
                    friendsData.push({
                      account: result[0].account,
                      photo: result[0].photo,
                      nickname: result[0].nickname,
                    });
                    let sendData = {
                      status: '0000',
                      friendsList: friendsData
                    };
                    res.end(JSON.stringify(sendData));
                  }
                }
              });
            } else {
              let sendData = {
                status: '0001',
                msg: '暂无好友',
                friendsList: []
              };
              res.end(JSON.stringify(sendData));
            }
          }
        });
        break;
      case 'A005':
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
            };
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
                  let queryRoomId = `SELECT * FROM user WHERE account LIKE ${data.id}`;
                  connection().query(queryRoomId, (err, result) => {
                    if (err) {
                      console.log('[SELECT ERROR] - ', err.message);
                      return false;
                    } else {
                      let arr = JSON.parse(result[0].room);
                      arr.push(roomId);
                      let addRoomId = `UPDATE user SET room = '${JSON.stringify(arr)}' WHERE account = ${data.id}`;
                      connection().query(addRoomId, (err, result) => {
                        if (err) {
                          console.log('[SELECT ERROR] - ', err.message);
                          return false;
                        } else {
                          // 添加接收方信息池id
                          let queryRoomId = `SELECT * FROM user WHERE account LIKE ${data.toId}`;
                          connection().query(queryRoomId, (err, result) => {
                            if (err) {
                              console.log('[SELECT ERROR] - ', err.message);
                              return false;
                            } else {
                              let arr = JSON.parse(result[0].room);
                              arr.push(roomId);
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
      case 'A006':
        let queryMessageRecord = `SELECT * FROM message WHERE id LIKE ${data.roomId}`;
        connection().query(queryMessageRecord, (err, result) => {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return false;
          } else {
            let arr = JSON.parse(result[0].message);
            arr.push(data.mq);
            for (let i in arr) {
              console.log(arr[i].msgData.data.includes('base64'))
              if(arr[i].msgData.type === 'picture' && arr[i].msgData.data.includes('base64')) {
                let base64Data = arr[i].msgData.data.replace(/^data:image\/\w+;base64,/, "");
                let dataBuffer = Buffer.from(base64Data, 'base64');
                let imgName = `${uuid.v1()}.png`;
                fs.writeFile(`./img/${imgName}`, dataBuffer, function (err) {
                  if (err) {
                    console.log(err);
                  }
                });
                arr[i].msgData.data = `http://localhost:8081/${imgName}`
              }
            }
            let storedMessageRecord = `UPDATE message SET message = '${JSON.stringify(arr)}' WHERE id = ${data.roomId}`;
            connection().query(storedMessageRecord, (err, result) => {
              if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return false;
              } else {
                let sendData = {
                  status: '0000',
                };
                res.end(JSON.stringify(sendData));
              }
            });
          }
        });
        break;
      case 'A007':
        let getMessageRecord = `SELECT * FROM message WHERE id LIKE ${data.roomId}`;
        connection().query(getMessageRecord, (err, result) => {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return false;
          } else {
            let sendData = {
              status: '0000',
              mq: result[0].message
            };
            res.end(JSON.stringify(sendData));
          }
        });
        break;
      case 'A008':
        let getMessageList = `SELECT * FROM user WHERE account LIKE ${data.account}`;
        connection().query(getMessageList, (err, result) => {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return false;
          } else {
            if (JSON.parse(result[0].room).length) {
              let arr = JSON.parse(result[0].room);
              let str = '';
              for (let i in arr) {
                str += `SELECT * FROM message WHERE id = ${arr[i]};`
              }
              connection().query(str, (err, result) => {
                if (err) {
                  let sendData = {
                    status: '0000',
                    list: []
                  };
                  res.end(JSON.stringify(sendData));
                  return false;
                } else {
                  let newArr = [];
                  if (Array.isArray(result[0])) {
                    // 多点信息记录
                    for (let i in result) {
                      if (JSON.parse(result[i][0].message).length) {
                        newArr.push(JSON.parse(result[i][0].message).pop())
                      }
                    }
                    // 多点信息头像
                    let str = '';
                    for (let i in newArr) {
                      if (newArr[i].toId === data.account) {
                        str += `SELECT * FROM user WHERE account = ${newArr[i].id};`
                      } else {
                        str += `SELECT * FROM user WHERE account = ${newArr[i].toId};`
                      }
                    }
                    connection().query(str, (err, result) => {
                      if (err) {
                        let sendData = {
                          status: '0000',
                          list: []
                        };
                        res.end(JSON.stringify(sendData));
                        return false;
                      } else {
                        if (Array.isArray(result[0])) {
                          for (let i in newArr) {
                            newArr[i].photo = result[i][0].photo
                            newArr[i].nickname = result[i][0].nickname
                          }
                          let sendData = {
                            status: '0000',
                            list: newArr
                          };
                          res.end(JSON.stringify(sendData));
                        } else {
                          for (let i in newArr) {
                            newArr[i].photo = result[i].photo
                            newArr[i].nickname = result[i].nickname
                          }
                          let sendData = {
                            status: '0000',
                            list: newArr
                          };
                          res.end(JSON.stringify(sendData));
                        }
                      }
                    });
                  } else {
                    // 单点信息记录
                    for (let i in result) {
                      if (JSON.parse(result[i].message).length) {
                        newArr.push(JSON.parse(result[i].message).pop())
                      }
                    }
                    // 单点信息头像
                    let str = '';
                    for (let i in newArr) {
                      if (newArr[i].toId === data.account) {
                        str += `SELECT * FROM user WHERE account = ${newArr[i].id};`
                      } else {
                        str += `SELECT * FROM user WHERE account = ${newArr[i].toId};`
                      }
                    }
                    connection().query(str, (err, result) => {
                      if (err) {
                        let sendData = {
                          status: '0000',
                          list: []
                        };
                        res.end(JSON.stringify(sendData));
                        return false;
                      } else {
                        newArr[0].photo = result[0].photo;
                        newArr[0].nickname = result[0].nickname
                        let sendData = {
                          status: '0000',
                          list: newArr
                        };
                        res.end(JSON.stringify(sendData));
                      }
                    });
                  }
                }
              });
            } else {
              let sendData = {
                status: '0000',
                list: []
              };
              res.end(JSON.stringify(sendData));
            }
          }
        });
        break;
      case 'A009':
        let getUserData = `SELECT * FROM user WHERE account LIKE ${data.account}`;
        connection().query(getUserData, (err, result) => {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return false;
          } else {
            let sendData = {
              status: '0000',
              data: {
                nickname: result[0].nickname,
                photo: result[0].photo
              }
            };
            res.end(JSON.stringify(sendData));
          }
        });
        break;
      case 'A010':
        let changeNickname = `UPDATE user SET nickname = '${data.nickname}' WHERE account = ${data.account}`;
        connection().query(changeNickname, (err, result) => {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            let sendData = {
              status: '0001',
              msg: '修改失败'
            };
            res.end(JSON.stringify(sendData));
            return false;
          } else {
            let sendData = {
              status: '0000',
              msg: '修改成功'
            };
            res.end(JSON.stringify(sendData));
          }
        });
        break;
      case 'A011':
        let base64Data = data.photo.replace(/^data:image\/\w+;base64,/, "");
        let dataBuffer = Buffer.from(base64Data, 'base64');
        let imgName = `${uuid.v1()}.png`;
        fs.writeFile(`./img/${imgName}`, dataBuffer, function (err) {
          if (err) {
            console.log(err);
          } else {
            // 保存成功
            let changePhoto = `UPDATE user SET photo = 'http://localhost:8081/${imgName}' WHERE account = ${data.account}`;
            connection().query(changePhoto, (err, result) => {
              if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                let sendData = {
                  status: '0001',
                  msg: '修改失败'
                };
                res.end(JSON.stringify(sendData));
                return false;
              } else {
                let sendData = {
                  status: '0000',
                  msg: '修改成功'
                };
                res.end(JSON.stringify(sendData));
              }
            });
          }
        })
        break;
    }
  })
}).listen(8080);

http.createServer((req, res) => {
  let pathname = url.parse(req.url).pathname;
  res.writeHead(200, {"Content-Type": "text/plain"});
  fs.readFile(`./img${pathname}`, function (err, data) {
    if (err) {
      console.log('读取错误')
    } else {
      res.end(data);
    }
  })
}).listen(8081);

const ws = new WebSocket.Server({port: 8082}, () => {
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
      // console.log('前端主动断开连接' + msg);
    })
  });
});

