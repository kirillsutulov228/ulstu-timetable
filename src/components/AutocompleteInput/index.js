import { useState } from 'react';
import { AutoComplete, Input } from 'antd';

export default function AutocompleteInput({ onSelect, onSearch, placeholder, notFoundContent, enterButton, style, maxOptions = 5 }) {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState('');

  function selectHandler(value) {
    setValue(value);
    onSelect(value);
  }

  function searchHandler(value) {
    setValue(value);
    onSearch(value, setOptions);
  }

  return (
    <AutoComplete
      style={style}
      options={options.slice(0, maxOptions)}
      onSelect={selectHandler}
      onSearch={searchHandler}
      notFoundContent={value && notFoundContent}
    >
      <Input.Search placeholder={placeholder} enterButton={enterButton} />
    </AutoComplete>
  );
}
