import Table from 'antd/lib/table/Table.js';
import { Fragment } from 'react';

const columns = [
  {
    title: 'Время',
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

columns.forEach(
  (col) =>
    (col.render = (text) => (
      <div style={{ minWidth: '80px', maxWidth: '200px' }}>
        {text.split('<br/>').map((v, i) => (
          <Fragment key={i}>
            {v}
            <br />
          </Fragment>
        ))}
      </div>
    ))
);

export default function Timetable({ schedule, title, ...props }) {
  const dataSource = [
    {
      time: '1-я пара<br/>08:30-09:50',
      key: 0
    },
    {
      time: '2-я пара<br/>10:00-11:20',
      key: 1
    },
    {
      time: '3-я пара<br/>11:30-12:50',
      key: 2
    },
    {
      time: '4-я пара<br/>13:30-14:50',
      key: 3
    },
    {
      time: '5-я пара<br/>15:00-16:20',
      key: 4
    },
    {
      time: '6-я пара<br/>16:30-17:50',
      key: 5
    },
    {
      time: '7-я пара<br/>18:00-19:20',
      key: 6
    },
    {
      time: '8-я пара<br/>19:30-20:50',
      key: 7
    }
  ];

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

  console.log({ schedule, dataSource });

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
      {...props}
    />
  );
}
