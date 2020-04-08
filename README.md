# remember

一开始我希望有一个能够根据遗忘曲线来规律提示我要复习了 这么一个东西，于是写了一个这样的网站。之后会继续添加邮件推送、RSS订阅的功能

# remember-ui

前端资源，`npm run build` 会将静态资源输出到 remember-server的static目录下，启动服务器ok

### debug

`npm run serve`

### build

`npm run build`

# remember-server

koa 服务器

### 启动

`npm start`

### 启动某个固定端口

`npm start -- [port]`

> e.g. `npm start -- 3000` 启动一个3000端口的服务器
