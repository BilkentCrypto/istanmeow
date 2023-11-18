import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './pages/about.js'

export default function Router(params) {
  <Routes>
    <Route path="/about"> element={<h1>About</h1>}</Route>
    <Route path="/topics" element={<h1>Topics</h1>} />
    <Route path="/" element={<h1>Home</h1>} />
  </Routes>;
}
