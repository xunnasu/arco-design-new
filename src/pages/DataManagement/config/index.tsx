export const getFileMimeType = (fileName: string): string => {
  const extension = fileName.toLowerCase().split('.').pop() || '';
  const mimeTypes: Record<string, string> = {
    // 图片类型
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    // 压缩文件类型
    zip: 'application/zip',
    // 数据集和模型文件
    bag: 'application/octet-stream',
    mcap: 'application/octet-stream',
    splat: 'application/octet-stream',
    // 其他类型
    pdf: 'application/pdf',
    txt: 'text/plain',
    json: 'application/json',
  };
  return mimeTypes[extension] || 'application/octet-stream';
};
