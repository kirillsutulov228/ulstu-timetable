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
import { getScheduleWeek, findIncludesInArray } from './utils.js';

function App() {
  const [selectedValue, setSelectedValue] = useState(localStorage.getItem('selectedValue') || '');
  const [saveSelect, setSaveSelect] = useState(localStorage.getItem('saveSelect') || false);
  const [allGroups, setAllGroups] = useState();
  const [allTeachers, setAllTeachers] = useState();
  const [error, setError] = useState();
  const [schedule, setShedule] = useState();
  const [loading, setLoading] = useState(0);
  const [week, setWeek] = useState(null);
  const [weeks, setWeeks] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [showType, setShowType] = useState(localStorage.getItem('showType') || 'table');

  useEffect(() => {
    async function loadGroups() {
      try {
        setLoading((v) => v + 1);
        const scheduleWeek = getScheduleWeek();
        const groupResponse = await axios.get('https://time.ulstu.ru/api/1.0/groups');
        const teachersResponse = await axios.get('https://time.ulstu.ru/api/1.0/teachers');
        const randSheduleRespose = await axios.get(
          `https://time.ulstu.ru/api/1.0/timetable?filter=${groupResponse.data.response[0]}`
        );
        const weeks = Object.keys(randSheduleRespose.data.response.weeks).map((v) => +v);
        let week = weeks[0] ?? null;
        if (weeks.length === 2) {
          week = scheduleWeek % 2 === weeks[0] % 2 ? weeks[0] : weeks[1];
        }
        setAllGroups(groupResponse.data.response);
        setAllTeachers(teachersResponse.data.response);
        setWeeks(weeks);
        setCurrentWeek(week);
        setWeek(week);
      } catch (err) {
        console.log(err);
        setError({ message: 'Ошибка', description: 'Не удалось загрузить список групп' });
      } finally {
        setLoading((v) => v - 1);
      }
    }
    loadGroups();
  }, []);

  useEffect(() => {
    async function loadTimetable() {
      if (selectedValue) {
        try {
          setError(false);
          setLoading((v) => v + 1);
          setShedule(null);
          await new Promise((r) => setTimeout(r, 450));
          const response = await axios.get(`https://time.ulstu.ru/api/1.0/timetable?filter=${selectedValue}`);
          const shedule = response.data.response.weeks;
          setShedule(shedule);
        } catch (err) {
          setShedule(null);
          setError({ message: 'Ошибка', description: 'Не удалось загрузить расписание' });
        } finally {
          setLoading((v) => v - 1);
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
    event.currentTarget.blur();
    const newType = showType === 'table' ? 'list' : 'table';
    localStorage.setItem('showType', newType);
    setShowType(newType);
  }
  return (
    <div className='app'>
      <div className='container'>
        <h1 className='title'>
          <p>Расписание УлГТУ</p>
          {currentWeek !== null && <span>Сейчас {currentWeek}-ая неделя</span>}
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
        {loading > 0 && <Loader style={{ margin: '40px auto' }} />}
        {!loading && schedule && weeks && !error && (
          <>
            <Button onClick={changeShowType}>Режим отображения: {showType === 'table' ? 'таблица' : 'список'}</Button>
            <div className='timetable-wrapper'>
              <div style={{ margin: '20px 0' }}>
                {weeks.map((weekItem, i) => (
                  <Button
                    key={'week-button' + i}
                    type={week === weekItem ? 'primary' : 'default'}
                    style={{ marginRight: '10px' }}
                    onClick={(e) => {
                      e.currentTarget.blur();
                      setWeek(weekItem);
                    }}
                  >
                    Неделя {weekItem}
                  </Button>
                ))}
              </div>
              {showType === 'table' ? (
                <>
                  <Timetable
                    style={{ margin: '20px 0' }}
                    showBg={week === currentWeek}
                    schedule={schedule[week].days}
                    title={`Неделя ${week}`}
                  />
                </>
              ) : (
                <>
                  <ListSchedule
                    showBg={week === currentWeek}
                    title={`Неделя ${week}`}
                    style={{ margin: '20px 0' }}
                    schedule={schedule[week].days}
                  ></ListSchedule>
                </>
              )}
            </div>
          </>
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
