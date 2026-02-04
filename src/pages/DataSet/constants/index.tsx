export const robotModelOptions = [
  { label: 'Franka Emika Panda', value: 'Franka Emika Panda' },
  { label: 'TurtleBot3', value: 'TurtleBot3' },
  { label: 'Pepper Robot', value: 'Pepper Robot' },
  { label: 'ABB IRB 1200', value: 'ABB IRB 1200' },
  { label: 'FarmBot', value: 'FarmBot' },
  {
    label: 'Custom Agricultural Gripper',
    value: 'Custom Agricultural Gripper',
  },
  { label: 'r1lite', value: 'r1lite' },
  { label: 'FastUMI Pro hardware suite', value: 'FastUMI Pro hardware suite' },
];
export const gripperOptions = [
  { label: 'Parallel Gripper', value: 'Parallel Gripper' },
  { label: 'Serial Gripper', value: 'Serial Gripper' },
];

export const data = [
  {
    label: 'ID',
    value: 'id',
    fallbackValue: 'dataset_id',
  },
  {
    label: '名称',
    value: 'dataset_name',
  },
  {
    label: '版本',
    value: 'dataset_version',
  },
  {
    label: '格式',
    value: 'dataset_format',
  },
  {
    label: '机器人类型',
    value: 'robot_model',
  },
  {
    label: '图像相机数',
    value: 'rgb_cams',
  },
  {
    label: '深度相机数',
    value: 'depth_cams',
  },
  {
    label: '手腕相机数',
    value: 'wrist_cams',
  },
  {
    label: '采样频率',
    value: 'control_frequency',
  },
  {
    label: '坐标系定义',
    value: 'coordinate_system',
  },
  {
    label: '文件存储路径',
    value: 'file_path',
  },
  {
    label: 'episodes数',
    value: 'total_episodes',
  },
  {
    label: '创建时间',
    value: 'created_at',
  },
  {
    label: '更新时间',
    value: 'updated_at',
  },
  {
    label: '描述',
    value: 'description',
    span: 2,
  },
];
