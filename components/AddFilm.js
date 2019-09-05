import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { format } from 'date-fns';
import DownShift from 'downshift';
import debounce from 'lodash.debounce';
import Error from './ErrorMessage';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

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
    releaseDate: '',
    tmdbId: '',
    overview: '',
    films: [],
  };

  findFilm = debounce(async e => {
    const { value } = e.target;

    console.log('TMDB_API_KEY', process.env.TMDB_API_KEY);

    // if (value.length >= 2) {
    const res = await fetch(
      `//api.themoviedb.org/3/search/movie?api_key=6d052ecb8d101a9a96f0fca3890527fd&query=${value}`
    );
    const films = await res.json();
    console.log('films', films);
    this.setState({
      films,
    });
    // }
  }, 350);

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  populateForm = item => {
    this.setState({
      title: item.title,
      releaseDate: item.release_date,
      tmdbId: item.id,
      posterPath: item.poster_path,
      overview: item.overview,
    });
  };

  render() {
    const { title, releaseDate, tmdbId, overview, posterPath, films } = this.state; // eslint-disable-line
    return (
      <Mutation mutation={ADD_FILM_MUTATION} variables={this.state}>
        {(addFilm, { loading, error }) => (
          <>
            <Error error={error} />
            <DownShift
              onChange={this.populateForm}
              itemToString={item => (item === null ? '' : item.title)}
            >
              {({
                getInputProps,
                getItemProps,
                isOpen,
                inputValue,
                highlightedIndex,
              }) => (
                <fieldset disabled={loading} aria-busy={loading}>
                  <label htmlFor="findFilm">
                    Find Film{' '}
                    <input
                      {...getInputProps({
                        type: 'search',
                        placeholder: 'Search for an item...',
                        id: 'findFilm',
                        className: loading ? 'loading' : '',
                        onChange: e => {
                          e.persist();
                          this.findFilm(e);
                        },
                      })}
                    />
                  </label>
                  {isOpen && (
                    <DropDown>
                      {films.results &&
                        films.results.map((item, index) => (
                          <DropDownItem
                            {...getItemProps({ item })}
                            key={item.id}
                            highlighted={index === highlightedIndex}
                          >
                            {item.title}
                            {item.release_date && (
                              <span> - {item.release_date.split('-')[0]}</span>
                            )}
                          </DropDownItem>
                        ))}
                    </DropDown>
                  )}
                </fieldset>
              )}
            </DownShift>
            <form
              onSubmit={async e => {
                e.preventDefault();
                const res = await addFilm();
              }}
            >
              <fieldset>
                <label htmlFor="film-title">
                  Title{' '}
                  <input
                    type="text"
                    name="film-title"
                    id="film-title"
                    value={title}
                    readOnly
                  />
                </label>
              </fieldset>
              <fieldset>
                <label htmlFor="film-id">
                  TMDB ID{' '}
                  <input
                    type="text"
                    name="film-id"
                    id="film-id"
                    value={tmdbId}
                    readOnly
                  />
                </label>
              </fieldset>
              <fieldset>
                <label htmlFor="film-id">
                  Release Date{' '}
                  <input
                    type="text"
                    name="film-id"
                    id="film-id"
                    value={releaseDate}
                    readOnly
                  />
                </label>
              </fieldset>
              <div>
                <p>{overview}</p>
                {posterPath && (
                  <img
                    src={`//image.tmdb.org/t/p/w185_and_h278_bestv2/${posterPath}`}
                    alt={title}
                  />
                )}
              </div>
            </form>
          </>
        )}
      </Mutation>
    );
  }
}

export default AddFilm;
