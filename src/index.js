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
import { Button, Switch } from 'antd';
import ListSchedule from './components/ListSchedule/index';

function getSheduleWeek(date = new Date()) {
  const firstJanuary = new Date(date.getFullYear(), 0, 1);
  const dayNr = Math.ceil((date - firstJanuary) / (24 * 60 * 60 * 1000));
  const weekNr = Math.ceil((dayNr + firstJanuary.getDay()) / 7);
  return weekNr % 2 ? 2 : 1;
}

function findIncludesInArray(value, arr) {
  return arr
    .filter((group) => group.toLowerCase().trim().includes(value.toLowerCase().trim()))
    .map((value) => ({ value }));
}

function App() {
  const [selectedValue, setSelectedValue] = useState(localStorage.getItem('selectedValue') || '');
  const [saveSelect, setSaveSelect] = useState(localStorage.getItem('saveSelect') || false);
  const [allGroups, setAllGroups] = useState();
  const [allTeachers, setAllTeachers] = useState();
  const [error, setError] = useState();
  const [schedule, setShedule] = useState();
  const [loading, setLoading] = useState(false);
  const [week, setWeek] = useState(getSheduleWeek());
  const [showType, setShowType] = useState(localStorage.getItem('showType') || 'table');

  useEffect(() => {
    async function loadGroups() {
      try {
        setLoading(true);
        const groupResponse = await axios.get('https://time.ulstu.ru/api/1.0/groups');
        const teachersResponse = await axios.get('https://time.ulstu.ru/api/1.0/teachers');
        setAllGroups(groupResponse.data.response);
        setAllTeachers(teachersResponse.data.response);
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
      if (selectedValue) {
        try {
          setLoading(true);
          setShedule(null);
          await new Promise((r) => setTimeout(r, 450));
          const response = await axios.get(`https://time.ulstu.ru/api/1.0/timetable?filter=${selectedValue}`);
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
  }, [selectedValue]);

  async function searchGroupOptions(value, setOptions) {
    const options = [];
    if (allGroups) {
      const groupsOptions = findIncludesInArray(value, allGroups);
      if (groupsOptions.length) {
        options.push({ label: 'Группы', options: findIncludesInArray(value, allGroups) });
      }
    }
    if (allTeachers) {
      const teacherOptions = findIncludesInArray(value, allTeachers);
      if (teacherOptions.length) {
        options.push({ label: 'Преподаватели', options: findIncludesInArray(value, allTeachers) });
      }
    }
    setOptions(options);
  }

  useEffect(() => {
    if (!saveSelect) {
      localStorage.removeItem('selectedValue');
      localStorage.removeItem('saveSelect');
      return;
    }
    localStorage.setItem('selectedValue', selectedValue);
    localStorage.setItem('saveSelect', saveSelect);
  }, [selectedValue, saveSelect]);

  function changeShowType(event) {
    const newType = showType === 'table' ? 'list' : 'table';
    localStorage.setItem('showType', newType);
    setShowType(newType);
  }

  return (
    <div className='app'>
      <div className='container'>
        <h1 className='title'>
          Расписание УлГТУ
          <span>Сейчас {week}-ая неделя</span>
        </h1>
        <AutocompleteInput
          placeholder='Введите название группы или имя преподавтеля'
          notFoundContent='Ничего не найдено'
          maxOptions='999'
          defaultValue={selectedValue || ''}
          onSelect={setSelectedValue}
          onSearch={searchGroupOptions}
          style={{ width: '100%' }}
        />
        <div style={{ margin: '20px 0' }}>
          Запомнить выбор <Switch style={{ margin: '0 5px' }} defaultChecked={saveSelect} onChange={setSaveSelect} />
        </div>
        {schedule && !error && (
          <Button onClick={changeShowType}>Режим отображения: {showType === 'table' ? 'таблица' : 'список'}</Button>
        )}
        {loading && <Loader style={{ margin: '40px auto' }} />}
        {schedule && !error && (
          <div className='timetable-wrapper'>
            {showType === 'table' ? (
              <>
                <Timetable
                  style={{ margin: '20px 0' }}
                  showBg={week === 1}
                  schedule={schedule[0].days}
                  title='Неделя 1'
                />
                <Timetable
                  style={{ margin: '50px 0' }}
                  showBg={week === 2}
                  schedule={schedule[1].days}
                  title='Неделя 2'
                />
              </>
            ) : (
              <>
                <ListSchedule showBg={week === 1} title='Неделя 1' style={{ margin: '20px 0' }} schedule={schedule[0].days}></ListSchedule>
                <ListSchedule showBg={week === 2} title='Неделя 2' style={{ margin: '50px 0' }} schedule={schedule[1].days}></ListSchedule>
              </>
            )}
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
