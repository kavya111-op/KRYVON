import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { MotionConfig } from 'motion/react';

createRoot(document.getElementById('root')!).render(
  <MotionConfig reducedMotion="user">
    <App />
  </MotionConfig>
);
