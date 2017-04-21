/**
 * Created by xiangxiao3 on 2016/11/30.
 */
var fs = require('fs');
var express = require('express');
var http = require('http');
var path = require('path');
var fsExtra = require('fs-extra')
var formidable = require("formidable");

var fileModel = require("./server/file.model");

var app = express();
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'containers')));

//网站API
app.get('/', function (req, res, next) {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
        '<h1>This is fileserver</h1>' +
        '<h3>API:</h3>' +
        '<div>add DIR (get) : /containers/:dirName</div>' +
        '<div>empty DIR (get) : /containers/emptyDir/:dirName</div>' +
        '<div>download FILE (get) : /containers/download/:dirName/:fileName</div>' +
        '<div>upload FILE : <a href="/upload/file">upload</a></div>' +
        '<div>delete FILE (get) : /containers/delete/:dirName/:fileName</div>' +
        '<div>delete FILES (post) : /containers/delete</div>' +
        '<div>upload FILE (post) : /containers/upload</div>'
    );
})

//添加dir
app.get('/containers/:dirName', fileModel.createDir);

//清空dir
app.get('/containers/emptyDir/:dirName', fileModel.emptyDir);

//文件下载
app.get('/containers/download/:dirName/:fileName', fileModel.downloadFile);

//删除单个文件
app.get('/containers/delete/:dirName/:fileName', fileModel.deleteFile);

//批量删除图片
app.post('/containers/delete', fileModel.deleteFiles);

//文件上传
app.post('/containers/upload', fileModel.uploadFile);

//上传图片
app.get('/upload/file', function (req, res, next) {
    // show a file upload form
    res.writeHead(200, {'content-type': 'text/html;charset=utf-8'});
    res.end(
        '<form action="/containers/upload" enctype="multipart/form-data" method="post">' +
        '上传文件dir：<input type="text" name="dirName"><br>' +
        '文件：<input type="file" name="upload"><br>' +
        '<input type="submit" value="上传">' +
        '</form>'
    );
});


var port = process.env.PORT || '5566';
var server = http.createServer(app);
module.exports = app.listen(port, function () {
    console.log('Express server listening on port ' + port);
});