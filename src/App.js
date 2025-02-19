import { Route, Routes } from "react-router-dom";
import Student from "./components/modules/student/Student";
import SignUp from "./components/signup/signup";
import Login from "./components/login/Login";
import ProtectedRoute from './components/ProtectedRoute';
import MyTickets from "./components/Mytickets/MyTickets";
import Faculty from "./components/modules/faculty/Faculty";




function App() {
  return (
    <div>

      {/* <Main /> */}
      <Routes>
        <Route path="/signup" element={<SignUp />} />

        <Route path="/" element={<Login />} />
        <Route path="/student" element={<ProtectedRoute><Student /></ProtectedRoute>} />
        <Route path="/faculty" element={<ProtectedRoute><Faculty /></ProtectedRoute>} />
        <Route path="/my-tickets" element={<MyTickets />} />
      </Routes>

    </div>
  );
}

export default App;
