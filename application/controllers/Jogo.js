function Jogo(app, req, res) {
    this._app = app;
    this._req = req;
    this._res = res;
    this._io = this._app.get('io');
}


Jogo.prototype.index = function () {
    this._res.render('index', { base_url: 'http://localhost/' });
}


Jogo.prototype.play = function (data) {
    var matrix = this.jsonToMatrix(data.tabuleiro);
    matrix = this.shot(matrix);
    var arrObj = this.matrixToJson(matrix);
    this._io.emit('iaPlay', { tabuleiro: arrObj });
}


Jogo.prototype.jsonToMatrix = function (json) {
    var matrix = [];
    var size = Math.sqrt(json.length);
    for (var i = 0; i < size; i++) {
        matrix[i] = new Array(size);
    }

    json.forEach(function (element) {
        var col = element.name.substr(0, 1);
        var line = element.name.substr(1, 1);
        var value;
        if ((isNaN(parseInt(element.value)) || !element.value) && element.value !== 0) {
            value = "";
        } else {
            value = parseInt(element.value);
        }
        matrix[col][line] = value;
    }, this);

    return matrix;
}


Jogo.prototype.matrixToJson = function (matrix) {
    var arrObj = [];
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            arrObj.push({
                name: i + "" + j,
                value: matrix[i][j]
            });
        }
    }
    return arrObj;
}


Jogo.prototype.shot = function (matrix) {
    if (!this.winner(matrix)) {

        /**
         * Se aprende e usa histórico de jogadas.
         */
        if (false) {
            //@todo Fazer aprender
            matrix = this.smartMachinePlay(matrix);
        }
        /**
         * Se está jogando sem aprender e sem usar histórico
         */
        else {
            matrix = this.machinePlay(matrix);
        }
        if (!this.winner(matrix)) {
            this.checkVelha(matrix);
        }
    }
    return matrix;
}

/**
 * Joga usando aprendizado
 */
Jogo.prototype.smartMachinePlay = function (matrix) {
    //Fazer aprender
    return matrix;
}


/**
 * Joga sem aprendizado
 */
Jogo.prototype.machinePlay = function (matrix) {
    matrix = this.winMachineShot(matrix);
    return matrix;
}

Jogo.prototype.winMachineShot = function (matrix) {
    var size = matrix.length;
    var shot = null;
    var shot_i = null;
    var shot_j = null;
    /**
     * Verifica se vencerá nas linhas
     */
    for (var i = 0; i < size; i++) {
        var mate = '';
        for (var j = 0; j < size; j++) {
            mate += matrix[i][j];
        }
        if (this.checkMateWin(mate)) {
            matrix[i].forEach(function (element) {
                if (element == '') {
                    element = 0;
                }
                return element;
            }, this);
            return matrix;
        }
    }

    /**
     * Verifica se vencerá nas colunas
     */
    for (var i = 0; i < size; i++) {
        var mate = '';
        for (var j = 0; j < size; j++) {
            mate += matrix[j][i];
        }
        if (this.checkMateWin(mate)) {
            matrix[j].forEach(function (element) {
                if (element == '') {
                    element = 0;
                }
                return element;
            }, this);
            return matrix;
        }
    }

    /**
     * Verifica se vencerá na diagonal principal
     */
    mate = '';
    var x = 0;
    while (x < size) {
        if (matrix[x][x] == '') {
            shot = x;
        }
        mate += matrix[x][x];
        x++;
    }
    if (this.checkMateWin(mate)) {
        matrix[x][x] = 0;
        return matrix;
    }

    /**
     * Verifica se vencerá na diagonal secundária
     */
    mate = '';
    var l = 0;
    var c = size - 1;
    while (l < size) {
        if (matrix[l][c] == '') {
            shot_i = l;
            shot_j = c;
        }
        mate += matrix[l][c];
        l++;
        c--;
    }
    if (this.checkMateWin(mate)) {
        matrix[shot_i][shot_j] = 0;
        return matrix;
    }

    /**
     * Faz jogada aleatória onde estiver vazio.
     */
    do {
        shot_i = Math.floor((Math.random() * 3) + 0);
        shot_j = Math.floor((Math.random() * 3) + 0);
    } while (matrix[shot_i][shot_j] !== '');
    matrix[shot_i][shot_j] = 0;
    return matrix;
}

Jogo.prototype.winner = function (matrix) {
    var size = matrix.length;
    /**
     * Verifica vencedor nas linhas
     */
    for (var i = 0; i < size; i++) {
        var sum = 0;
        for (var j = 0; j < size; j++) {
            sum += matrix[i][j];
        }
        if (this.checkWinner(sum)) {
            return true;
        }
    }

    /**
     * Verifica vencedor nas colunas
     */
    for (var i = 0; i < size; i++) {
        var sum = 0;
        for (var j = 0; j < size; j++) {
            sum += matrix[j][i];
        }
        if (this.checkWinner(sum)) {
            return true;
        }
    }

    /**
     * Verifica vencedor na diagonal principal
     */
    sum = 0;
    var x = 0;
    while (x < size) {
        sum += matrix[x][x];
        x++;
    }
    if (this.checkWinner(sum)) {
        return true;
    }

    /**
     * Verifica vencedor na diagonal secundária
     */
    sum = 0;
    var l = 0;
    var c = size - 1;
    while (l < size) {
        sum += matrix[l][c];
        l++;
        c--;
    }
    if (this.checkWinner(sum)) {
        return true;
    }
}

Jogo.prototype.checkVelha = function (matrix) {
    var size = matrix.length;
    for (var i = 0; i < size; i++) {
        var sum = 0;
        for (var j = 0; j < size; j++) {
            if (matrix[j][i] !== 1 && matrix[j][i] !== 0) {
                return;
            }
        }
    }
    console.log(sum, 'Deu velha... XD');
    this._io.emit('endOfGame', { msg: 'Deu velha... XD' });
}


Jogo.prototype.checkWinner = function (sum) {
    if (sum === 0) {
        console.log(sum, 'IA venceu! uhuuuu');
        this._io.emit('endOfGame', { msg: 'IA venceu! uhuuuu' });
        return true;
    } else if (sum === 3) {
        console.log(sum, 'Humano venceu! T-T');
        this._io.emit('endOfGame', { msg: 'Humano venceu! T-T' });
        return true;
    }
    return false;
}

Jogo.prototype.checkMateWin = function (mate) {
    if (mate === '00') {
        return 0;
    }
    return null;
}

Jogo.prototype.checkMateLose = function (mate) {
    if (mate === '11') {
        return 0;
    }
    return null;
}

module.exports = function () {
    return Jogo;
}