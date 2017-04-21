**API:**

   (注意: 资源存放的根目录为 /containers, 即上传的文件最终会放在containers目录或指定的其子目录下.)  
``` javascript
   module.exports = {
     createDir:function(){...},
     emptyDir:function(){...},
     downloadFile:function(){...},
     uploadFile:function(){...},
     deleteFile:function(){...},
     deleteFiles:function(){...}
   }
```  
**1. 添加目录 createDir**
 > get( /containers/:dirName )
``` javascript
例如要创建 PicFile文件夹, 访问链接 localhost:5566/containers/PicFile 即可创建(需node app.js 启动项目)
```

**2. 清空目录 emptyDir**
 >  get( /containers/emptyDir/:dirName )
``` javascript
例如要清空 /containers/PicFile 文件夹, 访问链接 localhost:5566/containers/emptyDir/PicFile 即可
```

**3. 下载文件 downloadFile**
 >  get( /containers/download/:dirName/:fileName  )
``` javascript
例如要下载 /containers/PicFile/test.jpg 文件( 相应文件需存在 ), 直接访问链接localhost:5566/containers/download/PicFile/test.jpg 即可下载
```

**4. 上传文件 uploadFile**
 >  post( /containers/upload )  ;  param:{ dirName: ,upload: }
``` javascript
文件默认上传到 /containers 目录, 若提供了dirName 参数, 则会在 /containers 目录中查找( 未找到则创建 )此文件夹, 并将上传的文件移动到此文件夹中.
通过浏览器打开的页面可进行上传文件的操作.
( 注意: 上传文件的名称会经过md5编码, 最终的文件名可能和用户本地的文件名不一致; 若反复向同一路径上传同名文件, 可能会在/containers 目录中生成垃圾文件 )
```

**5. 删除单个文件 deleteFile**
 >  get( /containers/delete/:dirName/:fileName )
``` javascript
例如存在 /containers/PicFile/test.jpg 文件, 访问链接localhost:5566/containers/delete/PicFile/test.jpg 即可删除test.jpg文件
```

**6. 批量删除文件 deleteFiles**
 >  post( /containers/delete )  ;  param:{ dirName: ,files: }
``` javascript
例如要一次性删除 PicFile 文件夹中的 test.jpg 和 test1.jpg 文件,  只需 post 数据 { "dirName":"PicFile", "files":" ['test.jpg','test1.jpg'] " }
到 localhost:5566/containers/delete 即可删除.
( 注意: files参数为可转成json格式的字符串 )
```
