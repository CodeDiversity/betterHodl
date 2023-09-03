import { BrowserRouter as Router } from 'react-router-dom';
import { Observable } from 'rxjs';
import Layout from './views/Layout';

function App() {
  return (
    <Router>
      <div className='App'>
        <Layout />
      </div>
    </Router>
  );
}

export default App;
