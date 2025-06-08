import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './FinancialPlanner.css';

interface Habit {
  name: string;
  days: boolean[];
}

interface Goal {
  name: string;
  steps: string[];
}

const FinancialPlanner: React.FC = () => {
  // Состояния компонента
  const [dateRange, setDateRange] = useState('');
  const [habits, setHabits] = useState<Habit[]>([
    { name: '', days: Array(7).fill(false) },
    { name: '', days: Array(7).fill(false) },
    { name: '', days: Array(7).fill(false) }
  ]);
  
  const [goals, setGoals] = useState<Goal[]>([
    { name: '', steps: ['', '', ''] },
    { name: '', steps: ['', '', ''] },
    { name: '', steps: ['', '', ''] }
  ]);
  
  const [intention, setIntention] = useState('');
  const [reward, setReward] = useState('');
  const [successes, setSuccesses] = useState('');
  const [improvements, setImprovements] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Рефы для страниц
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);

  // Дни недели для трекера привычек
  const weekDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

  // Инициализация при загрузке
  useEffect(() => {
    // Инициализация Telegram Web App
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.ready();
      
      // Настройка основной кнопки
      window.Telegram.WebApp.MainButton.setText('Сохранить');
      window.Telegram.WebApp.MainButton.show();
      
      // Обработчик клика по основной кнопке
      window.Telegram.WebApp.MainButton.onClick(() => {
        saveAllData();
        
        // Отправка данных обратно в Telegram
        window.Telegram.WebApp.sendData(JSON.stringify({
          habits,
          goals,
          intention,
          reward,
          successes,
          improvements,
          dateRange
        }));
      });
    }

    setCurrentWeekDates();
    loadSavedData();
  }, []);

  // Установка дат текущей недели
  const setCurrentWeekDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const formatDate = (date: Date) => {
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    };

    setDateRange(`${formatDate(monday)} - ${formatDate(sunday)}`);
  };

  // Обработчики изменений
  const handleHabitChange = (index: number, field: 'name' | 'days', value: string | boolean[]) => {
    const newHabits = [...habits];
    if (field === 'name') {
      newHabits[index].name = value as string;
    } else {
      newHabits[index].days = value as boolean[];
    }
    setHabits(newHabits);
  };

  const handleGoalChange = (index: number, field: 'name' | 'steps', value: string | string[]) => {
    const newGoals = [...goals];
    if (field === 'name') {
      newGoals[index].name = value as string;
    } else {
      newGoals[index].steps = value as string[];
    }
    setGoals(newGoals);
  };

  // Сохранение данных
  const saveAllData = () => {
    const data = {
      dateRange,
      habits,
      goals,
      intention,
      reward,
      successes,
      improvements
    };
    
    // Сохранение в localStorage (если не в Telegram Web App)
    if (!window.Telegram?.WebApp) {
      localStorage.setItem('financialPlannerData', JSON.stringify(data));
      alert('Данные сохранены!');
    }
  };

  // Загрузка сохраненных данных
  const loadSavedData = () => {
    // В Telegram Web App данные можно получать из initDataUnsafe
    if (window.Telegram?.WebApp) {
      const initData = window.Telegram.WebApp.initDataUnsafe;
      if (initData?.user) {
        // Можно загружать данные пользователя из backend
      }
      return;
    }

    // Локальное сохранение для веб-версии
    const savedData = localStorage.getItem('financialPlannerData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setDateRange(parsedData.dateRange || '');
      setHabits(parsedData.habits || [
        { name: '', days: Array(7).fill(false) },
        { name: '', days: Array(7).fill(false) },
        { name: '', days: Array(7).fill(false) }
      ]);
      setGoals(parsedData.goals || [
        { name: '', steps: ['', '', ''] },
        { name: '', steps: ['', '', ''] },
        { name: '', steps: ['', '', ''] }
      ]);
      setIntention(parsedData.intention || '');
      setReward(parsedData.reward || '');
      setSuccesses(parsedData.successes || '');
      setImprovements(parsedData.improvements || '');
    }
  };

  // Очистка данных
  const clearAllData = () => {
    if (window.confirm('Вы уверены, что хотите очистить все данные? Это действие нельзя отменить.')) {
      if (!window.Telegram?.WebApp) {
        localStorage.removeItem('financialPlannerData');
      }
      
      setDateRange('');
      setHabits([
        { name: '', days: Array(7).fill(false) },
        { name: '', days: Array(7).fill(false) },
        { name: '', days: Array(7).fill(false) }
      ]);
      setGoals([
        { name: '', steps: ['', '', ''] },
        { name: '', steps: ['', '', ''] },
        { name: '', steps: ['', '', ''] }
      ]);
      setIntention('');
      setReward('');
      setSuccesses('');
      setImprovements('');
      setCurrentWeekDates();
    }
  };

  // Экспорт в PDF
  const exportToPDF = async () => {
    if (!page1Ref.current || !page2Ref.current) return;

    setIsExporting(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Первая страница
      const canvas1 = await html2canvas(page1Ref.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: window.Telegram?.WebApp.themeParams.bg_color || '#ffffff'
      });
      const imgData1 = canvas1.toDataURL('image/png');
      doc.addImage(imgData1, 'PNG', 0, 0, 210, (canvas1.height * 210) / canvas1.width);

      // Вторая страница
      doc.addPage();
      const canvas2 = await html2canvas(page2Ref.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: window.Telegram?.WebApp.themeParams.bg_color || '#ffffff'
      });
      const imgData2 = canvas2.toDataURL('image/png');
      doc.addImage(imgData2, 'PNG', 0, 0, 210, (canvas2.height * 210) / canvas2.width);

      doc.save('Финансовый_план_на_неделю.pdf');
    } catch (error) {
      console.error('Ошибка при экспорте в PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Закрытие приложения в Telegram
  const handleClose = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  };

  // Автоматическое изменение высоты textarea
  const autoResizeTextarea = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

  return (
    <div className="container">
      {/* Первая страница */}
      <div className="page" ref={page1Ref}>
        <div className="header">
          <h1>ФИНАНСОВЫЙ ПЛАН НА НЕДЕЛЮ</h1>
        </div>
        
        <div className="date-range">
          <input
            type="text"
            className="date-input"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            placeholder="дд.мм - дд.мм"
          />
        </div>

        <div className="habits-section">
          <h2 className="section-title">ТРЕКЕР ПРИВЫЧЕК</h2>
          {habits.map((habit, i) => (
            <div className="habit-row" key={`habit-${i}`}>
              <textarea
                className="habit-input"
                value={habit.name}
                onChange={(e) => handleHabitChange(i, 'name', e.target.value)}
                onInput={autoResizeTextarea}
                placeholder={`Привычка ${i + 1}`}
              />
              
              <div className="days-container">
                {weekDays.map((day, j) => (
                  <div className="day-wrapper" key={`day-${i}-${j}`}>
                    <input
                      type="checkbox"
                      className="day-checkbox"
                      checked={habit.days[j]}
                      onChange={() => {
                        const newDays = [...habit.days];
                        newDays[j] = !newDays[j];
                        handleHabitChange(i, 'days', newDays);
                      }}
                    />
                    <span className="day-label">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="goals-section">
          <h2 className="section-title">ФОКУС НЕДЕЛИ</h2>
          <p className="focus-question">На чем ты сконцентрируешься на этой неделе? Выбери три главные цели.</p>
          
          <div className="goals-container">
            {goals.map((goal, i) => (
              <div className="goal-column" key={`goal-${i}`}>
                <textarea
                  className="goal-input"
                  value={goal.name}
                  onChange={(e) => handleGoalChange(i, 'name', e.target.value)}
                  onInput={autoResizeTextarea}
                  placeholder={`ЦЕЛЬ ${i + 1}`}
                />
                
                <p className="note">Этапы достижения</p>
                
                {goal.steps.map((step, j) => (
                  <textarea
                    key={`step-${i}-${j}`}
                    className="step-input"
                    value={step}
                    onChange={(e) => {
                      const newSteps = [...goal.steps];
                      newSteps[j] = e.target.value;
                      handleGoalChange(i, 'steps', newSteps);
                    }}
                    onInput={autoResizeTextarea}
                    placeholder="○"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Вторая страница */}
      <div className="page" ref={page2Ref}>
        <h2 className="section-title">НАМЕРЕНИЕ:</h2>
        <p className="note">Цель в действии<br />+ состояние в котором мы это будем делать.</p>
        <p className="note"><strong>Важный момент:</strong> намерение всегда ставится из позиции быть (а не иметь).</p>
        
        <textarea
          className="large-input"
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          onInput={autoResizeTextarea}
          placeholder="Ваше намерение"
        />

        <div className="divider"></div>
        
        <h2 className="section-title">НАГРАДА</h2>
        <p className="note">Чем я себя награжу за следование своим целям?</p>
        
        <textarea
          className="large-input"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          onInput={autoResizeTextarea}
          placeholder="Ваша награда"
        />

        <div className="divider"></div>
        
        <h2 className="section-title">РЕФЛЕКСИЯ</h2>
        <p className="note">Что у меня хорошо получилось сделать на этой неделе?</p>
        
        <textarea
          className="large-input"
          value={successes}
          onChange={(e) => setSuccesses(e.target.value)}
          onInput={autoResizeTextarea}
          placeholder="Ваши успехи"
        />
        
        <p className="note">Что я сделаю по-другому на следующей неделе?</p>
        
        <textarea
          className="large-input"
          value={improvements}
          onChange={(e) => setImprovements(e.target.value)}
          onInput={autoResizeTextarea}
          placeholder="Ваши планы на улучшения"
        />

        <div className="action-buttons">
          {!window.Telegram?.WebApp && (
            <>
              <button className="action-button" onClick={saveAllData}>Сохранить</button>
              <button className="action-button" onClick={clearAllData}>Очистить</button>
            </>
          )}
          <button 
            className="action-button" 
            onClick={exportToPDF}
            disabled={isExporting}
          >
            {isExporting ? 'Экспорт...' : 'PDF'}
          </button>
          {window.Telegram?.WebApp && (
            <button className="action-button" onClick={handleClose}>
              Закрыть
            </button>
          )}
        </div>

        {!window.Telegram?.WebApp && (
          <div className="footer">
            Институт Богатых и Красивых<br />
            Екатерины Образцовой<br /><br />
            ©ФИНАНСОВЫЙ ПЛАН НА НЕДЕЛЮ
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialPlanner;