import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SecondPage from "./pages/SecondPage";
import ChatBot from "./pages/ChatBot";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/page2" element={<SecondPage />} />
        <Route path="/ChatBot" element={<ChatBot />} />
      </Routes>
    </Router>
  );
}

export default App;
