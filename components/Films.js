import React, { Component } from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { ALL_FILMS_QUERY } from './Queries';
import Film from './Film';
import AddFilm from './AddFilm';

class Films extends Component {
  render() {
    const { page } = this.props;
    return (
      <div>
        <p>Films!</p>
        <Query query={ALL_FILMS_QUERY}>
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;
            return (
              <div>
                <AddFilm />
                <ol>
                  {data.films.map(film => (
                    <li>
                      <Film film={film} key={film.tmdb_id} />
                    </li>
                  ))}
                </ol>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

Films.propTypes = {
  page: PropTypes.object,
};

export default Films;
