import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { format } from 'date-fns';
import DownShift from 'downshift';
import debounce from 'lodash.debounce';
import Error from './ErrorMessage';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';
import { ALL_FILMS_QUERY } from './Queries';

const ADD_FILM_MUTATION = gql`
  mutation ADD_FILM_MUTATION(
    $title: String!
    $release_date: String
    $tmdb_id: Int!
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
    overview: '',
    films: [],
    isAdded: false,
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
      release_date: item.release_date,
      tmdb_id: item.id,
      posterPath: item.poster_path,
      overview: item.overview,
    });
  };

  render() {
    const {
      title,
      release_date,
      tmdb_id,
      overview,
      posterPath,
      films,
      isAdded,
    } = this.state;
    return (
      <Mutation
        mutation={ADD_FILM_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: ALL_FILMS_QUERY }]}
      >
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
                        onFocus: e => {
                          this.setState({
                            isAdded: false,
                          });
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
                this.setState({
                  isAdded: true,
                });
              }}
            >
              <fieldset>
                {/* TODO: Submit film to DB on selection */}
                <div>
                  {isAdded && <p>Film added!</p>}
                  <button type="submit">Add film</button>
                </div>
                <label htmlFor="title">
                  Title{' '}
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={title}
                    readOnly
                  />
                </label>
              </fieldset>
              <fieldset>
                <label htmlFor="tmdb_id">
                  TMDB ID{' '}
                  <input
                    type="text"
                    name="tmdb_id"
                    id="tmdb_id"
                    value={tmdb_id}
                    readOnly
                  />
                </label>
              </fieldset>
              <fieldset>
                <label htmlFor="release_date">
                  Release Date{' '}
                  <input
                    type="text"
                    name="release_date"
                    id="release_date"
                    value={release_date}
                    readOnly
                  />
                </label>
              </fieldset>
              <div>
                {overview && <small>{overview}</small>}
                {posterPath && (
                  <div>
                    <img
                      src={`//image.tmdb.org/t/p/w185_and_h278_bestv2/${posterPath}`}
                      alt={title}
                    />
                  </div>
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
