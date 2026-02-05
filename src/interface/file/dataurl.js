
function arrayBufferToDataURL(arrayBuffer, mimeType) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([arrayBuffer], { type: mimeType });

    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(blob);
  });
}

async function dataURLToArrayBuffer(dataURL) {
    var response = await fetch(dataURL);
    var arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
}

module.exports = {
    arrayBufferToDataURL,
    dataURLToArrayBuffer,
};