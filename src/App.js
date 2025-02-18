import { Route, Routes } from "react-router-dom";
import Main from "./components/Main";
import Student from "./components/modules/Student";
import SignUp from "./components/signup/signup";



function App() {
  return (
    <div>

      {/* <Main /> */}
      <Routes>

        <Route path="/" element={<Main />} />
        <Route path="/Student" element={<Student />} />
        <Route path="/signup" element={<SignUp />} />

      </Routes>

    </div>
  );
}

export default App;
