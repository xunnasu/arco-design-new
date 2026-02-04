import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Form,
  Button,
  Message,
  Input,
  InputNumber,
  Select,
} from '@arco-design/web-react';
import { getDatasetDetail, updateDataset, createDataset } from '@/api/dataset';
import { robotModelOptions, gripperOptions } from '../constants';
import type { FC } from 'react';
interface CreateFormProps {
  reload?: () => void;
  datasetId?: string | null;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  onCancel?: () => void;
  setEditingDatasetId?: (id: string | null) => void;
}
const CreateForm: FC<CreateFormProps> = (props) => {
  const {
    reload,
    datasetId,
    visible,
    onVisibleChange,
    onCancel,
    setEditingDatasetId,
  } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<any>({});
  const { TextArea } = Input;
  const { Option } = Select;

  const fetchDetail = async (id: string) => {
    setLoading(true);
    try {
      const res = await getDatasetDetail(id);
      if (res.status === 200) {
        const datasetData = res.data.data;
        if (
          datasetData.calibration_data &&
          typeof datasetData.calibration_data === 'object'
        ) {
          datasetData.calibration_data = JSON.stringify(
            datasetData.calibration_data,
            null,
            2
          );
        }
        setInitialValues(datasetData);
        form.setFieldsValue(datasetData);
      }
    } catch (error) {
      Message.error('获取数据集详情失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (datasetId && visible) {
      fetchDetail(datasetId);
    } else if (!datasetId) {
      setInitialValues({});
      form.resetFields();
    }
  }, [datasetId, visible]);

  const handleSubmit = async () => {
    try {
      const values = await form.validate();
      const processedValue = { ...values };
      if (processedValue.calibration_data) {
        try {
          processedValue.calibration_data = JSON.parse(
            processedValue.calibration_data
          );
        } catch (e) {
          Message.error(
            '相机内参格式错误，请输入有效的JSON格式。示例：{"camera_name": {"cx": 320, "cy": 240, "fx": 615, "fy": 615}}'
          );
          return;
        }
      }
      setLoading(true);
      if (datasetId) {
        await updateDataset(datasetId, processedValue);
        Message.success('数据集更新成功');
      } else {
        await createDataset(processedValue as API.DatasetCreateParams);
        Message.success('数据集创建成功');
      }
      reload?.();
      onCancel?.();
      setEditingDatasetId?.(null);
      setInitialValues({});
      form.resetFields();
    } catch (error) {
      Message.error('操作失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setInitialValues({});
    onCancel?.();
  };

  return (
    <>
      <Modal
        title={datasetId ? '编辑数据集' : '创建数据集'}
        visible={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          autoComplete="off"
        >
          <Form.Item field="dataset_name" label="数据集名称" required>
            <Input placeholder="请输入数据集名称" />
          </Form.Item>
          <Form.Item field="dataset_version" label="数据集版本" required>
            <Input placeholder="请输入数据集版本" />
          </Form.Item>
          <Form.Item field="dataset_format" label="数据集格式" required>
            <Input placeholder="请输入数据集格式" />
          </Form.Item>
          <Form.Item field="description" label="描述">
            <TextArea
              placeholder="请输入描述"
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>
          <Form.Item field="robot_model" label="机器人类型" required>
            <Select placeholder="请选择机器人类型">
              {robotModelOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item field="robot_morphology" label="机器人形态">
            <Input placeholder="请输入机器人形态" />
          </Form.Item>
          <Form.Item field="gripper" label="夹爪类型" required>
            <Select placeholder="请选择夹爪类型">
              {gripperOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item field="rgb_cams" label="图像相机数">
            <InputNumber
              placeholder="请输入图像相机数"
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item field="depth_cams" label="深度相机数">
            <InputNumber
              placeholder="请输入深度相机数"
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item field="wrist_cams" label="手腕相机数">
            <InputNumber
              placeholder="请输入手腕相机数"
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item field="control_frequency" label="采样频率">
            <InputNumber
              placeholder="请输入采样频率"
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item field="calibration_data" label="相机内参">
            <TextArea
              placeholder='请输入相机内参JSON格式，示例：{"camera_name": {"cx": 320, "cy": 240, "fx": 615, "fy": 615}}'
              autoSize={{ minRows: 5, maxRows: 10 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateForm;
