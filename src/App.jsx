import { BrowserRouter, Route, Routes } from "react-router-dom";
import ImageClassification from "./ImageClassification";
import ObjectDetection from "./ObjectDetection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/imageClassification" element={<ImageClassification />} />
        <Route path="/objectDetection" element={<ObjectDetection />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App


