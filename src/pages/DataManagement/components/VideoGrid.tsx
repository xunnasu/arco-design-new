import React from 'react';
import styles from '../style/index.module.less';
const VideoGrid: React.FC<API.VideoGridProps> = ({ episodes }) => {
  console.log(episodes, '0000--000');
  return (
    <>
      <div className={styles['video-grid']}>
        {episodes.map((item) => (
          <div
            key={item.episode_id || Math.random().toString()}
            className={styles['video-grid-item']}
          >
            <video
              src={item.video_file_url}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                display: 'block',
              }}
              muted
              autoPlay
              loop
              playsInline
            />
            <div
              className={styles['video-grid-mask']}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0';
              }}
            >
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                {item.instructions?.task_name || 'Task description'}
              </h4>
              <p style={{ margin: '0', fontSize: '12px', opacity: 0.8 }}>
                {item.instructions?.steps?.[0] || 'No Description'}
              </p>
              <div style={{ marginTop: '8px', fontSize: '11px', opacity: 0.7 }}>
                {item.robot_model} {item.gripper ? `/ ${item.gripper}` : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default VideoGrid;
