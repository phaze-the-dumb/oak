const StatusCode = require('./statuses.js');
const fs = require('fs');

class Response{
    constructor(s){
        this.status = new StatusCode(200);
        this.version = 'HTTP/1.1';
        this.headers = [];

        this.s = s;
    }
    status(code){
        this.status = new StatusCode(code);
    }
    header(key, value){
        this.headers.push({ k: key, v: value });
    }
    getHeaders(){
        let text = '';

        this.headers.forEach((h, i) => {
            text += h.k + ': ' + h.v + '\r\n';
        });

        return text;
    }
    writeHead(){
        return this.version + ' ' + this.status.code + ' ' + this.status.name + '\r\n' + this.getHeaders() + '\r\n';
    }
    sendFile(file){
        fs.readFile(file, ( err, data ) => {
            if(err)return this.send(err.toString());

            this.s.send(this.writeHead());
            this.s.send(data);
            this.end();
        })
    }
    send(text){
        this.s.send(this.writeHead() + text);
        this.end();
    }
    end(){
        this.s.close();
    }
}

module.exports = Response;