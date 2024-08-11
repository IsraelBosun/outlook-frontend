import axios from 'axios';

export const crossReference = async (emailFiles, excelFile) => {
  const formData = new FormData();
  emailFiles.forEach((file, index) => {
    formData.append(`email_files`, file, file.name);
  });
  formData.append('excel_file', excelFile, excelFile.name);

  const response = await axios.post('https://outlook-backend-6ts5.onrender.com/cross_reference/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};
