const whitelistedQueries = [
    'Movies',
    'Cinemas',
    'CurrentMovies',
    'getPaginatedMovies',
    'getAvgRatings',
    'MovieCastByMovieName',
  ];
  
  const whitelistedMutations = [
    'CreateMovie',
    'CreateCinema',
    'CreateActor',
    'UpdateMovie',
    'UpdateCinema',
    'UpdateActor',
    'DeleteMovieById',
    'DeleteCinemaById',
    'DeleteActorById',
    'CreateUser',
    'CreateRating',
    'DeleteRatingById',
  ];
  
  // Function to check if an operation is whitelisted
  function isOperationWhitelisted(operationName) {
    if (whitelistedQueries.includes(operationName) || whitelistedMutations.includes(operationName)) {
      return true;
    } else {
      throw new Error(`Operation '${operationName}' is not whitelisted.`);
    }
  }


export {isOperationWhitelisted}