// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import history from './utils/redirect';

// Import Components
import Login from './pages/Login';
import Order from './pages/Order';
import Table from './pages/Table';

const App = () => {
  const token = localStorage.getItem('waiter');

  return (
    <Router>
      <Routes history={history}>
        {/* Rota inicial "/" -> redireciona automaticamente */}
        <Route path="/" element={token ? <Navigate to="/order" replace /> : <Navigate to="/login" replace />} />

        <Route path="/login" element={<PublicRoute component={Login} />} />
        <Route path="/order" element={<PrivateRoute component={Order} />} />
        <Route path="/tables" element={<PrivateRoute component={Table} />} />
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
