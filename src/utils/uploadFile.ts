import CryptoJS from 'crypto-js';
/**
 * 计算文件的MD5值
 * @param file 文件对象
 * @returns MD5哈希值（32位十六进制字符串）
 */
export const calculateFileMD5 = async (file: File): Promise<string> => {
  // 分块读取文件并使用 CryptoJS 增量计算 MD5，避免大文件一次性加载内存
  return new Promise((resolve, reject) => {
    try {
      const chunkSize = 2 * 1024 * 1024; // 2MB 每块
      const chunks = Math.ceil(file.size / chunkSize);
      let current = 0;
      const md5Hasher = CryptoJS.algo.MD5.create();
      const reader = new FileReader();

      reader.onerror = (err) => {
        reject(err);
      };

      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          // 将 ArrayBuffer 转为 WordArray（小块安全）
          const u8 = new Uint8Array(arrayBuffer);
          const wordArray = CryptoJS.lib.WordArray.create(u8 as any);
          md5Hasher.update(wordArray);
          current += 1;
          if (current < chunks) {
            loadNextChunk();
          } else {
            const md5 = md5Hasher.finalize().toString();
            resolve(md5);
          }
        } catch (error) {
          reject(error);
        }
      };
      const loadNextChunk = () => {
        const start = current * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const blob = file.slice(start, end);
        reader.readAsArrayBuffer(blob);
      };
      loadNextChunk();
    } catch (error) {
      reject(error);
    }
  });
};
// 使用 XHR 上传以支持进度回调
export const uploadToSignedUrlWithProgress = (
  blob: Blob,
  url: string,
  method = 'PUT',
  mimeType?: string,
  onProgress?: (ev: ProgressEvent<EventTarget>) => void
) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.upload.onprogress = (ev) => {
        onProgress?.(ev);
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };
      xhr.onerror = () => {
        reject(new Error('Network error while uploading'));
      };
      xhr.ontimeout = () => {
        reject(new Error('Upload timeout'));
      };
      // 设定超时时间
      xhr.timeout = 6000;
      xhr.send(blob as any);
    } catch (err) {
      reject(err);
    }
  });
};
