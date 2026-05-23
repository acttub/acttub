import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import LegacyLandingPage from './pages/LegacyLandingPage';
import TheaPage from './pages/TheaPage';
import ExcerPage from './pages/ExcerPage';
import CommunityPage from './pages/CommunityPage';
import ArchivePage from './pages/ArchivePage';
import LandingPage from './pages/LandingPage';
import QuizPage from './pages/QuizPage';
import SurveyPage from './pages/SurveyPage';
import ResultPage from './pages/ResultPage';
import NotFoundPage from './pages/NotFoundPage';
import { initAnalytics, trackPageView } from './lib/analytics';

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    // dedupe는 trackPageView 내부에서 모듈 스코프로 처리됨
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<LegacyLandingPage />} />
          <Route path="/thea/*" element={<TheaPage />} />
          <Route path="/excer/*" element={<ExcerPage />} />
          <Route path="/community/*" element={<CommunityPage />} />
          <Route path="/archive/*" element={<ArchivePage />} />
          <Route path="/ACTI" element={<LandingPage />} />
          <Route path="/ACTI/quiz" element={<QuizPage />} />
          <Route path="/ACTI/survey" element={<SurveyPage />} />
          <Route path="/ACTI/result/:code" element={<ResultPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
