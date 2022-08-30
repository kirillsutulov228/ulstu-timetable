import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export default function Loader({ style, size = 36 }) {
  return (
    <div style={{width: 'fit-content', ...style}}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: size }} spin />} />
    </div>
  );
}
