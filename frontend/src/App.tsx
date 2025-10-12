import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ConferenceCreate from './pages/ConferenceCreate';
import ConferenceEdit from './pages/ConferenceEdit';
import ConferenceDetail from './pages/ConferenceDetail';
import PublicForm from './pages/PublicForm';
import SubmissionSuccess from './pages/SubmissionSuccess';

function App() {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/conferences/new" element={<ConferenceCreate />} />
      <Route path="/conferences/:id" element={<ConferenceDetail />} />
      <Route path="/conferences/:id/edit" element={<ConferenceEdit />} />

      {/* Public Routes */}
      <Route path="/form/:slug" element={<PublicForm />} />
      <Route path="/success" element={<SubmissionSuccess />} />
    </Routes>
  );
}

export default App;
