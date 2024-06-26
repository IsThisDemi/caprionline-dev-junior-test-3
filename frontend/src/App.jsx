import React, { useEffect, useState } from 'react';
import { Button, Rating, Spinner } from 'flowbite-react';

const App = props => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState('asc');
  const [sortBy, setSortBy] = useState('recently_uploaded');
  const [genres, setGenres] = useState([]);
  const [filterGenre, setGenre] = useState('-');

  const updateOrder = (e) => {
    const order = e.target.value;
    setOrderBy(order);
  }

  const updateSort = (e) => {
    const sort = e.target.value;
    setSortBy(sort);
  }

  const updateGenre = (e) => {
    const genre = e.target.value;
    setGenre(genre);
  }

  const fetchMovies = () => {
    setLoading(true);
    if (filterGenre == '-')
      {
      return fetch(
        `http://localhost:8000/movies/${sortBy}/${orderBy}`
      )
        .then((response) => response.json())
        .then((data) => {
          setMovies(data);
          setLoading(false);
        });}
        else{
    return fetch(
      `http://localhost:8000/movies/genre/${filterGenre}/${sortBy}/${orderBy}`
    )
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
      });
    }
  }

  const fetchGenres = () => {
    return fetch('http://localhost:8000/genres')
      .then(response => response.json())
      .then(data => {
        setGenres(data);
      });
  }
  
  useEffect(() => {
    if (genres.length == 0)
      {
        fetchGenres();
      }
    fetchMovies();
  }, [orderBy, sortBy, genres, filterGenre]);

  return (
    <Layout>
      <Heading />
      <Filters genres={genres} updateGenre={updateGenre} updateOrder={updateOrder} updateSort={updateSort}/>
      <MovieList loading={loading}>
        {movies.map((item, key) => (
          <MovieItem key={key} {...item} />
        ))}
      </MovieList>
    </Layout>
  );
};

const Layout = props => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        {props.children}
      </div>
    </section>
  );
};

const Heading = props => {
  return (
    <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
      <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Movie Collection
      </h1>

      <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
        Explore the whole collection of movies
      </p>
    </div>
  );
};

const Filters = ({genres, updateGenre, updateOrder, updateSort}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 lg:mb-16">
      <div className="flex items-center mb-4 sm:mb-0">
        <span className="font-light text-gray-900 dark:text-white sm:text-m">
          Genre:
        </span>

        <select
          className="ml-2 rounded-md shadow-md border-slate-200 text-gray-500 sm:text-m dark:text-gray-400"
          onChange={updateGenre}
        >
          {genres.map((item, key) => (
            <option key={key} value={key+1}>
              {item.name}
            </option>
          ))}
          <option value="-">-</option>
        </select>
      </div>
      <div className="flex items-center mb-4 sm:mb-0">
        <span className="font-light text-gray-900 dark:text-white sm:text-m">
          Sort by:
        </span>

        <select
          className="ml-2 rounded-md shadow-md border-slate-200 text-gray-500 sm:text-m dark:text-gray-400"
          onChange={updateSort}
        >
          <option value="recently_uploaded">Recently added</option>
          <option value="release_date">Release Date</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div className="flex items-center">
        <span className="font-light text-gray-900 dark:text-white sm:text-m">
          Order:
        </span>

        <select
          className="ml-2 rounded-md shadow-md border-slate-200 text-gray-500 sm:text-m dark:text-gray-400"
          onChange={updateOrder}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}

const MovieList = props => {
  if (props.loading) {
    return (
      <div className="text-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-y-8 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3">
      {props.children}
    </div>
  );
};

const MovieItem = props => {
  return (
    <div className="flex flex-col w-full h-full rounded-lg shadow-md lg:max-w-sm">
      <div className="grow">
        <img
          className="object-cover w-full h-60 md:h-80"
          src={props.imageUrl}
          alt={props.title}
          loading="lazy"
        />
      </div>

      <div className="grow flex flex-col h-full p-3">
        <div className="grow mb-3 last:mb-0">
          {props.year || props.rating
            ? <div className="flex justify-between align-middle text-gray-900 text-xs font-medium mb-2">
                <span>{props.year}</span>

                {props.rating
                  ? <Rating>
                      <Rating.Star />

                      <span className="ml-0.5">
                        {props.rating}
                      </span>
                    </Rating>
                  : null
                }
              </div>
            : null
          }

          <h3 className="text-gray-900 text-lg leading-tight font-semibold mb-1">
            {props.title}
          </h3>

          <p className="text-gray-600 text-sm leading-normal mb-4 last:mb-0">
            {props.plot.substr(0, 80)}...
          </p>
        </div>

        {props.wikipediaUrl
          ? <Button
              color="light"
              size="xs"
              className="w-full"
              onClick={() => window.open(props.wikipediaUrl, '_blank')}
            >
              More
            </Button>
          : null
        }
      </div>
    </div>
  );
};

export default App;
