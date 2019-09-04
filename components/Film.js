import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

class Film extends Component {
  static propTypes = {
    film: PropTypes.object.isRequired,
  };

  render() {
    const { film } = this.props;
    return (
      <div>
        <Link href={{ pathname: '/film', query: { id: film.id } }}>
          <a>
            {film.title} || #{film.id}
          </a>
        </Link>
      </div>
    );
  }
}

export default Film;
