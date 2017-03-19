var app = require('./config/server');

app.set('view engine', 'ejs');
app.set('views', './application/views');

var consign = require('consign');

consign()
    .include('./application/routes')
    .then('./application/controllers')
    .into(app);

var server = app.listen(80, function () {
    console.log('Servidor Iniciado');
});

var io = require('socket.io').listen(server);

app.set('io', io);

io.on('connection', function (socket) {
    console.log("Jogador conectado!");

    socket.on('disconnect', function () {
        console.log("Jogador desconectado!");
    });

    socket.on('humanPlay', function (data) {
        new app.application.controllers.Jogo(app).play(data);
    })
});