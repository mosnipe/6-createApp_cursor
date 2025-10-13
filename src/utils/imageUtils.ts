// 画像ユーティリティ関数

/**
 * 画像を正方形にリサイズする
 * @param file 元の画像ファイル
 * @param size 正方形のサイズ（デフォルト: 256）
 * @returns Promise<File> リサイズされた画像ファイル
 */
export const resizeImageToSquare = async (file: File, size: number = 256): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // 正方形サイズに設定
      canvas.width = size;
      canvas.height = size;

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // 画像のアスペクト比を計算
      const aspectRatio = img.width / img.height;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = img.width;
      let sourceHeight = img.height;

      // 正方形にクロップする
      if (aspectRatio > 1) {
        // 横長の場合、中央をクロップ
        sourceWidth = img.height;
        sourceX = (img.width - sourceWidth) / 2;
      } else if (aspectRatio < 1) {
        // 縦長の場合、中央をクロップ
        sourceHeight = img.width;
        sourceY = (img.height - sourceHeight) / 2;
      }

      // 画像を描画
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, size, size
      );

      // CanvasからBlobに変換
      canvas.toBlob((blob) => {
        if (blob) {
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(resizedFile);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, file.type, 0.9);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * 画像が正方形かどうかをチェックする
 * @param file 画像ファイル
 * @returns Promise<boolean> 正方形かどうか
 */
export const isSquareImage = async (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve(img.width === img.height);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * 画像のサイズを取得する
 * @param file 画像ファイル
 * @returns Promise<{width: number, height: number}> 画像のサイズ
 */
export const getImageDimensions = async (file: File): Promise<{width: number, height: number}> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};
