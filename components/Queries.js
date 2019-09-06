import gql from 'graphql-tag';
import { perPage } from '../config';

const ALL_FILMS_QUERY = gql`
  query ALL_FILMS_QUERY {
    films {
      id
      title
      release_date
      tmdb_id
    }
  }
`;

export { ALL_FILMS_QUERY };
