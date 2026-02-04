import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Spin, Descriptions, Card } from '@arco-design/web-react';
import { getDatasetDetail } from '@/api/dataset';
import { data } from '../constants';

const DataSetDetail: React.FC = () => {
  const { dataset_id } = useParams<{ dataset_id?: string }>();
  const [loading, setLoading] = useState(false);
  const [dataset, setDataset] = useState<any>(null);

  useEffect(() => {
    if (!dataset_id) return;
    setLoading(true);
    getDatasetDetail(dataset_id)
      .then((res: any) => {
        if (res?.data) {
          setDataset(res.data);
        }
      })
      .catch((error: any) => {
        console.error('获取详情失败:', error);
      })
      .finally(() => setLoading(false));
  }, [dataset_id]);
  if (loading)
    return (
      <Typography>
        <Spin />
      </Typography>
    );

  // 统一处理默认值的函数
  const getValue = (value: any, defaultValue: string = '--') => {
    return value || defaultValue;
  };
  return (
    <Typography>
      <Card>
        <Descriptions
          title="数据集详情"
          column={2}
          data={getValue(data)}
        ></Descriptions>
      </Card>
    </Typography>
  );
};
export default DataSetDetail;
