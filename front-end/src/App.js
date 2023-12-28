import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Register from "./page/Register";
import Header from './component/common/Header';
import Home from "./page/Home";
import Post from "./page/Post";

function App() {
    return (
        <Router>
            <div>
                <Header />
                    <Routes>
                        <Route path="/">
                            <Route
                                path="/"
                                element={<Home />}
                            />

                            <Route
                                path="/post"
                                element={<Post />}
                            />

                            <Route
                                path="/login"
                                element={<Login />}
                            />

                            <Route
                                path="/register"
                                element={<Register />}
                            />
                        </Route>
                    </Routes>
            </div>
        </Router>
    );
}

export default App;
