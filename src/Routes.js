import { Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Result from './pages/Result';

function LoginRoute() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/resultado" element={<Result />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default LoginRoute;
