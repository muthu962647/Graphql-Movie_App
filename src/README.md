GraphQL - Use Case – Movie App:
Build a GraphQL project for movie app: Movies, Cinema (1:M), Ratings(1:M), Actors, etc..,. Use any database for storing and retrieving data. Use many attributes/fields so that we can understand the GraphQL by refining and fetching the exact data that we need.
 
Define schema, write resolvers and build:
Queries to fetch:
all movies currently running in theatres,
average ratings for a movie (input – movie id/name):
movies by theatre/cinema name
Movie cast by movie name.
Build API to return up to 10 records in one API call. For the next set/iteration, use params like page/offset, sortOrder and sortBy to retrieve records.
Example: api/v1/movies?page=1&limit=10&sortBy=movieName&sortOrder=desc --> returns first 10 records order by movie name in descending order
               api/v1/customers?page=2&limit=10&sortBy=movieName&sortOrder=desc --> returns 11-20 records
Mutations to Add/update new movies, cinemas, actors and ratings.
Mutations to delete movies, cinemas, actors and ratings by id
Mutation to allow user to upload ratings info as a file.
Include authentication to the GraphQL API and handle security concerns like DoS protection, Query whitelisting, Size, and amount limits (using pagination/offset etc..,).
Other logics to implement: Use Directives, Schema stitching, Handle errors efficiently, Use batching and caching (to optimize network requests and improve performance in GraphQL:), Rate limiting request for specific timeframe (1 min, 1 hr, etc..,) 
