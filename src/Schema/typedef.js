const typeDefs = `

    type Query{

        Movies: [Movies]

        Cinemas: [cinemas]

        CurrentMovies: [cinemas]

        getPaginatedMovies(first: Int, after: String, sortBy: String, sortOrder: String): [Movies]

        getAvgRatings(name: String!): RatingResult! 

        MovieCastByMovieName(name: String!) : [Movie_Cast!]!


    }


    type Mutation {

        CreateMovie(input: CreateMovieInput!): Movies

        CreateCinema(input: CreateCinemaInput!): cinemas

        CreateActor(input: CreateActorsInput!): Actor

        UpdateMovie(input: UpdateMovieById!): Movies

        UpdateCinema(input: UpdateCinemaById!): cinemas

        UpdateActor(input: UpdateActorInput): Actor

        DeleteMovieById(id: ID!): DeleteResult

        DeleteCinemaById(id: ID!): DeleteResult

        DeleteActorById(id: ID!): DeleteResult

        CreateUser(input: User!): token

        CreateRating(input: UpdateRating!): String

        DeleteRatingById(id: ID!): DeleteResult


    }

    input PaginatedCustomers{
        status: String!
    }

    input CreateMovieInput {
        name: String!,
        release_date: String,
        description: String!,
        Ratings: Int!
    }

    input CreateCinemaInput {
        name: String!,
        location: String!,
        movie: String!
    }

    input CreateActorsInput {

        first_name: String!,
        last_name: String!,
        birthdate: String!
    }

    input UpdateMovieById {
        id: ID!,
        name: String!
    }

    input UpdateCinemaById {
        id: ID!
        name: String
      }

    input UpdateActorInput {
        id: ID!,
        first_name: String,
        last_name: String,
        birthdate: String
    }

    input UpdateRating {
        toUpdate: String!
    }

    type DeleteResult {
        id: ID!
        success: Boolean!
        message: String!
      }

    type Rating {
        success: String!
    }
      

    

    type Movies {
        id:ID!,
        name: String!,
        release_date: String,
        description: String!,
        Ratings: String!,
        
    }

    type cinemas {
        id:ID!,
        name: String!,
        location: String!,
        movie: String!
    },

    type Actor {
        id: ID!,
        first_name: String!,
        last_name: String!,
        birthdate: String!
    },

    type RatingResult {
        
        movieName: String!,
        averageRating: Float!
    }

    type Movie_Cast{

        First_name: String!,
        Last_name: String!,
        Role: String!

    }


    input User{
        id:ID,
        email:String!,
        password: String!
    },


    type token{
        Token: String!
    }
    
`

export {typeDefs}