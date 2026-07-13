import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Layout } from './components/layout/Layout';
import { ScrollToTop } from './components/common/ScrollToTop';
import { ROUTES, LEGACY_REDIRECTS } from './lib/routes';
import './index.css';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Cases = lazy(() => import('./pages/Cases').then(m => ({ default: m.Cases })));
const Resources = lazy(() => import('./pages/Resources').then(m => ({ default: m.Resources })));
const ResourceDetail = lazy(() => import('./pages/ResourceDetail').then(m => ({ default: m.ResourceDetail })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Soluciones = lazy(() => import('./pages/Soluciones').then(m => ({ default: m.Soluciones })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                style={{ minHeight: '100%' }}
            >
                <Routes>
                    {/* Rutas canónicas en español */}
                    <Route path={ROUTES.home} element={<Home />} />
                    <Route path={ROUTES.soluciones} element={<Soluciones />} />
                    <Route path={ROUTES.servicios} element={<Navigate to={ROUTES.contacto} replace />} />
                    <Route path={ROUTES.casos} element={<Cases />} />
                    <Route path={ROUTES.precios} element={<Navigate to={ROUTES.contacto} replace />} />
                    <Route path={ROUTES.recursos} element={<Resources />} />
                    <Route path={`${ROUTES.recursos}/:slug`} element={<ResourceDetail />} />
                    <Route path={ROUTES.contacto} element={<Contact />} />
                    <Route path={ROUTES.diagnostico} element={<Navigate to={ROUTES.contacto} replace />} />

                    {/* Redirects desde URLs antiguas en inglés (red de seguridad client-side) */}
                    {LEGACY_REDIRECTS.map(([from, to]) => (
                        <Route key={from} path={from} element={<Navigate to={to} replace />} />
                    ))}

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
}

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Layout>
                <Suspense fallback={null}>
                    <AnimatedRoutes />
                </Suspense>
            </Layout>
        </Router>
    );
}

export default App;
