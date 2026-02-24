import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Product } from './pages/Product';
import { Services } from './pages/Services';
import { Cases } from './pages/Cases';
import { Pricing } from './pages/Pricing';
import { Resources } from './pages/Resources';
import { Contact } from './pages/Contact';
import { Demo } from './pages/Demo';
import { Soluciones } from './pages/Soluciones';
import './index.css';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/soluciones" element={<Soluciones />} />
                    <Route path="/product" element={<Product />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/cases" element={<Cases />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/demo" element={<Demo />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
