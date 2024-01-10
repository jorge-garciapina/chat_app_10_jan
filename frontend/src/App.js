import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/dashboard/Dashboard";
import {initializeLanguage} from "./translations/languageUtils";

import {Provider} from "react-redux";
import store from "./redux/store";
import ProtectedRoute from "./ProtectedRoute";

/**
 * Main application component.
 * Sets up the routing for the application, initializes language settings,
 * and provides the Redux store to the application.
 */
function App() {
  React.useEffect(() => {
    initializeLanguage();
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            {/* <Route path="/" element={<Login />} /> */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/dashboard" element={<Dashboard />} />{" "} */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />{" "}
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
