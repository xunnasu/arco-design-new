import React, { useEffect, useContext } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Space,
  Grid,
} from '@arco-design/web-react';
import { IconSearch, IconRefresh } from '@arco-design/web-react/icon';
import { FormInstance } from '@arco-design/web-react/es/Form';
import dayjs from 'dayjs';
const { Row, Col } = Grid;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface DataSetFormProps {
  onSearch: (params: API.SearchFormData) => void;
  onReset: () => void;
  initialValues?: API.SearchFormData;
}

const robotModelOptions = [
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

const gripperOptions = [
  { label: 'Parallel Gripper', value: 'Parallel Gripper' },
  { label: 'Serial Gripper', value: 'Serial Gripper' },
];

export default function DataSetForm({
  onSearch,
  onReset,
  initialValues,
}: DataSetFormProps) {
  const [form] = Form.useForm<API.SearchFormData>();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleSearch = () => {
    const values = form.getFieldsValue();

    const params: API.SearchFormData = {
      dataset_name: values.dataset_name,
      dataset_version: values.dataset_version,
      dataset_format: values.dataset_format,
      description: values.description,
      robot_model: values.robot_model,
      robot_morphology: values.robot_morphology,
      gripper: values.gripper,
      rgb_cams: values.rgb_cams,
      depth_cams: values.depth_cams,
      wrist_cams: values.wrist_cams,
      control_frequency: values.control_frequency,
      created_at_start: values.created_at_start
        ? dayjs(values.created_at_start).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      created_at_end: values.created_at_end
        ? dayjs(values.created_at_end).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      updated_at_start: values.updated_at_start
        ? dayjs(values.updated_at_start).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      updated_at_end: values.updated_at_end
        ? dayjs(values.updated_at_end).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
    };

    onSearch(params);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Form form={form} layout="inline" labelAlign="right">
      <Row gutter={18} style={{ width: '100%' }} justify="space-between">
        <Col span={6}>
          <Form.Item field="dataset_name" label="数据集名称">
            <Input placeholder="请输入数据集名称" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item field="dataset_version" label="数据集版本">
            <Input placeholder="请输入数据集版本" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item field="dataset_format" label="数据集格式">
            <Input placeholder="请输入数据集格式" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item field="description" label="描述">
            <Input placeholder="请输入描述" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item field="robot_model" label="机器人类型">
            <Select placeholder="请选择机器人类型" allowClear>
              {robotModelOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item field="robot_morphology" label="机器人形态">
            <Input placeholder="请输入机器人形态" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item field="gripper" label="夹爪类型">
            <Select placeholder="请选择夹爪类型" allowClear>
              {gripperOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item field="rgb_cams" label="图像相机数">
            <InputNumber
              placeholder="请输入图像相机数"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item field="depth_cams" label="深度相机数">
            <InputNumber
              placeholder="请输入深度相机数"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item field="wrist_cams" label="手腕相机数">
            <InputNumber
              placeholder="请输入手腕相机数"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item field="control_frequency" label="采样频率">
            <InputNumber
              placeholder="请输入采样频率"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item field="created_at" label="创建时间">
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: '100%' }}
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
        <Col span={6}>
          <Form.Item field="updated_at" label="更新时间">
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: '100%' }}
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
        <Col span={3}>
          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button
                type="primary"
                icon={<IconSearch />}
                onClick={handleSearch}
              >
                搜索
              </Button>
              <Button icon={<IconRefresh />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
