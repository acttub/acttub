import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import LegacyLandingPage from './views/LegacyLandingPage';
import TheaPage from './views/TheaPage';
import ExcerPage from './views/ExcerPage';
import CommunityPage from './views/CommunityPage';
import ArchivePage from './views/ArchivePage';
import CoachPage from './views/CoachPage';
import LandingPage from './views/LandingPage';
import QuizPage from './views/QuizPage';
import SurveyPage from './views/SurveyPage';
import ResultPage from './views/ResultPage';
import NotFoundPage from './views/NotFoundPage';
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
          <Route path="/coach/*" element={<CoachPage />} />
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
