import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Card,
  Table,
  PaginationProps,
  Message,
  Tooltip,
  Button,
  Space,
  Tag,
  Modal,
  Switch,
} from '@arco-design/web-react';
import {
  IconPlus,
  IconDownload,
  IconUpload,
} from '@arco-design/web-react/icon';
import type { TableProps } from '@arco-design/web-react';
import { getEpisodesList, getDatasets } from '@/api/dataset';
import dayjs from 'dayjs';
import type { TableInstance } from '@arco-design/web-react/es/Table/table';
import SearchForm from './form';
import { useHistory } from 'react-router-dom';
import UpLoadFile from './components/UpLoadFile';
import VideoGrid from './components/VideoGrid';
import styles from './style/index.module.less';

function DataManagement() {
  const history = useHistory();
  const actionRef = useRef<TableInstance | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { Text } = Typography;
  const [data, setData] = useState<API.Episode[]>([]);
  const [searchParams, setSearchParams] = useState<API.SearchFormData>({});
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [datasets, setDatasets] = useState<{ [key: string]: string }>({}); // 存储数据集ID到名称的映射
  const [isTableView, setIsTableView] = useState<boolean>();
  const [gridPageSize, setGridPageSize] = useState<number>(10);
  const [gridTotal, setGridTotal] = useState<number>(0);
  const [gridCurrentPage, setGridCurrentPage] = useState<number>(1);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [columns] = useState<TableProps['columns']>([
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      align: 'center',
      width: 100,
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '数据集',
      dataIndex: 'dataset_id',
      align: 'center',
      valueType: 'select',
      width: 200,
      render: (value) => {
        return datasets[value] || value || '-';
      },
    },
    {
      title: '任务描述',
      width: 200,
      ellipsis: true,
      dataIndex: 'instructions',
      align: 'center',
      render: (_, record) => {
        if (!record?.instructions) return '-';
        const steps = record.instructions?.steps;
        if (!steps || !Array.isArray(steps)) return '-';
        // 构建可换行的内容（用于Tooltip）
        const fullContent = (
          <div>
            {steps.map((step, index) => (
              <div key={index}>
                {index + 1}. {step}
              </div>
            ))}
          </div>
        );
        // 表格中显示的内容（省略效果）
        const displayText = steps
          .map((step, index) => `${index + 1}. ${step}`)
          .join(' ');
        return (
          <Tooltip content={fullContent} position="top">
            <div
              style={{
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {displayText}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: '机器人类型',
      dataIndex: 'robot_model',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: {
        'Franka Emika Panda': 'Franka Emika Panda',
        TurtleBot3: 'TurtleBot3',
        'Pepper Robot': 'Pepper Robot',
        'ABB IRB 1200': 'ABB IRB 1200',
        FarmBot: 'FarmBot',
        'Custom Agricultural Gripper': 'Custom Agricultural Gripper',
        r1lite: 'r1lite',
        'FastUMI Pro hardware suite': 'FastUMI Pro hardware suite',
      },
    },
    {
      title: '夹爪类型',
      dataIndex: 'gripper',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: {
        'Parallel Gripper': 'Parallel Gripper',
        'Serial Gripper': 'Serial Gripper',
      },
    },
    {
      title: '是否成功',
      width: 100,
      dataIndex: 'is_success',
      align: 'center',
      render: (_, isSuccess: boolean) => {
        return (
          <Tag color={isSuccess ? 'green' : 'red'}>
            {isSuccess ? 'Success' : 'Failed'}
          </Tag>
        );
      },
      valueType: 'select',
      valueEnum: {
        true: '成功',
        false: '失败',
      },
    },
    {
      title: '采集频率',
      width: 100,
      dataIndex: 'control_frequency',
      align: 'center',
      render: (_, record) => {
        return `${record?.control_frequency || 0} Hz`;
      },
    },
    {
      title: '最小帧数',
      dataIndex: 'start_total_frames',
      align: 'center',
      hideInTable: true,
    },
    {
      title: '最大帧数',
      dataIndex: 'end_total_frames',
      align: 'center',
      hideInTable: true,
    },
    {
      title: '总帧数',
      dataIndex: 'total_frames',
      align: 'center',
      hideInSearch: true,
      // width: 100,
    },
    {
      title: '创建时间',
      width: 100,
      dataIndex: 'created_at',
      align: 'center',
      render: (_, record) =>
        dayjs(record.created_at).format('YYYY-MM-DD HH:mm:ss'),
      search: {
        transform: (value) => {
          return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '';
        },
      },
      valueType: 'dateTime',
    },
    {
      title: '更新时间',
      width: 100,
      dataIndex: 'updated_at',
      align: 'center',
      render: (_, record) =>
        dayjs(record.updated_at).format('YYYY-MM-DD HH:mm:ss'),
      search: {
        transform: (value) => {
          return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '';
        },
      },
      valueType: 'dateTime',
    },
    {
      title: '采集视频',
      dataIndex: 'video_file_url',
      width: 180,
      align: 'center',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <div>
            <video
              src={record.video_file_url}
              controls
              style={{ width: '200px', height: '150px' }}
            />
          </div>
        );
      },
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 120,
      hideInSearch: true,
      render: (_, record) => {
        return (
          <div>
            <Button
              type="text"
              size="small"
              style={{ marginLeft: 8 }}
              disabled={!record.foxglove_url}
              onClick={() => {
                window.open(record.foxglove_url, '_blank');
              }}
            >
              跳转foxglove
            </Button>
          </div>
        );
      },
    },
  ]);
  const fetchData = async (
    page = 1,
    pageSize = 10,
    params: API.SearchFormData = {}
  ) => {
    setLoading(true);
    try {
      const res = await getEpisodesList({
        page,
        limit: pageSize,
        ...params,
      });
      if (res.status === 200) {
        const list = res.data.data.list || [];
        console.log(list);
        setData(list);
        setEpisodes(list);
        setPagination({
          current: page,
          pageSize,
          total: res.data.data.total || 0,
        });
      }
    } catch (error) {
      Message.error('获取数据集列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取数据集列表，用于显示数据集名称
  useEffect(() => {
    const fetchDatasetsList = async () => {
      try {
        const res = await getDatasets({ page: 1, limit: 100 });
        if (res.status === 200) {
          const list = res.data?.data?.list || [];
          const datasetMap: { [key: string]: string } = {};
          list.forEach((d: any) => {
            datasetMap[d.id] = `${d.dataset_name} ${d.dataset_version}`;
          });
          setDatasets(datasetMap);
        }
      } catch (error) {
        console.error('获取数据集列表失败:', error);
      }
    };

    fetchDatasetsList();
  }, []);

  useEffect(() => {
    fetchData(1, pagination.pageSize, searchParams);
  }, [searchParams]);

  const onChangeTable = (pagination: PaginationProps) => {
    const { current, pageSize } = pagination;
    fetchData(current as number, pageSize as number, searchParams);
  };

  const handleSearch = (params: API.SearchFormData) => {
    setSearchParams(params);
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  const handleReset = () => {
    setSearchParams({});
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  const handleReload = () => {
    fetchData(pagination.current, pagination.pageSize, searchParams);
  };
  // 上传文件
  const handleUploadFile = () => {
    setIsUploadModalOpen(true);
  };
  const handleCancel = () => {
    setIsUploadModalOpen(false);
  };

  const handleOk = () => {
    setIsUploadModalOpen(false);
    // 重新加载数据
    fetchData(pagination.current, pagination.pageSize, searchParams);
  };
  return (
    <Card style={{ height: '100%' }}>
      <Typography.Title heading={6}>数据管理</Typography.Title>
      <SearchForm onSearch={handleSearch} onReset={handleReset} />
      <div style={{ textAlign: 'right', marginBottom: 12 }}>
        <Space>
          <Button
            type="primary"
            onClick={handleUploadFile}
            icon={<IconUpload />}
          >
            上传文件
          </Button>
          <Switch
            checkedText="表格模式"
            uncheckedText="格子模式"
            size="default"
            style={{ height: 25, lineHeight: '25px', textAlign: 'center' }}
            className={styles['switch-mode']}
            checked={isTableView}
            onChange={(checked) => {
              // 请求数据集列表
              fetchData(1, pagination.pageSize, searchParams);
              setIsTableView(checked);
            }}
          />
        </Space>
      </div>
      {/* 默认表格模式，通过切换开关可以切换到格子模式 */}
      {isTableView ? (
        <Table
          rowKey={(record) => record.id || Math.random().toString()}
          loading={loading}
          onChange={onChangeTable}
          pagination={pagination}
          columns={columns}
          data={data}
        />
      ) : (
        <VideoGrid episodes={episodes} />
      )}
      <Modal
        visible={isUploadModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        unmountOnExit={true}
      >
        <UpLoadFile
          reload={handleReload}
          onCancel={handleCancel}
          onFinish={handleOk}
        />
      </Modal>
    </Card>
  );
}

export default DataManagement;
