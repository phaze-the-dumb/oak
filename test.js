const oak = require('./');

let app = oak();

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

app.get('/', (req, res, next) => {
    res.send('fuck')
})

app.post('/', (req, res, next) => {
    res.send('fuck you as well')
})

app.listen(81);