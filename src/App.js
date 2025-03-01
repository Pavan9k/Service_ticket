import { Route, Routes } from "react-router-dom";
import Student from "./components/modules/student/Student";
import SignUp from "./components/signup/signup";
import Login from "./components/login/Login";
import ProtectedRoute from './components/ProtectedRoute';
import MyTickets from "./components/Mytickets/MyTickets";
import Faculty from "./components/modules/faculty/Faculty";
import Admin from "./components/modules/admin/Admin";
import CreateTicket from "./components/Mytickets/CreateTicket";




function App() {
  return (
    <div>

      {/* <Main /> */}
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin/*" element={<Admin />} />

        <Route path="/create" element={<CreateTicket />} />


        <Route path="/" element={<Login />} />
        <Route path="/student" element={<ProtectedRoute><Student /></ProtectedRoute>} />
        <Route path="/faculty" element={<ProtectedRoute><Faculty /></ProtectedRoute>} />
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>


    </div>
  );
}

export default App;
