import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
// import { AuthProvider } from '../../contexts/auth';
import Routes from '../../Routes';

export default function App() {
  return (
    <>
      <Routes />
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
