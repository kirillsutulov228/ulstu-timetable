import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import AutocompleteInput from './components/AutocompleteInput/index.js';
import axios from 'axios';
import Alert from 'antd/lib/alert/index.js';
import { useState, useEffect } from 'react';
import Timetable from './components/Timetalbe/index';
import './index.css';
import 'antd/dist/antd.css';
import Loader from './components/Loader/index';

function getSheduleWeek(date = new Date()) {
  const firstJanuary = new Date(date.getFullYear(), 0, 1);
  const dayNr = Math.ceil((date - firstJanuary) / (24 * 60 * 60 * 1000));
  const weekNr = Math.ceil((dayNr + firstJanuary.getDay()) / 7);
  return weekNr % 2 ? 2 : 1;
}

function App() {
  const [selectedGroup, setSelectedGroup] = useState();
  const [allGroups, setAllGroups] = useState();
  const [error, setError] = useState();
  const [schedule, setShedule] = useState();
  const [loading, setLoading] = useState(false);
  const [week, setWeek] = useState(getSheduleWeek());

  useEffect(() => {
    async function loadGroups() {
      try {
        setLoading(true);
        const response = await axios.get('https://time.ulstu.ru/api/1.0/groups');
        setAllGroups(response.data.response);
      } catch (err) {
        console.log(err);
        setError({ message: 'Ошибка', description: 'Не удалось загрузить список групп' });
      } finally {
        setLoading(false);
      }
    }
    loadGroups();
  }, []);

  useEffect(() => {
    async function loadTimetable() {
      if (selectedGroup) {
        try {
          setLoading(true);
          setShedule(null);
          await new Promise((r) => setTimeout(r, 450));
          const response = await axios.get(`https://time.ulstu.ru/api/1.0/timetable?filter=${selectedGroup}`);
          setShedule(response.data.response.weeks);
        } catch (err) {
          setShedule(null);
          setError({ message: 'Ошибка', description: 'Не удалось загрузить расписание' });
        } finally {
          setLoading(false);
        }
      }
    }
    loadTimetable();
  }, [selectedGroup]);

  async function searchGroupOptions(value, setOptions) {
    if (allGroups) {
      const options = allGroups
        .filter((group) => group.toLowerCase().includes(value.toLowerCase()))
        .map((value) => ({ value }));
      setOptions(options);
    }
  }

  return (
    <div className='app'>
      <div className='container'>
        <h1 className='title'>
          УлГТУ расписание
          <span>Сейчас {week}-ая неделя</span>
        </h1>
        <AutocompleteInput
          placeholder='Введите название группы'
          notFoundContent='Ничего не найдено'
          maxOptions='999'
          onSelect={setSelectedGroup}
          onSearch={searchGroupOptions}
          style={{ width: '100%' }}
        />
        {loading && <Loader style={{ margin: '40px auto' }} />}
        {schedule && !error && (
          <div className='timetable-wrapper'>
            <h2 style={{ margin: '20px 0' }}>Расписание группы {selectedGroup}</h2>
            <Timetable style={{ margin: '20px 0 60px' }} showBg={week === 1} schedule={schedule[0].days} title='Неделя 1' />
            <Timetable style={{ margin: '60px 0' }} showBg={week === 2} schedule={schedule[1].days} title='Неделя 2' />
          </div>
        )}
        {error && (
          <Alert style={{ margin: '20px 0' }} type='error' message={error.message} description={error.description} />
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
