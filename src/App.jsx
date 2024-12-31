// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import history from './utils/redirect';

// Import Components
import Login from './pages/Login';
import Order from './pages/Order';

const App = () => {
  return (
    <Router>
      <Routes history={history}>
        <Route path="/login" element={<PublicRoute component={Login} />} />
        <Route path="/order" element={<PrivateRoute component={Order} />} />
      </Routes>
    </Router>
  );
};

const PrivateRoute = ({ component: Component }) => {
  const token = localStorage.getItem('waiter');
  return token ? <Component /> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ component: Component }) => {
  const token = localStorage.getItem('waiter');
  return token ? <Navigate to="/order" replace /> : <Component />;
};

export default App;