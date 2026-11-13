import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Faculty from './pages/Faculty';
import About from './pages/About';
import Support from './pages/Support';
import AppPage from './pages/AppPage';
import LegalPage from './pages/LegalPage';
import SitemapPage from './pages/SitemapPage';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:slug" element={<CourseDetail />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="about" element={<About />} />
        <Route path="support" element={<Support />} />
        <Route path="app" element={<AppPage />} />
        <Route path="privacy-policy" element={<LegalPage doc="privacy-policy" />} />
        <Route path="terms-and-conditions" element={<LegalPage doc="terms-and-conditions" />} />
        <Route path="refund-and-cancellation-policy" element={<LegalPage doc="refund-and-cancellation-policy" />} />
        <Route path="sitemap" element={<SitemapPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
