import React, { useContext } from 'react';
import dayjs from 'dayjs';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Grid,
  InputNumber,
} from '@arco-design/web-react';
import { IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import styles from './style/index.module.less';
import { robotModelOptions, gripperOptions } from './constants';
const { Row, Col } = Grid;
const { useForm } = Form;
const { RangePicker } = DatePicker;

function SearchForm(props: {
  onSearch: (values: Record<string, any>) => void;
  onReset: () => void;
}) {
  const [form] = useForm();
  const { Option } = Select;
  const handleSubmit = () => {
    const values = form.getFieldsValue();
    props.onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    props.onReset();
  };

  const colSpan = 8; //控制一排放几个

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
            <Form.Item field="dataset_name" label="数据集名称">
              <Input
                placeholder="请输入数据集名称"
                allowClear
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="dataset_version" label="数据集版本">
              <Input
                placeholder="请输入数据集版本"
                allowClear
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="dataset_format" label="数据集格式">
              <Input
                placeholder="请输入数据集格式"
                allowClear
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="description" label="描述">
              <Input
                placeholder="请输入描述"
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
                {robotModelOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="robot_morphology" label="机器人形态">
              <Input
                placeholder="请输入机器人形态"
                allowClear
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="gripper" label="夹爪类型">
              <Select
                placeholder="请选择夹爪类型"
                allowClear
                style={{ width: '100%' }}
              >
                {gripperOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="rgb_cams" label="图像相机数">
              <InputNumber
                placeholder="请输入图像相机数"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="depth_cams" label="深度相机数">
              <InputNumber
                placeholder="请输入深度相机数"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="wrist_cams" label="手腕相机数">
              <InputNumber
                placeholder="请输入手腕相机数"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item field="control_frequency" label="采样频率">
              <InputNumber
                placeholder="请输入采样频率"
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
