import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import User from './User';

const Header = () => (
  <div>
    <Link href="/">
      <a>Film Fest!</a>
    </Link>
    <User>{({ data: { me } }) => me && <div>{me.name}</div>}</User>
  </div>
);

export default Header;
