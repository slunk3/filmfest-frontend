import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Error from './ErrorMessage';

const ADD_FILM_MUTATION = gql`
  mutation ADD_FILM_MUTATION(
    $title: String!
    $release_date: String
    $tmdb_id: String
  ) {
    addFilm(title: $title, release_date: $release_date, tmdb_id: $tmdb_id) {
      id
    }
  }
`;

class AddFilm extends Component {
  state = {
    title: '',
    release_date: '',
    tmdb_id: '',
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  findFilm = async e => {
    const { value } = e.target;

    console.log('TMDB_API_KEY', process.env.TMDB_API_KEY);

    const res = await fetch(
      `//api.themoviedb.org/3/search/movie?api_key=6d052ecb8d101a9a96f0fca3890527fd&query=${value}`
    );

    const film = await res.json();
    console.log('find film', film);
  };

  render() {
    const { title, release_date, tmdb_id } = this.state; // eslint-disable-line
    return (
      <Mutation mutation={ADD_FILM_MUTATION} variables={this.state}>
        {(addFilm, { loading, error }) => (
          <form
            onSubmit={async e => {
              e.preventDefault();
              const res = await addFilm();
            }}
          >
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="findFilm">
                Find Film{' '}
                <input
                  type="text"
                  id="findFilm"
                  name="findFilm"
                  placeholder="Find films..."
                  required
                  onChange={this.findFilm}
                />
              </label>
            </fieldset>
          </form>
        )}
      </Mutation>
    );
  }
}

export default AddFilm;
