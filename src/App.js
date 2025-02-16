import { Route, Routes } from "react-router-dom";
import Main from "./components/Main";
import Student from "./components/modules/Student";


function App() {
  return (
    <div>

      {/* <Main /> */}
      <Routes>

        <Route path="/" element={<Main />} />
        <Route path="/Student" element={<Student />} />

      </Routes>

    </div>
  );
}

export default App;
