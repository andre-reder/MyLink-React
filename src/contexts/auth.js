import {
  createContext, useMemo, useCallback, useContext, useState,
} from 'react';
import PropTypes from 'prop-types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { apiCode, key } from '../enviromentVariables';
import authService from '../services/authService';

const AuthContext = createContext({});

export function useAppContext() {
  const context = useContext(AuthContext);

  return context;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState('');

  const getToken = useCallback(async () => {
    try {
      const bodyGetToken = await authService.getToken({
        reqBody: JSON.stringify({
          apiCode,
          key,
        }),
      });
      const tk = bodyGetToken.tkValida;
      if (!tk) {
        toast.error(`Não foi possível carregar a página. Por favor, tente novamente. (${bodyGetToken.msg})`);
        setToken('');
        return;
      }
      setToken(tk);
    } catch (error) {
      toast.error(`Não foi possível carregar a página. Por favor, tente novamente. (${error})`);
    }
  }, []);

  const appData = useMemo(() => ({
    token,
    getToken,
  }), [token, getToken]);

  return (
    <>
      <AuthContext.Provider value={appData}>
        {children}
      </AuthContext.Provider>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
