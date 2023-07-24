import dotenv from 'dotenv';
dotenv.config();

import express from 'express'; // gọi thư viện express
const server = express(); // dùng thư viện express tạo ra server

/* Cấu hình req.body */
import bodyParser from 'body-parser';
server.use(bodyParser.json());

/* Gọi cấu hình routing và yêu cầu */
import routerConfig from './routes';

//  chấp nhận tất cả phương thức (GET, POST, PUT)
server.use('/api', routerConfig)


/* Yêu cầuu server lắng nghe tại cổng cổng 3000 trên máy */
server.listen(process.env.PORT, () => {
    console.log("Server is running at port", process.env.PORT)
})