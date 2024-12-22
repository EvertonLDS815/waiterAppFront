
import logOut from '../../assets/log-out.svg';

const Header = ({user}) => {
    return (
        <header>
            <h2>{user.role} - {user.email}</h2>
            <button>
              <img src={logOut} />
            </button>
          </header>
    )
}

export default Header;