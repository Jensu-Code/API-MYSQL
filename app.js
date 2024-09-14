import express, {json} from 'express';
import { createMovieRouter } from './router/movie.js';

export const createApp=({movieModel})=>{
    const app = express();

    const PORT = process.env.PORT ?? 1234;
    app.disable('x-powered-by');
    app.use(json());
    app.use('/movies', createMovieRouter({movieModel}) )

    app.listen(PORT, ()=>{
        console.log(`listening on port http://localhost:${PORT}`);
    });
}
