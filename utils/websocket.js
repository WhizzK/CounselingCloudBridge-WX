const Stomp = require('./stomp.js').Stomp;

let socketOpen = false
let socketMsgQueue = []

export default {
  client: null,
  init(url, header ,connectWS) {
    if (this.client) {
      return Promise.resolve(this.client)
    }

    return new Promise((resolve, reject) => {
      const ws = {
        send: this.sendMessage,
        onopen: null,
        onmessage: null
      }

      wx.connectSocket({ url, header })

      wx.onSocketOpen(function (res) {
        console.log('WebSocket连接已打开！', res)

        socketOpen = true
        for (let i = 0; i < socketMsgQueue.length; i++) {
          ws.send(socketMsgQueue[i])
        }
        socketMsgQueue = []

        ws.onopen && ws.onopen()
      })

      wx.onSocketMessage(function (res) {
      	// ios 缺少 0x00 导致解析失败
        if (res && res.data) {
          let value = res.data;
          let code = value.charCodeAt(value.length - 1);
          if (code !== 0x00) {
            value += String.fromCharCode(0x00);
            res.data = value;
          }
        }
        ws.onmessage && ws.onmessage(res)
      })

      wx.onSocketError(function (res) {
        console.log('WebSocket 错误！', res)
      })

      wx.onSocketClose((res) => {
        this.client = null
        socketOpen = false
        console.log('WebSocket 已关闭！', res)
        if(res.code !== 1000){
          setTimeout(()=>{
            connectWS()
          },3000)
        }
      })

      Stomp.setInterval = function (interval, f) {
        return setInterval(f, interval)
      }
      Stomp.clearInterval = function (id) {
        return clearInterval(id)
      }

      const client = (this.client = Stomp.over(ws))
      // 关闭连接
      client.close = () =>{
        wx.closeSocket()
      }
      client.connect(header, function () {
        console.log('stomp connected')
        resolve(client)
      })
    })
  },
  sendMessage(message) {
    if (socketOpen) {
      wx.sendSocketMessage({
        data: message,
      })
    } else {
      socketMsgQueue.push(message)
    }
  },
}
