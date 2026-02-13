import {
  calculateFileMD5,
  uploadToSignedUrlWithProgress,
} from '@/utils/uploadFile';
import {
  Form,
  Select,
  Upload,
  Input,
  Button,
  Message,
  type UploadProps,
} from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { getFileMimeType } from '../config';
import {
  uploadFilePrepare,
  completeUploadFile,
  uploadDatasetData,
  getDatasetTasks,
} from '@/api/datamanagement';

interface UploadFileProps {
  reload?: () => void;
  onCancel?: () => void;
  onFinish?: () => void;
}

const UpLoadFile: FC<UploadFileProps> = (props) => {
  const { onCancel, onFinish } = props;
  const [messageApi, contextHolder] = Message.useMessage();
  const [fileIds, setFileIds] = useState<string[]>([]);
  const [formValues, setFormValues] = useState({
    dataset_name: '',
    description: 'fold blue clothes',
  });
  const [datasets, setDatasets] = useState<{ label: string; value: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const res = await getDatasetTasks({ page: 1, limit: 10 });
        const datasetList = res?.data?.data.list || [];
        setDatasets(
          datasetList.map((dataset: API.Dataset) => ({
            label:
              `${dataset.dataset_name} v${dataset.dataset_version}` ||
              'test_demo',
            value:
              dataset.id ||
              dataset.dataset_id ||
              '31ccf5f5-8fc8-44f6-af73-ee02ba3aa51f',
          }))
        );
      } catch (error) {
        messageApi.error('获取数据集列表失败');
      }
    };
    fetchDatasets();
  }, []);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    drag: true,
    showUploadList: true,
    accept: '.mcap,.bag,.splat,.png,.jpg,.jpeg,.zip',
    // 自定义渲染，右侧显示百分比
    // itemRender: (originNode: any, file: any) => (
    //   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
    //     <Tooltip content={file.name}>
    //       <div style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: "10px" }}>{originNode}</div>
    //     </Tooltip>
    //     <div style={{ marginTop: 7, minWidth: "40px", textAlign: "right" }}>{Math.round(file.percent || 0)}%</div>
    //   </div>
    // ),
    customRequest: async ({ file, onSuccess, onError, onProgress }: any) => {
      const mimeType = file.type || getFileMimeType(file.name);
      let md5Checksum = '';
      try {
        md5Checksum = await calculateFileMD5(file);
      } catch (err) {
        onError?.(err as Error);
        messageApi.error(`计算文件 MD5 失败: ${file.name}`);
        return;
      }
      // 决定分片大小（10MB）
      const CHUNK_SIZE = 10 * 1024 * 1024;
      const partCount = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));
      // 1. 预上传获取签名URL
      const preparePayload: any = {
        category: 'dataset',
        file_name: file.name,
        file_size: file.size,
        mime_type: mimeType,
      };
      if (partCount > 1) preparePayload.part_count = partCount;
      try {
        const prepareDataResponse = await uploadFilePrepare(preparePayload);
        const apiResponse = prepareDataResponse.data;
        const file_id = apiResponse?.data?.file_id;
        if (!file_id) {
          throw new Error(
            'Invalid response from prepare upload API: missing file_id'
          );
        }
        setFileIds((prev) => [...prev, file_id]);
        const uploadParts = apiResponse?.data?.part_urls;
        const uploadUrl = apiResponse?.data?.upload_url || null;
        const uploadId = apiResponse?.data?.upload_id || null;

        if (Array.isArray(uploadParts) && uploadParts.length > 0) {
          // 顺序上传每个分片，带简单重试，并上报整体进度
          let cumulativeUploaded = 0;
          for (const partInfo of uploadParts) {
            const partNumber = partInfo?.part_number ?? null;
            const partUrl = partInfo?.url ?? null;
            const method =
              partInfo && partInfo.method ? (partInfo.method as string) : 'PUT';
            const index =
              partNumber && typeof partNumber === 'number'
                ? partNumber - 1
                : uploadParts.indexOf(partInfo);
            const start = index * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);
            if (!partUrl) {
              throw new Error(`Missing part URL for part ${index + 1}`);
            }
            const maxRetries = 3;
            let attempt = 0;
            while (attempt < maxRetries) {
              try {
                await uploadToSignedUrlWithProgress(
                  chunk,
                  partUrl,
                  method,
                  mimeType,
                  (ev) => {
                    const loaded = ev.loaded;
                    const overallPercent = Math.min(
                      100,
                      Math.round(
                        ((cumulativeUploaded + loaded) / file.size) * 100
                      )
                    );
                    onProgress?.({ percent: overallPercent } as any);
                  }
                );
                cumulativeUploaded += chunk.size;
                onProgress?.({
                  percent: Math.min(
                    100,
                    Math.round((cumulativeUploaded / file.size) * 100)
                  ),
                } as any);
                break;
              } catch (err) {
                attempt += 1;
                if (attempt >= maxRetries) throw err;
              }
            }
          }
        } else if (uploadUrl) {
          // 单文件直接上传，支持进度
          await uploadToSignedUrlWithProgress(
            file,
            uploadUrl,
            'PUT',
            mimeType,
            (ev) => {
              const loaded = ev.loaded;
              const total = ev.total || file.size;
              const percent = Math.min(100, Math.round((loaded / total) * 100));
              onProgress?.({ percent } as any);
            }
          );
        } else {
          throw new Error('Prepare API did not return upload instructions');
        }
        // 3. 调用上传完成接口
        try {
          const completeParams: any = { checksum: md5Checksum };
          if (uploadId) completeParams.upload_id = uploadId;
          await completeUploadFile(file_id, completeParams);
          onProgress?.({ percent: 100 } as any);
          onSuccess?.(file);
          messageApi.success(`${file.name} 上传成功`);
        } catch (err) {
          onError?.(err as Error);
        }
      } catch (error) {
        onError?.(error as Error);
        messageApi.error(`${file.name} 上传失败`);
      }
    },
  };

  const handleSubmit = async () => {
    if (!fileIds || fileIds.length === 0) {
      messageApi.error('请先上传文件');
      return;
    }
    if (!formValues.dataset_name) {
      messageApi.error('请选择数据集名称');
      return;
    }
    if (!formValues.description.trim()) {
      messageApi.error('请输入任务描述');
      return;
    }

    setIsLoading(true);
    try {
      await uploadDatasetData({
        file_ids: fileIds,
        dataset_id: formValues.dataset_name,
        description: formValues.description.trim(),
      });
      messageApi.success('上传成功');
      setFileIds([]);
      setFormValues({
        dataset_name: '',
        description: 'fold blue clothes',
      });
      onFinish?.();
    } catch (error) {
      messageApi.error('上传失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormValues({
      dataset_name: '',
      description: 'fold blue clothes',
    });
    setFileIds([]);
    onCancel?.();
  };

  return (
    <div style={{ width: '93%' }}>
      {contextHolder}
      <Form layout="horizontal" labelAlign="right">
        <Form.Item label="上传文件" required>
          <Upload {...uploadProps}>
            <div
              style={{
                padding: '40px 0',
                textAlign: 'center',
                border: '1px dashed var(--color-neutral-3)',
              }}
            >
              <IconPlus style={{ fontSize: '24px', color: '#86909c' }} />
              <p style={{ fontSize: '14px', color: '#4e5969' }}>
                点击或拖拽文件到此处上传
              </p>
              <p style={{ fontSize: '12px', color: '#86909c' }}>
                支持单次或批量上传，最多50个文件
              </p>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item label="数据集" required>
          <Select
            placeholder="请选择数据集名称"
            value={formValues.dataset_name}
            onChange={(value) =>
              setFormValues((prev) => ({ ...prev, dataset_name: value }))
            }
            style={{ width: '100%' }}
          >
            {datasets.map((dataset) => (
              <Select.Option key={dataset.value} value={dataset.value}>
                {dataset.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="任务描述" required>
          <Input.TextArea
            placeholder="请输入任务描述"
            value={formValues.description}
            onChange={(value) =>
              setFormValues((prev) => ({ ...prev, description: value }))
            }
            style={{ width: '100%' }}
            autoSize={{ minRows: 3 }}
          />
        </Form.Item>
      </Form>

      <div
        style={{
          justifyContent: 'flex-end',
          display: 'flex',
          gap: '14px',
          marginTop: '24px',
        }}
      >
        <Button type="default" onClick={handleReset}>
          取消
        </Button>
        <Button type="primary" onClick={handleSubmit} loading={isLoading}>
          确定
        </Button>
      </div>
    </div>
  );
};

export default UpLoadFile;
