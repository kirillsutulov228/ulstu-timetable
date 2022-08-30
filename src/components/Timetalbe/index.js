import './index.css';
import Table from 'antd/lib/table/Table.js';
import { Fragment, useState, useEffect } from 'react';

const initialColumns = [
  {
    title: '',
    dataIndex: 'time',
    key: 'time',
    fixed: 'left'
  },
  {
    title: 'Пнд',
    dataIndex: 'day0',
    key: 'day0'
  },
  {
    title: 'Втр',
    dataIndex: 'day1',
    key: 'day1'
  },
  {
    title: 'Срд',
    dataIndex: 'day2',
    key: 'day2'
  },
  {
    title: 'Чтв',
    dataIndex: 'day3',
    key: 'day3'
  },
  {
    title: 'Птн',
    dataIndex: 'day4',
    key: 'day4'
  },
  {
    title: 'Сбт',
    dataIndex: 'day5',
    key: 'day5'
  }
];

/* [
  [h1, m1, h2, m2]
]
*/
const lessonsTimes = [
  [8, 30, 9, 50],
  [10, 0, 11, 20],
  [11, 30, 12, 50],
  [13, 30, 14, 50],
  [15, 0, 16, 20],
  [16, 30, 17, 50],
  [18, 0, 19, 20],
  [19, 30, 20, 50]
];

function dateBetween(date, h1, m1, h2, m2) {
  const h = date.getHours();
  const m = date.getMinutes();
  return (h > h1 || (h === h1 && m >= m1)) && (h < h2 || (h === h2 && m <= m2));
}

function formatTime(h1, m1) {
  const date = new Date();
  date.setHours(h1);
  date.setMinutes(m1);
  return date.toLocaleTimeString().substring(0, 5);
}

export default function Timetable({ schedule, title, showBg, ...props }) {
  const [columns, setColumns] = useState(initialColumns);

  const dataSource = lessonsTimes.map((v, i) => ({
    time: `${i + 1}-я пара<br/>${formatTime(v[0], v[1])}-${formatTime(v[2], v[3])}`,
    key: i
  }));

  useEffect(() => {
    function updateBg() {
      const newColumns = JSON.parse(JSON.stringify(initialColumns));
      newColumns.forEach((col, i) => {
        const date = new Date();
        const timeOffset = -240
        date.setTime(date.getTime() + (date.getTimezoneOffset() - timeOffset) * 60000);
        col.onCell = (_, rowIndex) => {
          if (!showBg) return;
          let isCurrentDay = col.dataIndex === 'day' + (date.getDay() - 1);
          let isCurrentLesson =
            isCurrentDay &&
            dateBetween(
              date,
              lessonsTimes[rowIndex][0],
              lessonsTimes[rowIndex][1],
              lessonsTimes[rowIndex][2],
              lessonsTimes[rowIndex][3]
            );
          return {
            className: isCurrentLesson ? 'current' : isCurrentDay ? 'today' : undefined
          };
        };
        col.render = (text) => (
          <div style={{ minWidth: '80px', maxWidth: '200px', fontWeight: i === 0 ? '500' : '400' }}>
            {text.split('<br/>').map((v, i) => (
              <Fragment key={i}>
                {v}
                <br />
              </Fragment>
            ))}
          </div>
        );
      });
      setColumns(newColumns);
    }
    updateBg();
    const interval = setInterval(updateBg, 60000);
    return () => clearInterval(interval);
  }, []);

 
  schedule.forEach((day, dayIndex) => {
    day.lessons.forEach((lesson, lessonIndex) => {
      dataSource[lessonIndex]['day' + dayIndex] =
        lesson.length === 0
          ? '-'
          : lesson
              .map((v) => v.group + '<br/>' + v.nameOfLesson + '<br/>' + v.teacher + '<br/>' + v.room)
              .join('<br/>');
    });
  });

  return (
    <Table
      size='small'
      scroll={{ x: true }}
      pagination={false}
      sticky
      title={() => <h3 style={{ margin: 0 }}>{title}</h3>}
      columns={columns}
      dataSource={dataSource}
      bordered
      className='timetable'
      {...props}
    />
  );
}
