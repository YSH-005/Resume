import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import NavBar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { SocketProvider } from "./context/SocketContext";
import { useAuth } from "./context/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from 'react-hot-toast';



function App() {
  const { user } = useAuth();

  return (
    <SocketProvider user={user}>
      <BrowserRouter>
       <Toaster position="top-right" />
      <ToastContainer position="top-right" autoClose={3000} />
        <NavBar />
        <AppRoutes />
        <Footer />
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
