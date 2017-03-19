# ia-jogo-da-velha
Jogo da Velha com Inteligência Artificial

# Requerimentos

- Possuir nodeJS instalado
- Possuir npm instalado
- Possuir o gulp instalado de forma global

# Instalação

1.  execute o comando abaixo diretório raiz do projeto

```shell
$ npm install
```
2.  execute o comando abaixo diretório raiz do projeto

```shell
$ gulp
```

# Play

```shell
$ node app 
```


# Avisos

- Por padrão aplicação tentará escutar a porta 80, altere conforme necessidade em ./app.js

```javascript
var server = app.listen(80, function () {
    console.log('Servidor Iniciado');
});
```
- Lembre-se de executar o `$ gulp` sempre que alterar o js
