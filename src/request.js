let methods = [ 'GET', 'POST', 'PUT', 'DELETE' ];

class Request{
    constructor(){
        this.method = null;
        this.path = null;
        this.headers = [];

        this.error = (err) => { throw new Error(err) };
        this.onBody = () => {};
    }
    setMethod(method){
        if(!methods.find(x => x === method))return this.error('Invaild Method')
        this.method = method;
    }
    setPath(path){
        this.path = decodeURI(path);
    }
    addHeader(k, v){
        this.headers.push({ k, v });
    }
}

module.exports = Request;