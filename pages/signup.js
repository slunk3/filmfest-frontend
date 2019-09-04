import PropTypes from 'prop-types';
import styled from 'styled-components';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const signupPage = () => (
  <Columns>
    <SignIn />
    <SignUp />
  </Columns>
);

export default signupPage;
