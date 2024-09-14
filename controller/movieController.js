import { validateMovie, validatePartialMovie } from '../schemas/movie.js';
export class MovieController{

    constructor({movieModel}){
        this.movieModel = movieModel;
    }
    getAll=async(req, res) =>{
        const {genre,title} = req.query
        const movies = await this.movieModel.getAll({genre: genre, title: title});
    
        return res.json(movies);
    }

    getById= async(req,res)=>{
      const {id}= req.params;
      const movie = await this.movieModel.getById({id: id});

      return res.json(movie);
    } 

    createMovie=async(req,res)=>{
      const result = validateMovie(req.body);
      if(!result.success){
        return res.status(400).json(result.error);
      }
      const movie = await this.movieModel.createMovie({input:result.data});
      return res.json(movie);
     
    }

    updateMovie=async(req,res)=>{
      const {id}= req.params;
      const result = validatePartialMovie(req.body);
      if(!result.success){
         return res.status(400).json(result.error);
      }
      const updateMovie = await this.movieModel.updateMovie({id:id,input:result.data});
      return res.json(updateMovie);
    }
    
    deleteMovie=async(req,res)=>{
      const {id}= req.params;
      const result=  await this.movieModel.deleteMovie({id:id});
      if(result) return res.status(200).json({message:'Movie deleted successfully'});

      return res.status(404).json({message:'Movie not found'});
    }
}