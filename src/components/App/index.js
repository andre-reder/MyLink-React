import { ThemeProvider } from 'styled-components';
import { toast } from 'react-toastify';
import { useCallback, useEffect, useState } from 'react';
import Routes from '../../Routes';
import { useAppContext } from '../../contexts/auth';
import Loader from '../Loader';
import NoData from '../NoData';
import GlobalStyles from '../../assets/styles/global';
import defaultTheme from '../../assets/styles/themes/default';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { token, getToken } = useAppContext();

  const loadApplication = useCallback(async () => {
    try {
      setIsLoading(true);
      await getToken();
    } catch (error) {
      toast.error('Houve um erro ao carregar a página. Por favor, tente recarregar');
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    loadApplication();
  }, [loadApplication]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles />
      <Loader isLoading={isLoading} />
      {!isLoading && token && (
        <Routes />
      )}

      {!isLoading && !token && (
        <NoData
          icon="sad"
          label={(
            <>
              Ocorreu um erro ao carregar a página.
              <button type="button" onClick={loadApplication}>Tentar Novamente</button>
              .
            </>
)}
        />
      )}
    </ThemeProvider>
  );
}
