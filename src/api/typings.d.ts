declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  // 数据集相关类型定义
  type Dataset = {
    dataset_id: string;
    id?: string;
    dataset_name: string;
    dataset_version: string;
    dataset_format: string; // 数据集存储格式
    description?: string;
    robot_model?: string; // 机器人类型
    robot_morphology?: string; // 机器人形态
    gripper?: string; // 夹爪类型
    rgb_cams?: number; // 图像相机数
    depth_cams?: number; // 深度相机数
    wrist_cams?: number; // 手腕相机数
    control_frequency?: number; // 采样频率
    calibration_data?: any; // 相机内参
    coordinate_system?: string; // 坐标系定义
    file_path?: string; // 文件存储路径
    created_at?: string;
    updated_at?: string;
    total_episodes?: number;
    total_frames?: number;
    status?: string;
    page?: number;
    limit?: number;
  };
  type SearchFormData = {
    dataset_name?: string;
    dataset_version?: string;
    dataset_format?: string;
    description?: string;
    robot_model?: string;
    robot_morphology?: string;
    gripper?: string;
    rgb_cams?: number;
    depth_cams?: number;
    wrist_cams?: number;
    control_frequency?: number;
    created_at_start?: string;
    created_at_end?: string;
    updated_at_start?: string;
    updated_at_end?: string;
  };

  type Episode = {
    episode_id: string;
    dataset_id: string;
    episode_name?: string;
    instructions?: {
      task_name: string;
      steps: string;
    };
    scene_type?: string;
    object_type?: string;
    task_type?: string;
    frame_count?: number;
    duration?: number;
    created_at?: string;
    updated_at?: string;
    video_file_url?: string;
    video_path: string;
    is_success: boolean;
    robot_model?: string; // 机器人类型
    robot_morphology?: string; // 机器人形态
    gripper?: string; // 夹爪类型
  };
  type VideoGridProps = {
    episodes: Episode[];
  };

  type DatasetCreateParams = {
    dataset_name: string; // 数据集名称
    dataset_version: string; // 数据集版本
    dataset_format: string; // 数据集存储格式
    description?: string; // 描述
    robot_model?: string; // 机器人类型
    robot_morphology?: string; // 机器人形态
    gripper?: string; // 夹爪类型
    rgb_cams?: number; // 图像相机数
    depth_cams?: number; // 深度相机数
    wrist_cams?: number; // 手腕相机数
    control_frequency?: number; // 采样频率
    calibration_data?: any; // 相机内参
    coordinate_system?: string; // 坐标系定义
    file_path?: string; // 文件存储路径
  };

  type DatasetUpdateParams = {
    dataset_name?: string; // 数据集名称
    dataset_version?: string; // 数据集版本
    dataset_format?: string; // 数据集存储格式
    description?: string; // 描述
    robot_model?: string; // 机器人类型
    robot_morphology?: string; // 机器人形态
    gripper?: string; // 夹爪类型
    rgb_cams?: number; // 图像相机数
    depth_cams?: number; // 深度相机数
    wrist_cams?: number; // 手腕相机数
    control_frequency?: number; // 采样频率
    calibration_data?: any; // 相机内参
    coordinate_system?: string; // 坐标系定义
    file_path?: string; // 文件存储路径
    status?: string; // 状态
  };

  type DatasetStats = {
    total_datasets: number;
    total_episodes: number;
    total_frames: number;
    active_datasets: number;
    dataset_type_distribution: {
      type: string;
      count: number;
    }[];
  };
  // 上传文件
  type FileUploadParams = {
    category: string; // 类型。dataset
    file_name: string; // 文件名
    file_size: number; // 文件大小
    mime_type: string; // mime
  };
  // 上传数据集数据
  type DatasetUploadParams = {
    file_ids?: string[]; // 上传的文件id列表（多文件上传）
    file_id?: string; // 上传的文件id（单文件上传，向前兼容）
    dataset_id: string; // 数据集ID（从数据集列表筛选）
    description?: string; // 任务描述
  };
}
