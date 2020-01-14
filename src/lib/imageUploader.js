import axios from 'axios'; 

const imageUploader = async (event) => {
  const files = event.target.files;
  const data = new FormData();
  data.append('file', files[0]);
  data.append('upload_preset', 'hermes');
  return await axios.post('https://api.cloudinary.com/v1_1/adinoyisadiq/image/upload', data);
}

export default imageUploader;
