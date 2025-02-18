import { Route, Routes } from "react-router-dom";
import Student from "./components/modules/Student";
import SignUp from "./components/signup/signup";
import Login from "./components/login/Login";



function App() {
  return (
    <div>

      {/* <Main /> */}
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/Student" element={<Student />} />
        <Route path="/signup" element={<SignUp />} />

      </Routes>

    </div>
  );
}

export default App;
