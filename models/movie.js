import { ConnectionDB } from '../connection/connection.js';

const conec = await ConnectionDB.connec();
export class MovieModel{

    static async getAll ({ genre,title}){
      try{
        if( typeof conec !== 'string'){
          if(genre || title){
             if(genre){
                 const genreUpperCase = genre.toUpperCase();
                 const [movieByGenre] = await conec
                 .query(`select bin_to_uuid(m.id) as id,m.title,m.year,m.director,m.duration,m.poster,m.rate
                        from movie as m
                        inner join movie_genre as mg on mg.movie_id= m.id
                        where mg.genre_id 
                        in (select id from genre where upper(name) = ?);`
                        ,[genreUpperCase])
                  if(movieByGenre.length===0) return []
                  
                  return movieByGenre;
             } 
             const titleUpperCase = title.toUpperCase();
             const [movieByTitle]= await conec
             .query(`select bin_to_uuid(id) as id, title, year, director, duration, poster, rate
                     from movie
                     where upper(title)= ?`, [titleUpperCase])
              if(movieByTitle.length===0) return []
              //obtengo el id de la pelicula
              const [{id}]=movieByTitle;
              const [genteByMovie]= await conec
              .query(`select name from genre
               where id in 
               (select genre_id from movie_genre
               where movie_id = uuid_to_bin(?))`,[id]);
               // genreByMovie es un arreglo de objtos [{name:genre},{name:genre}...]
               const genresMovie ={genre:genteByMovie.map(({name})=>name)} 
               
               return [{...movieByTitle[0],...genresMovie}]
          }
          const [movies] = await conec.query('select bin_to_uuid(id) as id,title,year,director,duration,poster,rate from movie;');
          return movies;
        }else{
          return `Error al conectar a la bd: ${conec}`
        }
       
      }catch(err){
        return err;
      }
     
    }

    static async getById ({id}){
        try {
           const [movie]= await conec
           .query(`select title,year,director,duration,poster,rate 
            from movie
            where id = uuid_to_bin(?)`,[id])

            if(movie.length===0) return [];

            return movie;
        } catch (error) {
           return "Error en la consulta: " + error.message;
        }
    }

    static async createMovie({input}){
       try{
          const [uuidResult] = await conec.query('select uuid() as id;');
          const [{id}]= uuidResult;
          await conec.query(`insert into movie (id,title,year,director,duration,poster,rate)values(uuid_to_bin(?),?,?,?,?,?,?);`,[id,input.title,input.year,input.director,input.duration,input.poster,input.rate])

          const [movie]= await conec.query(`select bin_to_uuid(id) as id, title, year, director, duration, poster, rate from movie
            where id = uuid_to_bin(?)`,[id])
          
          if(movie.length===0) return [];

          return movie;
       }catch(error){
        // esto no se debe de hacer 
        // no se le debe mostrar el error de manera cruda al cliente
         //return error;
         throw new Error("Error create movie");
         
       }
    }

    static async updateMovie({id, input}){
      try {
        const {title, year, director, duration, poster, rate}= input;
        const [resultMovieUpdate]= await conec.query(`update movie set title=?,year=?,director=?,duration=?,poster=?,rate=? where id= uuid_to_bin(?)`,[title, year, director,duration, poster, rate,id]);
        if(resultMovieUpdate.affectedRows === 0) throw new Error("No se puedo actualizar la pelicula");

        const [movieUpdate]= await conec.query(`select bin_to_uuid(id) as id,title,year,director,duration,poster,rate from movie where id = uuid_to_bin(?)`,[id]);
        return movieUpdate;

      } catch (error) {
        // throw new Error('Error update Movie: ' + error.message);
        console.error(error);
      }
    
    }

    static async deleteMovie({id}){
      try {
        // antes de eliminar la pelicula tengo que eliminar los registros que esta tenga en la tabla movi_genre

        //  const [movieGenreResult]= await conec.query(`delete from movie_genre where movie_id=uuid_to_bin(?)`,id) ;

        //  if(movieGenreResult.affectedRows > 0){
        //    await conec.query(`delete from movie where id =uuid_to_bin(?)`, id);
        //  }else{
        //    throw new Error('Not movies delete');
        //  }

        const [deleteResult]= await conec.query(`delete from movie where id =uuid_to_bin(?)`, id);
        if(deleteResult.affectedRows>0) return true;
      } catch (error) {
        
        console.log(error);
      }
    }
}