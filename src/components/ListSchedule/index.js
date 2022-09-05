import { List } from 'antd';
import { lessonsTimes, formatTime, dateBetween } from './../../utils';
import { useState, useEffect } from 'react';

const dayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

function DayScheduleItem({ showBg, date, daySchedule, dayIndex }) {
  const timeOffset = -240;
  const isEmpty = daySchedule.flat().length === 0;
  const isCurrentDay = date.getDay() === dayIndex + 1;
  date.setTime(date.getTime() + (date.getTimezoneOffset() - timeOffset) * 60000); 
  
  return (
    <List
      style={{ margin: '15px 5px', background: showBg && isCurrentDay ? 'rgb(245, 245, 245)' : null }}
      dataSource={daySchedule}
      header={<h3 style={{ position: 'sticky', margin: '5px 0' }}>{dayNames[dayIndex]}</h3>}
      bordered
      renderItem={(lesson, i) => {
        return lesson.length ? (
          <List.Item
            style={{
              background:
                showBg &&
                isCurrentDay &&
                dateBetween(
                  date,
                  lessonsTimes[i][0],
                  lessonsTimes[i][1],
                  lessonsTimes[i][2],
                  lessonsTimes[i][3] 
                ) ? 'rgb(224, 224, 224)' : null
            }}
          >
            <div style={{ whiteSpace: 'pre-line', marginLeft: '5px' }}>
              <h4>
                {i + 1} пара {'\n'} {formatTime(lessonsTimes[i][0], lessonsTimes[i][1])}-
                {formatTime(lessonsTimes[i][2], lessonsTimes[i][3])}
              </h4>

              {lesson.map((v) => (
                <p style={{ whiteSpace: 'pre-line' }}>
                  {v.group + '\n' + v.nameOfLesson + '\n' + v.teacher + '\n' + v.room}
                </p>
              ))}
            </div>
          </List.Item>
        ) : null;
      }}
    >
      {isEmpty && <List.Item style={{ marginLeft: '5px' }}>Нет занятий</List.Item>}
    </List>
  );
}

export default function ListSchedule({ showBg, schedule, title, style }) {
  const dataSource = schedule.map((v) => v.lessons);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  });

  return (
    <List
      bordered={true}
      dataSource={dataSource}
      style={style}
      header={<h3 style={{ margin: 0 }}>{title}</h3>}
      renderItem={(item, i) => <DayScheduleItem date={date} showBg={showBg} daySchedule={item} dayIndex={i} />}
    ></List>
  );
}
