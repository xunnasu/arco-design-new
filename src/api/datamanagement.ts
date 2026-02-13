import axios from 'axios';

export type FileUploadPrepareParams = API.FileUploadParams;

export type FileUploadPrepareData = {
  file_id: string;
  upload_url: string;
  object_key: string;
  expires_in: number;
  upload_id: string;
  part_urls: {
    part_number: number;
    url: string;
    method: string;
  }[];
};

export type FileUploadPrepareResponse = {
  errno: number;
  errmsg: string;
  data: FileUploadPrepareData;
};

export type AxiosResponse<T = any> = {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
};

export type FileUploadCompleteParams = {
  checksum: string; // hash。md5
};

export type FileUploadCompleteResponse = {
  errno: number;
  errmsg: string;
  data: null;
};

export type DatasetUploadParams = API.DatasetUploadParams;

export type DatasetUploadResponse = {
  errno: number;
  errmsg: string;
  data: {
    file_id: string;
    dataset_id: string;
    description: string;
  } | null;
};

export type DatasetTasksParams = {
  page?: number;
  limit?: number;
};

export type DatasetTasksResponse = {
  errno: number;
  errmsg: string;
  data: {
    list: API.Dataset[];
    total: number;
  };
};
// 获取数据集任务列表
export function getDatasetTasks(body: DatasetTasksParams) {
  return axios.post<DatasetTasksResponse>('/api/v1/dataset/task/list', body);
}

// 文件上传 POST /api/v1/file/upload/prepare
// 请求参数是
// category string类型  是否必传：Y 说明：类型。dataset
// file_name string类型  是否必传：Y 说明：文件名
// file_size number类型  是否必传：Y 说明：文件大小
// mime_type string类型  是否必传：Y 说明：mime类型
/**
 * 文件上传
 * @param body 文件上传参数
 * @param options 额外请求选项
 * @returns 上传文件的URL
 */
export function uploadFilePrepare(body: FileUploadPrepareParams) {
  return axios.post<FileUploadPrepareResponse>(
    '/api/v1/file/upload/prepare',
    body
  );
}

// 文件上传完成 /api/v1/file/upload/complete/:file_id
// 请求参数是 checksum string类型  是否必传：Y 说明：hash。md5
/**
 * 上传文件完成
 * @param fileId 文件ID
 * @param body 文件上传完成参数
 * @returns 上传文件完成结果
 */
export function completeUploadFile(
  fileId: string,
  body: FileUploadCompleteParams
) {
  return axios.post<FileUploadCompleteResponse>(
    `/api/v1/file/upload/complete/${fileId}`,
    body
  );
}

// 上传数据集数据 POST /api/v1/episode/add/task/create
// file_id 类型：string  是否比传 Y 说明：上传的文件id
// dataset_id 类型：string  是否比传 Y  说明：数据集ID。（从数据集列表筛选）
export function uploadDatasetData(body: DatasetUploadParams) {
  return axios.post<DatasetUploadResponse>(
    '/api/v1/episode/add/task/create',
    body
  );
}
