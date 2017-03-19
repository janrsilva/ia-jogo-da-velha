console.log(base_url);
var socket = io(base_url);

$(document).ready(function () {
    $('td').click(function () {
        if (!$(this).text()) {
            $(this).html($(this).html() + 'X');
            $(this).find('input').val(1);
            socket.emit('humanPlay', { tabuleiro: $('form').serializeArray() });
        }
    });
});

socket.on('iaPlay', function (data) {
    data.tabuleiro.forEach(function (element) {
        var cell = $('[name=' + element.name + ']');
        var parentTd = cell.parents('td');
        var input = parentTd.html().match(/<(.*)>/g);
        cell.val(element.value);
        if(element.value === 1){
            parentTd.text('');
            parentTd.html(input + 'X');
            parentTd.find('input').val(1);
        } 
        if(element.value === 0){
            parentTd.text('');
            parentTd.html(input + 'O');
            parentTd.find('input').val(0);
        }
    }, this);
});

socket.on('endOfGame', function (data) {
    alert(data.msg);
});