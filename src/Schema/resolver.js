import { connection } from "../db_connection.js"
import jwt from 'jsonwebtoken';
import { JsonOutput , insertRating} from "../uploads/controller.js";
import { isOperationWhitelisted } from "../utils/whitelist.js";
import dotenv from 'dotenv';
dotenv.config();



const resolvers = {


    Query: {

        Movies
            :async (parent,args) => {
                isOperationWhitelisted('Movies');
              
                const [result] = await connection
                .promise()
                .query(`select * from movies;`);
            
              
            return result;
        },

        Cinemas
        
            :async (parent, args) => {
              isOperationWhitelisted('Cinemas');
                const [result] = await connection
                .promise()
                .query(`select * from cinemas`);

            return result;
        }, 

        CurrentMovies

            :async (parent,args) => {

              isOperationWhitelisted('CurrentMovies');
              const [result] = await connection
              .promise()
              .query(`select distinct movie from cinemas where movie is not null;`)

            console.log(result);

            return result;
            },


        getPaginatedMovies :
         async (parent, args) => {
          const { first, after, sortBy, sortOrder } = args;
          
          
          const query = `
            SELECT *
            FROM movies
            ORDER BY ${sortBy} ${sortOrder}
            LIMIT ?, ?`;
          
            const offset = after ? parseInt(after) : 0;

            const [rows] = await connection.promise().query(query, [offset, first]);

        
          
          const formattedData = rows.map((row) => ({
            id: row.id,
            name: row.name,
            release_date: row.release_date,
            description: row.description,
            Ratings: row.Ratings,
          }));
        
          return formattedData;
        },

        
        getAvgRatings: async (parent, args) => {
          const { name } = args;
        
          const query = `
            SELECT movieName, AVG(rating) AS averageRating
            FROM ratings
            WHERE movieName = ?
            GROUP BY movieName
          `;
        
          const [result] = await connection.promise().query(query, [name]);

          console.log(result);
        
          return result[0];
        },


        MovieCastByMovieName: async (parent, args) => {
          const { name } = args;
          

          const query = `
            SELECT actors.first_name, actors.last_name, movie_cast.role
            FROM movie_cast
            JOIN movies ON movie_cast.movie_id = movies.id
            JOIN actors ON movie_cast.actor_id = actors.id
            WHERE movies.name = ?
          `;
        
          try {
            const [result] = await connection.promise().query(query, [name]);
        
     
            const movieCast = result.map(row => ({
              First_name: row.first_name,
              Last_name: row.last_name,
              Role: row.role
            }));
        
            console.log(movieCast);
            return movieCast;
          } catch (error) {
            throw new Error(`Error fetching movie cast: ${error.message}`);
          }
        }
        
        
        

    },

    Mutation: {


        CreateMovie: 
        async(parent,args, context) => {

          isOperationWhitelisted("CreateMovie")

          if (!context.user) {
            throw new Error("Authentication required");
          }
            
            const movie = args.input;
        
             await connection.execute(
                'INSERT INTO movies (name, release_date, description, Ratings) VALUES (?, ?, ?, ?)',
                [movie.name, movie.release_date, movie.description, movie.Ratings]
              );

            return args.input;
        },

        CreateCinema:

        
        async (parent,args,context)=> {

          isOperationWhitelisted("CreateCinema");
          if (!context.user) {
            throw new Error("Authentication required");
          }
            const cinema = args.input;

            await connection.execute(
                'Insert Into cinemas (name,location,movie) values (?,?,?)' ,
            [cinema.name,cinema.location,cinema.movie]
            );

            return args.input;

        },

        CreateActor: 
        async (parent,args) => {
            const {first_name, last_name, birthdate} = args.input;

            await connection.execute(
                'Insert Into actors (first_name, last_name, birthdate) values (?,?,?)' ,
            [first_name, last_name, birthdate]
            );
            return args.input;
        },

        UpdateMovie:
        async(parent,args) => {
            const { id, name} = args.input;

            const updateQuery = 'UPDATE movies SET name = ? WHERE id = ?';
            await connection.execute(updateQuery, [name, id]);


        return args.input;
        },
        

        UpdateCinema:
        async (parent, args) => {
            const { id, name} = args.input;

            const updateQuery = 'UPDATE cinemas SET name = ? WHERE id = ?';
            await connection.execute(updateQuery, [name,id]);

        return args.input;
          },

        UpdateActor:
          async (parent, args) => {
            const { id, first_name, last_name, birthdate } = args.input;
            const updates = [];
          
            if (first_name) {
              updates.push('first_name = ?');
            }
            if (last_name) {
              updates.push('last_name = ?');
            }
            if (birthdate) {
              updates.push('birthdate = ?');
            }
          
            if (updates.length === 0) {
              // No updates provided, return early or handle as needed
              return null;
            }
          
            const updateQuery = `UPDATE actors SET ${updates.join(', ')} WHERE id = ?`;
            const updateValues = [
              ...(first_name ? [first_name] : []),
              ...(last_name ? [last_name] : []),
              ...(birthdate ? [birthdate] : []),
              id
            ];
          
            await connection.execute(updateQuery, updateValues);
          
            return args.input;
          },
          
          DeleteMovieById: async (parent, args) => {
            const { id } = args;
            
            try {
              // Check if the movie with the provided ID exists
              const [checkResult] = await connection
                .promise()
                .query('SELECT id FROM movies WHERE id = ?', [id]);
      
              if (checkResult.length === 0) {
                throw new Error(`Movie with ID ${id} not found.`);
              }
      
              
              //Deleting on movie_cast table
              await connection.execute('DELETE FROM movie_cast WHERE movie_id = ?', [id]);
              // Delete the movie by ID
              await connection.execute('DELETE FROM movies WHERE id = ?', [id]);
      
              return {
                id,
                success: true,
                message: `Movie with ID ${id} has been deleted successfully.`,
              };
            } catch (error) {
              return {
                id,
                success: false,
                message: `Failed to delete movie: ${error.message}`,
              };
            }
          },


          DeleteCinemaById: async (parent, args) => {
            const { id } = args;
          
            try {
              
              const [checkResult] = await connection
                .promise()
                .query('SELECT id FROM cinemas WHERE id = ?', [id]);
          
              if (checkResult.length === 0) {
                throw new Error(`Cinema with ID ${id} not found.`);
              }
          
              // Delete the cinema by ID
              await connection.execute('DELETE FROM cinemas WHERE id = ?', [id]);
          
              return {
                id,
                success: true,
                message: `Cinema with ID ${id} has been deleted successfully.`,
              };
            } catch (error) {
              return {
                id,
                success: false,
                message: `Failed to delete cinema: ${error.message}`,
              };
            }
          },

          DeleteActorById: async (parent, args) => {
            const { id } = args;
          
            try {
              // Check if the actor with the provided ID exists
              const [checkResult] = await connection
                .promise()
                .query('SELECT * FROM actors WHERE id = ?', [id]);

              console.log(checkResult)
          
              if (checkResult.length === 0) {
                throw new Error(`Actor with ID ${id} not found.`);
              }
          
              // Delete the actor by ID
              await connection.execute('DELETE FROM actors WHERE id = ?', [id]);
          
              return {
                id,
                success: true,
                message: `Actor with ID ${id} has been deleted successfully.`,
              };
            } catch (error) {
              return {
                id,
                success: false,
                message: `Failed to delete actor: ${error.message}`,
              };
            }
          },

          DeleteRatingById: async (parent, args) => {
            const { id } = args;
          
            try {
              // Check if the rating with the provided ID exists
              const [checkResult] = await connection
                .promise()
                .query('SELECT id FROM ratings WHERE id = ?', [id]);
          
              if (checkResult.length === 0) {
                throw new Error(`Rating with ID ${id} not found.`);
              }
          
              // Delete the rating by ID
              await connection.execute('DELETE FROM ratings WHERE id = ?', [id]);
          
              return {
                id,
                success: true,
                message: `Rating with ID ${id} has been deleted successfully.`,
              };
            } catch (error) {
              return {
                id,
                success: false,
                message: `Failed to delete rating: ${error.message}`,
              };
            }
          },
          
                

          CreateUser:
          async(parent,args) =>{

            const {email, password} = args.input;

            const SECRET_KEY = process.env.SECRET_KEY;


            try {
              // Check if the email is already registered
              const [existingUser] = await connection
                .promise()
                .query('SELECT * FROM users WHERE email = ?', [email]);
          
              if (existingUser.length > 0) {
                throw new Error('Email is already in use');
              }
        
          
              // Insert the new user into the database
              const [result] = await connection
                .promise()
                .query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
          
              // Generate a JWT token
              const token = jwt.sign({ userId: result.insertId }, SECRET_KEY, { expiresIn: '1h' });
          
              return {
                Token: token
              };

            } catch (error) {
              throw new Error(`Failed to create user: ${error.message}`);
            }

          },

        CreateRating:
        async(parent,args) => {

          const ratings =await JsonOutput();
          console.log(ratings);
            

            if (Array.isArray(ratings)) {

              for (const ratingData of ratings) {

                const { movieName, rating, userID, date } = ratingData; 
                await insertRating(movieName, rating, userID, date);
                console.log(`Rating for ${movieName} inserted successfully.`);

              }
        
              return "Success";

            } else {

              console.error('JsonOutput did not return an array:', ratings);
              return "Error";
              
            }

  
        }

    
    }
}




export {resolvers}