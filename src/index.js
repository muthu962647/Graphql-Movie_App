import { GraphQLServer } from "graphql-yoga";
import { typeDefs } from "./Schema/typedef.js";
import { resolvers } from "./Schema/resolver.js";
import jwt from "jsonwebtoken";
import express from 'express';
import rateLimit from 'express-rate-limit';


const app = express();
const PORT = process.env.PORT || 5000

//Rate limiter middleware
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 100, //100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});


app.use(limiter);

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: ({ request }) => {
        try {

          if (!request.headers.authorization) {
            return;
          }
        
          const token = request.headers.authorization || '';
        
          const user = jwt.verify(token, process.env.SECRET_KEY);

          console.log(user);
          
          return { user };

        } catch (error) {
      
          console.error('JWT verification failed:', error.message);
          return null; 

        }
      }
      
})

server.start({port: PORT},() => {
    console.log('The server is up at: http://localhost:'+PORT)
})


