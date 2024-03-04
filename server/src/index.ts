import express from 'express';
import router from './routes/index';

const app = express();
app.use(express.json());

app.get('/', (req:any, res:any) => {
    res.json({
        msg: 'Hello World'
    });
});

app.use('/api/v1', router);

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});