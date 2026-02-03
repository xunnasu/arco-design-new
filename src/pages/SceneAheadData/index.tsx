import React from 'react';
import { Typography, Card } from '@arco-design/web-react';
import SelfDeveloped from './self-developed';
function SceneAheadData() {
  return (
    <Card style={{ height: '80vh' }}>
      <Typography.Title heading={6}>
        <SelfDeveloped></SelfDeveloped>
      </Typography.Title>
    </Card>
  );
}

export default SceneAheadData;
