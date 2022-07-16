const Socket = require('./socket.js');
const Request = require('./request.js');
const Response = require('./response.js');
const Interface = require('./interface.js');

let defaultRoute = (req, res) => {
    res.send('Cannot '+req.method+' '+req.path)
}

class App{
    constructor(){
        let server = new Socket();
        let inter = new Interface(server);
        
        server.onRequest = ( socket ) => {
            let sentHead = false;
        
            let req = new Request();
            let res = new Response(socket);
        
            socket.onData = ( data ) => {
                if(sentHead === false){
                    sentHead = true;
                    data = data.toString();
        
                    let infoBits = data.split('\n')[0];
                    infoBits = infoBits.split(' ');
        
                    req.error = ( err ) => {
                        socket.close();
                        console.log(err);
                    }
        
                    req.setMethod(infoBits[0]);
                    req.setPath(infoBits[1]);
        
                    let headers = data.split('\r\n');
                    headers.shift();
        
                    headers.forEach(h => {
                        if(h.split(':')[0] === '')return;
        
                        let hsplit = h.split(': ');
                        hsplit.shift();
                        hsplit = hsplit.join(': ');
        
                        req.addHeader(h.split(':')[0], hsplit);
                    })
        
                    if(req.method === 'POST' || req.method === 'PUT'){
                        let body = data.split('\r\n\r\n');
                        body.shift();
        
                        req.onBody(body.join('\r\n\r\n'));
                    }
        
                    let routes = inter.routes.filter(x => 
                        (x.path === req.path || x.path.replace(req.path, '') === '*') &&
                        (x.method === req.method || x.method === '*')
                    );

                    routes.push({ func: defaultRoute });

                    let callRoute = ( i = 0 ) => {
                        routes[i].func(req, res, () => {
                            callRoute(i + 1)
                        })
                    }

                    callRoute();
                } else{
                    req.onBody(data);
                }
            }
        }

        this.interface = inter;
    }
}

let out = () => new App().interface
out.App = App;

module.exports = out;