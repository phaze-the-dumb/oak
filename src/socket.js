const net = require('net');

class Socket{
    constructor(rawSocket){
        this.socket = rawSocket;
        this.onData = () => {};
    }
    send(buff){
        this.socket.write(buff);
    }
    close(){
        this.socket.destroy();
    }
}

class Server{
    constructor(){
        this.port = null;
        this.socket = null;
        this.onRequest = () => {};
    }
    listen(port){
        this.port = port;

        this.socket = net.createServer(( socket ) => {
            let s = new Socket(socket);
            this.onRequest(s);

            socket.on('data', ( chunk ) => {
                s.onData(chunk);
            })
        });

        this.socket.listen(this.port);
    }
}

module.exports = Server;