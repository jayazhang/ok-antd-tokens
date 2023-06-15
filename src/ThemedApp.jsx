import {Button, ConfigProvider} from 'antd';
import React, {useState} from 'react';
import App from './App';

import light from './tokens/light.json';
import dark from './tokens/dark.json';

const ThemedApp = () => {

  const [token, setToken] = useState(light);

  return (
    <ConfigProvider theme={{token}}>
      <Button onClick={() => token === light ? setToken(dark) : setToken(light)}
              style={{margin: 20}}>
        Change theme
      </Button>
      <App/>
    </ConfigProvider>
  );
};

export default ThemedApp;