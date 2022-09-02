import './index.css';
import Table from 'antd/lib/table/Table.js';
import { useState, useEffect } from 'react';
import { lessonsTimes, dateBetween, formatTime } from '../../utils.js';

const _initialColumns = [
  {
    title: '',
    dataIndex: 'day',
    key: 'day'
  }
];

lessonsTimes.forEach((v, i) =>
  _initialColumns.push({
    title: `${i + 1}-я пара \n ${formatTime(v[0], v[1])}-${formatTime(v[2], v[3])}`,
    dataIndex: `lesson${i}`,
    key: `lesson${i}`
  })
);

export default function Timetable({ schedule, title, showBg, ...props }) {
  const [columns, setColumns] = useState(_initialColumns);

  const _dataSource = [
    { day: 'Понедельник' },
    { day: 'Вторник' },
    { day: 'Среда' },
    { day: 'Четверг' },
    { day: 'Пятница' },
    { day: 'Суббота' }
  ];

  schedule.forEach((day, dayIndex) => {
    day.lessons.forEach((lesson, lessonIndex) => {
      _dataSource[dayIndex]['lesson' + lessonIndex] =
        lesson.length === 0
          ? '-'
          : lesson.map((v) => v.group + '\n' + v.nameOfLesson + '\n' + v.teacher + '\n' + v.room).join('\n');
    });
  });

  useEffect(() => {
    function updateBg() {
      const newColumns = JSON.parse(JSON.stringify(_initialColumns));
      newColumns.forEach((col, colIndex) => {
        const date = new Date();
        const timeOffset = -240;
        date.setTime(date.getTime() + (date.getTimezoneOffset() - timeOffset) * 60000);
        col.onCell = (_, rowIndex) => {
          if (!showBg) return;
          let isCurrentDay = rowIndex === date.getDay() - 1;
          let isCurrentLesson =
            isCurrentDay &&
            colIndex &&
            dateBetween(
              date,
              lessonsTimes[colIndex - 1][0],
              lessonsTimes[colIndex - 1][1],
              lessonsTimes[colIndex - 1][2],
              lessonsTimes[colIndex - 1][3]
            );
          return {
            className: isCurrentLesson ? 'current' : isCurrentDay ? 'today' : undefined
          };
        };
        col.render = (text) => (
          <div
            style={{
              whiteSpace: 'pre-line',
              minWidth: '78px',
              maxWidth: '120px',
              fontWeight: colIndex === 0 ? '500' : '400'
            }}
          >
            {text}
          </div>
        );
      });
      setColumns(newColumns);
    }
    updateBg();
    const interval = setInterval(updateBg, 60000);
    return () => clearInterval(interval);
  }, [showBg]);

  return (
    <Table
      size='small'
      scroll={{ x: true }}
      pagination={false}
      sticky
      title={() => <h3 style={{ margin: 0, whiteSpace: 'nowrap' }}>{title}</h3>}
      columns={columns}
      dataSource={_dataSource}
      bordered
      rowKey={'day'}
      className='timetable'
      {...props}
    />
  );
}
