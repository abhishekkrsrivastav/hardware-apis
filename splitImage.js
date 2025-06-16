
// const fs = require('fs');
// const file = fs.readFileSync('img_3.jpg');
// const chunkSize = 10240; // 10KB
// const totalChunks = Math.ceil(file.length / chunkSize);

// for (let i = 0; i < totalChunks; i++) {
//   const start = i * chunkSize;
//   const end = Math.min(start + chunkSize, file.length);
//   const chunk = file.slice(start, end);
//   fs.writeFileSync(`chunk${i}.part`, chunk);
// }
// console.log('Image split into', totalChunks, 'chunks!');

const fs = require('fs');
const axios = require('axios');

const file = fs.readFileSync('myimage.jpg');
const chunkSize = 10240; // 10KB
const totalChunks = Math.ceil(file.length / chunkSize);
const fileId = 'abc123';

for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.length);
    const chunk = file.slice(start, end);
    fs.writeFileSync(`chunk${i}.part`, chunk);


    axios.post('http://localhost:3333/upload-single-image-chunk', chunk, {
        headers: {
            'x-file-id': fileId,
            'x-chunk-index': i,
            'x-total-chunks': totalChunks,
            'Content-Type': 'application/octet-stream'
        }
    }).then(res => {
        console.log(res.data);
    });
}

console.log('Image split into', totalChunks, 'chunks!');