import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Map from "./components/MyMapComponent";
import Home from "./components/Home";
import SimpleMap from "./components/SimpleMap";
import "./index.css";
import MapComponent from "./components/MapComponent";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route exact path="/" element={<Home />} />
          </Routes>
          <Routes>
            <Route exact path="/simplemap" element={<SimpleMap />} />
          </Routes>
          <Routes>
            <Route exact path="/map" element={<MapComponent />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
