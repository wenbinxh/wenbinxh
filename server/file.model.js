/**
 * Created by zhengjunling on 2017/3/27.
 */
var fsExtra = require('fs-extra');
var formidable = require("formidable");
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var resourceRoot = path.resolve(__dirname, '../containers');

var createDir = function (dir, callback) {
    fsExtra.ensureDir(path.join(resourceRoot, dir), function (err) {
        if (err) return console.error(err);
        callback && callback();
    })
};

var emptyDir = function (dir, callback) {
    fsExtra.emptyDir(path.join(resourceRoot, dir), function (err) {
        if (err) return console.error(err);
        callback && callback();
    })
};

module.exports = {
    /**
     * 创建文件夹
     * @param req
     * @param res
     * @param next
     */
    createDir: function (req, res, next) {
        createDir(req.params.dirName, function () {
            res.writeHead(200, {'content-type': 'text/html'});
            res.end('创建文件夹成功！');
        });
    },

    /**
     * 清空文件夹
     * @param req
     * @param res
     * @param next
     */
    emptyDir: function (req, res, next) {
        emptyDir(req.params.dirName, function () {
            res.writeHead(200, {'content-type': 'text/html'});
            res.end('清空文件夹成功！');
        });
    },

    deleteFile: function (req, res, next) {
        var dirName = req.params.dirName;
        var fileName = req.params.fileName;
        fsExtra.remove('containers/' + dirName + "/" + fileName, function (err) {
            if (err) return console.error(err)
            res.writeHead(200, {'content-type': 'text/html'});
            res.end(
                '<h1>file delete success !!!</h1>'
            );
        })
    },

    /**
     * 批量删除文件
     * @param req
     * @param res
     * @param next
     */
    deleteFiles: function (req, res, next) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var dir = fields.dirName;
            var fileNames = JSON.parse(fields.files);

            fileNames.forEach(function (fileName) {
                fsExtra.remove(path.join(resourceRoot, dir, fileName), function (err) {
                    if (err) return console.error(err);
                    console.log("删除" + fileName + "成功!");
                })
            });
            res.writeHead(200, {'content-type': 'text/html'});
            res.end('删除成功！');
        });
    },

    /**
     * 上传图片
     * @param req
     * @param res
     * @param next
     */
    uploadFile: function (req, res, next) {
        var form = new formidable.IncomingForm();
        form.uploadDir = "containers";	 //设置上传目录
        form.keepExtensions = true;	 //保留后缀
        form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

        form.parse(req, function (err, fields, files) {
            if (err) {
                return res.send({
                    type: "error",
                    message: "upload fail"
                });
            }
            var dirName = fields.dirName;
            var filePath = files.upload.path;

            fs.readFile(filePath, function (err, data) {
                if (err) {
                    return res.send({
                        type: "error",
                        message: err
                    });
                }
                var md5 = crypto.createHash('md5');
                var picMd5 = md5.update(data).digest('hex');
                var fileName = "upload_" + picMd5 + "." + filePath.split(".").pop();

                fsExtra.move(filePath, "containers/" + dirName + "/" + fileName, function (err) {
                    if (err && err.code !== "EEXIST") {
                        return res.send({
                            type: "error",
                            message: err
                        });
                    }
                    res.send({
                        type: "success",
                        url: "/" + dirName + "/" + fileName
                    });
                })
            });
        });
    },

    downloadFile: function (req, res, next) {
        var dir = req.params.dirName;
        var fileName = req.params.fileName;
        var filePath = resourceRoot+ "/" + dir + "/" + fileName;
        var stats = fs.statSync(filePath);
        if (stats.isFile()) {
            res.set({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename=' + encodeURI(fileName),
                'Content-Length': stats.size
            });
            fs.createReadStream(filePath).pipe(res);
        } else {
            res.end(404);
        }
    }
};