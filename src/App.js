import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Importing Homepage components
import InformationContainer from './components/homepage/InformationContainer';
import LoginContainer from './components/homepage/LoginContainer';
import RegisterContainer from './components/homepage/RegisterContainer';


// Importing Dashboard components
import ServicesContainer from './components/dashboard/ServicesContainer';
import AppliedContainer from './components/dashboard/AppliedContainer';
import UpdateContainer from './components/dashboard/UpdateContainer';
import LogoutContainer from './components/dashboard/LogoutContainer';
import BirthForm from './components/dashboard/forms/BirthForm';
import MarriageForm from './components/dashboard/forms/MarriageForm';
import DeathForm from './components/dashboard/forms/DeathForm';
import BookSlot from "./components/dashboard/forms/BookSlot";
// Importing Pages
import HomePage from './pages/Homepage';
import Dashboard from './pages/Dashboard';
import { useDispatch } from "react-redux";

import { CITIZEN_ACTIONS } from "./redux-store/slices/citizen-slice";
import { useContext, useEffect } from "react";
import { SocketContext } from "./context/socketContext";
import VerificationWindow from "./components/verification/VerificationWindow";

const API = 'http://localhost:5000';
const ROUTER = createBrowserRouter(
  [
    // Homepage paths
    {
      path: '/', element: <HomePage />,
      children: [
        { index: true, element: <InformationContainer /> },
        { path: 'register', element: <RegisterContainer API={API} /> },
        { path: 'login', element: <LoginContainer API={API} /> },
      ]
    },
    // Dashboard paths
    {
      path: '/dashboard', element: <Dashboard />,
      children: [
        { index: true, element: <ServicesContainer API={API} /> },
        { path: 'applied', element: <AppliedContainer API={API} /> },
        { path: 'update-profile', element: <UpdateContainer API={API} /> },
        { path: 'logout', element: <LogoutContainer API={API} /> },

        { path: 'forms/birth-form', element: <BirthForm API={API} /> },
        { path: 'forms/marriage-form', element: <MarriageForm API={API} /> },
        { path: 'forms/death-form', element: <DeathForm API={API} /> },
        { path: 'applied/book-slot/:district/:service/:appliedId', element: <BookSlot API={API} /> }
      ]
    },
    // Verification
    {
      path: '/verification', element: <VerificationWindow API={API} />
    }
  ]
);


function App() {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  useEffect(() => {
    socket.on("get_my_socket_id", (id) => {
      console.log("mysocket - ", id)
      dispatch(CITIZEN_ACTIONS.setSocket({ socket: id }))
    })
  }, [dispatch, socket]);
  return (
    <div>
      <RouterProvider router={ROUTER}></RouterProvider>
    </div>
  );
}

export default App;
