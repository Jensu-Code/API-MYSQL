import { Router }from 'express';
import {MovieController} from '../controller/movieController.js'
export function createMovieRouter({movieModel}){
    const moviesRouter = Router();
    const movieController = new MovieController({movieModel});
    
    moviesRouter.get('/', movieController.getAll);
    moviesRouter.get('/:id', movieController.getById);
    moviesRouter.post('/', movieController.createMovie);
    moviesRouter.put('/:id', movieController.updateMovie);
    moviesRouter.delete('/:id', movieController.deleteMovie);

    return moviesRouter;
}
