import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  InputNumber,
  Grid,
} from '@arco-design/web-react';
import styles from './style/index.module.less';
import { IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import { getDatasets } from '@/api/dataset';
interface SearchFormProps {
  onSearch: (values: any) => void;
  onReset: () => void;
}
const { Row, Col } = Grid;
const { RangePicker } = DatePicker;
const { useForm } = Form;
const colSpan = 8;

function SearchForm(props: SearchFormProps) {
  const [form] = useForm();
  const { Option } = Select;
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取数据集列表
  useEffect(() => {
    const fetchDatasets = async () => {
      setLoading(true);
      try {
        const res = await getDatasets({ page: 1, limit: 100 });
        if (res.status === 200) {
          const list = res.data?.data?.list || [];
          setDatasets(
            list.map((d: any) => ({
              label: `${d.dataset_name} ${d.dataset_version}`,
              value: d.id,
            }))
          );
        }
      } catch (error) {
        console.error('获取数据集列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, []);

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    props.onSearch(values);
  };
  const handleReset = () => {
    form.resetFields();
    props.onReset();
  };
  //   数据集接口getDatasets

  return (
    <div className={styles['search-form-wrapper']}>
      <Form
        form={form}
        className={styles['search-form']}
        labelAlign="left"
        labelCol={{ span: 4 }} //控制标签宽度
        wrapperCol={{ span: 19 }}
      >
        <Row gutter={24}>
          <Col span={colSpan}>
            <Form.Item field="id" label="ID">
              <Input
                placeholder="请输入ID"
                allowClear
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="dataset_id" label="数据集">
              <Select
                placeholder="请选择数据集"
                allowClear
                style={{ width: '100%' }}
                loading={loading}
                showSearch
                filterOption={(inputValue, option) => {
                  return option.props.children
                    .toLowerCase()
                    .includes(inputValue.toLowerCase());
                }}
              >
                {datasets.map((dataset) => (
                  <Option key={dataset.value} value={dataset.value}>
                    {dataset.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="instructions" label="任务描述">
              <Input
                placeholder="请输入任务描述"
                allowClear
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="robot_model" label="机器人类型">
              <Select
                placeholder="请选择机器人类型"
                allowClear
                style={{ width: '100%' }}
              >
                <Option value="Franka Emika Panda">Franka Emika Panda</Option>
                <Option value="TurtleBot3">TurtleBot3</Option>
                <Option value="Pepper Robot">Pepper Robot</Option>
                <Option value="ABB IRB 1200">ABB IRB 1200</Option>
                <Option value="FarmBot">FarmBot</Option>
                <Option value="Custom Agricultural Gripper">
                  Custom Agricultural Gripper
                </Option>
                <Option value="r1lite">r1lite</Option>
                <Option value="FastUMI Pro hardware suite">
                  FastUMI Pro hardware suite
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="gripper" label="夹爪类型">
              <Select
                placeholder="请选择夹爪类型"
                allowClear
                style={{ width: '100%' }}
              >
                <Option value="Parallel Gripper">Parallel Gripper</Option>
                <Option value="Serial Gripper">Serial Gripper</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="is_success" label="是否成功">
              <Select
                placeholder="请选择是否成功"
                allowClear
                style={{ width: '100%' }}
              >
                <Option value={1}>成功</Option>
                <Option value={0}>失败</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="control_frequency" label="采集频率">
              <InputNumber
                placeholder="请输入采集频率"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="start_total_frames" label="最小帧数">
              <InputNumber
                placeholder="请输入最小帧数"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="end_total_frames" label="最大帧数">
              <InputNumber
                placeholder="请输入最大帧数"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="total_frames" label="总帧数">
              <InputNumber
                placeholder="请输入总帧数"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="created_at" label="创建时间">
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
                placeholder={['开始时间', '结束时间']}
                onChange={(dates) => {
                  if (dates && dates[0]) {
                    form.setFieldValue('created_at_start', dates[0]);
                  } else {
                    form.setFieldValue('created_at_start', undefined);
                  }
                  if (dates && dates[1]) {
                    form.setFieldValue('created_at_end', dates[1]);
                  } else {
                    form.setFieldValue('created_at_end', undefined);
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="updated_at" label="更新时间">
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
                placeholder={['开始时间', '结束时间']}
                onChange={(dates) => {
                  if (dates && dates[0]) {
                    form.setFieldValue('updated_at_start', dates[0]);
                  } else {
                    form.setFieldValue('updated_at_start', undefined);
                  }
                  if (dates && dates[1]) {
                    form.setFieldValue('updated_at_end', dates[1]);
                  } else {
                    form.setFieldValue('updated_at_end', undefined);
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles['right-button']}>
        <Button type="primary" icon={<IconSearch />} onClick={handleSubmit}>
          搜索
        </Button>
        <Button icon={<IconRefresh />} onClick={handleReset}>
          重置
        </Button>
      </div>
    </div>
  );
}

export default SearchForm;
