
import logOut from '../../assets/log-out.svg';

const Header = ({user, onLogout}) => {

    return (
        <header>
            <h2>{user.role} - {user.email}</h2>
            <button onClick={onLogout}>
              <img src={logOut} />
            </button>
          </header>
    )
}

export default Header;