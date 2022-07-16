const path = require('path');

class Interface{
    constructor(server){
        this.server = server;
        this.routes = [];

        server.interface = this;
    }
    use(...args){
        if(args[0] instanceof String){
            this.routes.push({ path: path.join(args[0], '*'), func: args[1], method: '*' });
        } else{
            this.routes.push({ path: '*', func: args[0], method: '*' });
        }
    }
    all(path, func){
        this.routes.push({ path, func, method: '*' });
    }
    delete(path, func){
        this.routes.push({ path, func, method: 'DELETE' });
    }
    put(path, func){
        this.routes.push({ path, func, method: 'PUT' });
    }
    post(path, func){
        this.routes.push({ path, func, method: 'POST' });
    }
    get(path, func){
        this.routes.push({ path, func, method: 'GET' });
    }
    listen(port){
        this.server.listen(port);
    }
}

module.exports = Interface;