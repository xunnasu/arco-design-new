import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Table,
  PaginationProps,
} from '@arco-design/web-react';
import type { TableProps } from '@arco-design/web-react';

interface DatasetItem {
  dataset_id: string;
  dataset_name: string;
  dataset_version: string;
  dataset_format: string;
}

type TableColumnType = TableProps['columns'];
// import { DatasetItem } from '@/api/dataset';
function DataSet() {
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [data, setData] = useState<DatasetItem[]>([]);
  const [columns] = useState([
    {
      title: '数据集ID',
      dataIndex: 'dataset_id',
      key: 'dataset_id',
    },
    {
      title: '数据集名称',
      dataIndex: 'dataset_name',
      key: 'dataset_name',
    },
    {
      title: '数据集版本',
      dataIndex: 'dataset_version',
      key: 'dataset_version',
    },
    {
      title: '数据集格式',
      dataIndex: 'dataset_format',
      key: 'dataset_format',
    },
  ]);
  const onChangeTable = (pagination: PaginationProps) => {
    console.log(pagination);
  };

  return (
    <Card style={{ height: '80vh' }}>
      <Typography.Title heading={6}>数据集列表</Typography.Title>
      <Table
        rowKey="dataset_id"
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
      />
    </Card>
  );
}

export default DataSet;
