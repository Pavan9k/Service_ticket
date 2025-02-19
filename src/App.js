import { Route, Routes } from "react-router-dom";
import Student from "./components/modules/Student";
import SignUp from "./components/signup/signup";
import Login from "./components/login/Login";
import Service from "./components/modules/Service";
import ProtectedRoute from './components/ProtectedRoute';
import MyTickets from "./components/Mytickets/MyTickets";




function App() {
  return (
    <div>

      {/* <Main /> */}
      <Routes>

        <Route path="/" element={<Login />} />
                <Route path="/student" element={<ProtectedRoute><Student /></ProtectedRoute>} />
                <Route path="/faculty" element={<ProtectedRoute><Service /></ProtectedRoute>} />
                <Route path="/my-tickets" element={<MyTickets />} />
      </Routes>

    </div>
  );
}

export default App;
