# 文件服务器

> 文件服务器支持各类文件上传下载, 也支持创建多个文件夹, 用来保存和共享图片、文档等资源.

使用简介:
1. npm install 安装项目依赖( express、fs-extra、formidable)
2. node app.js 启动项目
3. 在浏览器中输入地址 localhost:5566 访问项目, 打开后会看到一个简单的页面,描述了目前提供的接口及调用方式.

**注意**: 资源存放的根目录为 /containers, 即上传的文件最终会放在containers目录或指定的其子目录下.

**API:**

**1. 添加目录 add DIR**
 > get( /containers/:dirName )
``` javascript
例如要创建 PicFile文件夹(默认在 /containers目录下), 访问链接 localhost:5566/containers/PicFile 即可创建
```

**2. 清空目录 empty DIR**
 >  get( /containers/emptyDir/:dirName )
``` javascript
例如要清空 /containers/PicFile 文件夹, 访问链接 localhost:5566/containers/emptyDir/PicFile 即可
```

**3. 下载文件 download File**
 >  get( /containers/download/:dirName/:fileName  )
``` javascript
例如要下载 /containers/PicFile/test.jpg 文件( 相应文件需存在 ), 直接访问链接localhost:5566/containers/download/PicFile/test.jpg 即可下载
```

**4. 上传文件 upload File**
 >  post( /containers/upload )
 >  param:{ dirName: ,upload: }
``` javascript
文件默认上传到 /containers 目录, 若提供了dirName 参数, 则会在 /containers 目录中查找( 未找到则创建 )此文件夹, 并将上传的文件移动到此文件夹中.
通过浏览器打开的页面可进行上传文件的操作.( 注意: 上传文件的名称会经过md5编码, 最终的文件名可能和用户本地的文件名不一致 )
```

**5. 删除单个文件 delete File**
 >  get( /containers/delete/:dirName/:fileName )
``` javascript
例如存在 /containers/PicFile/test.jpg 文件, 访问链接localhost:5566/containers/delete/PicFile/test.jpg 即可删除test.jpg文件
```

**6. 批量删除文件 delete Files**
 >  post( /containers/delete )
 >  param:{ dirName: ,files: }
``` javascript
例如要一次性删除 PicFile 文件夹中的 test.jpg 和 test1.jpg 文件,  只需 post 数据 { "dirName":"PicFile", "files":" ['test.jpg','test1.jpg'] " } 到 localhost:5566/containers/delete 即可删除.
( 注意: files参数为可转成json格式的字符串 )
```