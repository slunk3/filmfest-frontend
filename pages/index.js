import PropTypes from 'prop-types';
import Films from '../components/Films';
import PleaseSignIn from '../components/PleaseSignIn';

const Home = ({ query: { page } }) => (
  <PleaseSignIn>
    <Films />
  </PleaseSignIn>
);

Home.propTypes = {
  query: PropTypes.object,
};

export default Home;
