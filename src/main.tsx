import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'
import './index.css'

// Entry SSG. vite-react-ssg prerenderiza cada ruta a HTML estático en build
// e hidrata en cliente con react-router (data router).
export const createRoot = ViteReactSSG({
    routes,
    basename: import.meta.env.BASE_URL,
})
