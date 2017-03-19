module.exports = function (app) {
    app.get('/', function (req, res) {
        new app.application.controllers.Jogo(app, req, res).index();
    });
    app.post('/', function (req, res) {
        res.send('post');
    });
}