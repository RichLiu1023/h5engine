# h5engine

> 基于学习的造轮子

这是一个比较有意思的h5渲染引擎，我肯定写的不好，以前也从没写过这东西，出于好奇，看了下前端`h5 canvas`的渲染api，然后看了`egret`的引擎，觉得还是动手做一下比较好，于是就开始造轮子了，额这个比较有趣，从渲染模型、脏矩形、加载等一串玩意，通过一步步的实现写出来还看得过去的引擎demo，当然，重在过程！这个过程让我受益匪浅！

- 使用TypeScript开发
- 网络通信使用socket.io

### 安装

项目使用`gulp`打包，因此需要安装`nodejs`，及gulp模块。

安装好nodejs后安装全局gulp管理包：

	npm install -g gulp

cd进入项目目录然后执行：

	npm install

`package.json` 中有依赖的包

在项目目录中执行 

- gulp buildJS 生成合并后的js文件及map文件
- gulp buildDTS 生成TypeScript引用的d.ts文件

### 使用

请看`GameTest`项目，并运行看结果。