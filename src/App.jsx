import React from 'react';
import TodoList from '/components/TodoList';
import './App.css';
import { DarkModeProvoider } from '../context/DarkModeContext';



export default function App() {
  return (
    <DarkModeProvoider>
      <TodoList />
    </DarkModeProvoider>
  );
}

