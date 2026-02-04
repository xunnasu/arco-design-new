import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Table,
  PaginationProps,
  Message,
  Tooltip,
  Button,
  Space,
} from '@arco-design/web-react';
import { IconPlus, IconDownload } from '@arco-design/web-react/icon';
import type { TableProps } from '@arco-design/web-react';
import { getDatasetList } from '@/api/dataset';
import dayjs from 'dayjs';
import SearchForm from './form';
import { useHistory } from 'react-router-dom';
import CreateForm from './components/add';

function DataSet() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { Text } = Typography;
  const [data, setData] = useState<API.Dataset[]>([]);
  const [searchParams, setSearchParams] = useState<API.SearchFormData>({});
  const [editingDatasetId, setEditingDatasetId] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
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
      title: '数据集名称',
      dataIndex: 'dataset_name',
      align: 'center',
      width: 100,
    },
    {
      title: '数据集版本',
      dataIndex: 'dataset_version',
      align: 'center',
      width: 100,
    },
    {
      title: '数据集格式',
      dataIndex: 'dataset_format',
      align: 'center',
      width: 100,
    },
    {
      title: '描述',
      dataIndex: 'description',
      align: 'center',
      width: 200,
    },
    {
      title: '机器人类型',
      dataIndex: 'robot_model',
      align: 'center',
      valueType: 'select',
      width: 100,
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
      title: '机器人形态',
      dataIndex: 'robot_morphology',
      align: 'center',
      width: 100,
    },
    {
      title: '夹爪类型',
      dataIndex: 'gripper',
      align: 'center',
      valueType: 'select',
      width: 100,
      valueEnum: {
        'Parallel Gripper': 'Parallel Gripper',
        'Serial Gripper': 'Serial Gripper',
      },
    },
    {
      title: '图像相机数',
      dataIndex: 'rgb_cams',
      align: 'center',
      width: 100,
    },
    {
      title: '深度相机数',
      dataIndex: 'depth_cams',
      align: 'center',
      width: 100,
    },
    {
      title: '手腕相机数',
      dataIndex: 'wrist_cams',
      align: 'center',
      width: 100,
    },
    {
      title: '采样频率',
      dataIndex: 'control_frequency',
      align: 'center',
      width: 100,

      render: (_, record) => {
        return `${record?.control_frequency || 0} Hz`;
      },
    },
    {
      title: 'episodes数',
      dataIndex: 'total_episodes',
      align: 'center',
      hideInSearch: true,
      width: 100,
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
              onClick={() => {
                setEditingDatasetId(record.id);
                setEditModalVisible(true);
              }}
            >
              编辑
            </Button>
            <Button
              size="small"
              type="text"
              onClick={() => {
                // 跳转详情
                history.push(`/DataSet/detail/${record.id}`);
              }}
            >
              详情
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
      const res = await getDatasetList({
        page,
        limit: pageSize,
        ...params,
      });
      if (res.status === 200) {
        const list = res.data.data.list || [];
        setData(list || []);
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

  return (
    <Card style={{ height: '100%' }}>
      <Typography.Title heading={6}>数据集列表</Typography.Title>
      <SearchForm onSearch={handleSearch} onReset={handleReset} />
      <div style={{ textAlign: 'right', marginBottom: 12 }}>
        <Space>
          <Button
            type="primary"
            icon={<IconPlus />}
            onClick={() => {
              setEditingDatasetId('');
              setEditModalVisible(true);
            }}
          >
            新建
          </Button>
        </Space>
      </div>
      <Table
        rowKey={(record) => record.id || Math.random().toString()}
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
      />
      <CreateForm
        key="form"
        datasetId={editingDatasetId}
        visible={editModalVisible}
        onVisibleChange={setEditModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingDatasetId(null);
        }}
        reload={handleReload}
      />
    </Card>
  );
}

export default DataSet;
