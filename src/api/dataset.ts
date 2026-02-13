import axios from 'axios';

export type DatasetListParams = {
  page?: number;
  limit?: number;
  dataset_name?: string;
  dataset_version?: string;
  dataset_format?: string;
  status?: string;
};

export type DatasetListResponse = {
  data: {
    list: API.Dataset[];
    total: number;
  };
  success?: boolean;
};
export type DatasetEpisodeListResponse = {
  data: {
    list: API.Episode[];
    total: number;
  };
  success?: boolean;
};
export type DatasetDetailResponse = {
  data: API.Dataset;
  success: boolean;
};

export type DatasetCreateResponse = {
  data: API.Dataset;
  success: boolean;
};

export type DatasetUpdateResponse = {
  data: API.Dataset;
  success: boolean;
};

export type DatasetDeleteResponse = {
  success: boolean;
};

export type DatasetStatsResponse = {
  data: API.DatasetStats;
  success: boolean;
};

export function getDatasetList(params: DatasetListParams) {
  return axios.post<DatasetListResponse>('/api/v1/dataset/list', params);
}

export function getDatasetDetail(datasetId: string) {
  return axios.get<DatasetDetailResponse>(
    `/api/v1/dataset/detail/${datasetId}`
  );
}

export function createDataset(params: API.DatasetCreateParams) {
  return axios.post<DatasetCreateResponse>('/api/v1/dataset', params);
}

export function updateDataset(
  datasetId: string,
  params: API.DatasetUpdateParams
) {
  return axios.put<DatasetUpdateResponse>(
    `/api/v1/dataset/${datasetId}`,
    params
  );
}

export function deleteDataset(datasetId: string) {
  return axios.delete<DatasetDeleteResponse>(`/api/v1/dataset/${datasetId}`);
}

export function getDatasetStats() {
  return axios.get<DatasetStatsResponse>('/api/v1/dataset/stats');
}

export function getDatasets(params: DatasetListParams) {
  return axios.post<DatasetListResponse>('/api/v1/dataset/list', params);
}
export function getEpisodesList(params: DatasetListParams) {
  return axios.post<DatasetEpisodeListResponse>('/api/v1/episode/list', params);
}
