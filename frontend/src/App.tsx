// App.tsx (основной роутинг)
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import FinancialPlanner from './pages/Common/FinancialPlanner';
import './App.css';
import React, { useEffect } from 'react';


const App = () => {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      tg.expand();
      tg.ready();
      
      // Установка цветов из Telegram
      document.documentElement.style.setProperty(
        '--tg-theme-bg-color', 
        tg.themeParams.bg_color || '#ffffff'
      );
      document.documentElement.style.setProperty(
        '--tg-theme-text-color',
        tg.themeParams.text_color || '#000000'
      );
      
      // Настройка основной кнопки
      tg.MainButton.setText('Сохранить');
      tg.MainButton.show();
      tg.MainButton.onClick(() => {
        tg.sendData('Data saved');
      });
    }
  }, []);

  return (
    <Router>
      <div className="telegram-webapp">
        <Routes>
          <Route path="/" element={<FinancialPlanner />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;