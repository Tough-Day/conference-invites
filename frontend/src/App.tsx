import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ConferenceCreate from './pages/ConferenceCreate';
import ConferenceEdit from './pages/ConferenceEdit';
import ConferenceDetail from './pages/ConferenceDetail';
import PublicForm from './pages/PublicForm';
import SubmissionSuccess from './pages/SubmissionSuccess';
import Login from './pages/Login';
import UserGuide from './pages/UserGuide';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />

      {/* Admin Routes - Protected */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/conferences/new"
        element={
          <ProtectedRoute>
            <ConferenceCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/conferences/:id"
        element={
          <ProtectedRoute>
            <ConferenceDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/conferences/:id/edit"
        element={
          <ProtectedRoute>
            <ConferenceEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/guide"
        element={
          <ProtectedRoute>
            <UserGuide />
          </ProtectedRoute>
        }
      />

      {/* Public Routes - No Auth Required */}
      <Route path="/form/:slug" element={<PublicForm />} />
      <Route path="/success" element={<SubmissionSuccess />} />
    </Routes>
  );
}

export default App;
