import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Success from './Success';
import Failure from './Failure';

const Root = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/success" element={<Success />} />
      <Route path="/failure" element={<Failure />} />
    </Routes>
  </Router>
);

export default Root;
