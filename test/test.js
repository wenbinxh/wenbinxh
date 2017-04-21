/**
 * Created by wuxuebin on 2017/4/5.
 */
var expect = require('chai').expect;
var supertest = require('supertest');
var app = require('../app.js');
var requset = supertest.agent(app);
var path = require('path');

describe('fileServer接口测试', function() {

    it('createDir 添加dir', function (done) {
        requset
            .get("/containers/uploadDir1")
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                console.log(res.text);
                done();
            });
    });

    it('downloadFile 文件下载', function (done) {
        requset
            .get("/containers/download/uploadDir2/test.svg")
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                console.log(res.body);
                done();
            });
    });

    it('uploadFile 文件上传', function (done) {
        requset
            .post("/containers/upload")
            .field('type', "svg")
            .field('dirName', "uploadDir2")
            .attach('upload', path.resolve(__dirname, './', 'README.md'))
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                console.log(res.text);
                done();
            });
    });

    it('deleteFile 删除单个文件', function (done) {
        requset
            .get("/containers/delete/uploadDir3/test.svg")
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                console.log(res.text);
                done();
            });
    });

    it('deleteFiles 批量删除', function (done) {
        requset
            .post("/containers/delete")
            .send({
                "dirName":"uploadDir3",
                "files":'["test1.svg","test.svg"]'
            })
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                console.log(res.text);
                done();
            });
    });

    it('emptyDir 清空dir', function (done) {
        requset
            .get("/containers/emptyDir/uploadDir3")
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                console.log(res.text);
                done();
            });
    });
})
