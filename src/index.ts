import express from 'express';
import bodyparser from 'body-parser';
import path from 'path';
import { usersRouter } from './routes/users';
import { postsRouter } from './routes/posts'
import { categoriesRouter } from './routes/categories';
import { postCategoryRouter } from './routes/postCategory';
import { commentsRouter } from './routes/comments';

let app = express();

app.use(bodyparser.urlencoded( {extended:false}));
app.use(express.static(path.join(process.cwd(),'public')));

app.use('/Users', usersRouter);
app.use('/Posts', postsRouter);
app.use('/Categories', categoriesRouter);
app.use('/PostCategory', postCategoryRouter);
app.use('/Comments', commentsRouter);
app.use(usersRouter);


app.listen(3000);