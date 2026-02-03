import React from 'react';
import bg from '@/assets/bg2.png';
import { Typography, Card } from '@arco-design/web-react';

function Welcome() {
  return (
    <Typography>
      <Card
        style={{
          borderRadius: 8,
          minHeight: '250px',
        }}
      >
        <div
          style={{
            backgroundPosition: 'right',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundImage: `url(${bg})`,
            height: '100%', // 容器高度撑满
            minHeight: '450px', // 设置最小高度
            paddingRight: '300px', // 为图片预留空间
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              fontSize: '25px',
            }}
          >
            <strong>欢迎来到数据平台！</strong>
          </div>
          <p
            style={{
              fontSize: '16px',
              lineHeight: '35px',
              marginTop: 16,
              marginBottom: 32,
              width: '66%',
            }}
          >
            这是一款专为机器人研发打造的专业数据平台，核心是整合优质开源机器人数据集、提供便捷的数据管理与调用服务，能够更高效地开展算法训练、任务验证与场景复现工作，大幅加速机器人具身智能技术的研发进程，为机器人操作学习、算法训练与验证提供高质量的数据支撑。
          </p>
        </div>
      </Card>
    </Typography>
  );
}
export default Welcome;
