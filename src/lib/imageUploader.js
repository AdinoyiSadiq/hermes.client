import axios from 'axios'; 

const imageUploader = async (file) => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', 'hermes');
  return await axios.post('https://api.cloudinary.com/v1_1/adinoyisadiq/image/upload', data);
}

export default imageUploader;
