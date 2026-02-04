import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Spin, Descriptions, Card } from '@arco-design/web-react';
import { getDatasetDetail } from '@/api/dataset';

const DataSetDetail: React.FC = () => {
  const { dataset_id } = useParams<{ dataset_id?: string }>();
  const [loading, setLoading] = useState(false);
  const [dataset, setDataset] = useState<any>(null);
  const data = [
    {
      label: 'ID:',
      value: dataset?.id,
    },
    {
      label: '名称:',
      value: dataset?.dataset_name,
    },
    {
      label: '版本:',
      value: dataset?.dataset_version,
    },
    {
      label: '格式:',
      value: dataset?.dataset_format,
    },
    {
      label: '机器人类型:',
      value: dataset?.robot_model,
    },
    {
      label: '图像相机数:',
      value: dataset?.rgb_cams,
    },
    {
      label: '深度相机数:',
      value: dataset?.depth_cams,
    },
    {
      label: '手腕相机数:',
      value: dataset?.wrist_cams,
    },
    {
      label: '采样频率:',
      value: dataset?.control_frequency,
    },
    {
      label: '坐标系定义:',
      value: dataset?.coordinate_system,
    },
    {
      label: '文件存储路径:',
      value: 'file_path',
    },
    {
      label: 'episodes数:',
      value: dataset?.total_episodes,
    },
    {
      label: '创建时间:',
      value: dataset?.created_at,
    },
    {
      label: '更新时间:',
      value: dataset?.updated_at,
    },
    {
      label: '描述:',
      value: dataset?.description,
      span: 2,
    },
  ];
  useEffect(() => {
    if (!dataset_id) return;
    setLoading(true);
    getDatasetDetail(dataset_id)
      .then((res: any) => {
        console.log(res);
        if (res.status === 200) {
          setDataset(res.data.data);
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
  const getValue = (value: any, defaultValue = '--') => {
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
