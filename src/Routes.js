import { Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './assets/styles/global';

import NotFound from './pages/NotFound';
import defaultTheme from './assets/styles/themes/default';
import Home from './pages/Home';

function LoginRoute() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles />
      <AnimatePresence mode="wait">
        <Routes>
          <Route exact path="/" element={<Home />} />
          {/* <Route exact path="/" element={<Home />} />
          <Route exact path="/signup" element={<Result />} /> */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </ThemeProvider>
  );
}

export default LoginRoute;
