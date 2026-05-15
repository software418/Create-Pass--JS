import { jsx as _jsx } from "react/jsx-runtime";
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './app/routes';
import "./styles/index.css";
function App() {
    return (_jsx(BrowserRouter, { children: _jsx(AppRoutes, {}) }));
}
export default App;
