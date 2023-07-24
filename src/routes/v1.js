import express from 'express';
const router = express.Router();

import userModule from './modules/user.module';

router.use('/users', userModule);

import postModule from './modules/post.module';

router.use('/posts', postModule);

module.exports = router;