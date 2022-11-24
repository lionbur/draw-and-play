export function matFromUrl(cv, url) {
  return new Promise((resolve, reject) => {
    try {
      const image = new Image();
      image.onload = () => {
        const canvas = new OffscreenCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const mat = cv.matFromImageData(imgData);
        resolve(mat);
      };
      image.src = url;
    } catch (err) {
      reject(err);
    }
  });
}

export function imageDataFromMat(mat) {
  return new ImageData(new Uint8ClampedArray(mat.data), mat.cols, mat.rows);
}

export function drawScaledMat(ctx, mat) {
  const offscreen = new OffscreenCanvas(mat.cols, mat.rows);
  const offscreenCtx = offscreen.getContext('2d');
  offscreenCtx.putImageData(imageDataFromMat(mat), 0, 0);
  ctx.drawImage(
    offscreen,
    0,
    0,
    Math.round((ctx.canvas.width * mat.rows) / mat.cols),
    ctx.canvas.height,
  );
}
