import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';

type UploadCSVFormInputs = {
  csvFile: FileList;
};

const UploadCSVForm: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UploadCSVFormInputs>();

  const onSubmit: SubmitHandler<UploadCSVFormInputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('csvFile', data.csvFile[0]);

      await axios.post('http://localhost:5000/api/uploadcsv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      reset();
      alert('CSV file uploaded successfully');
    } catch (error) {
      console.error(error);
      alert('Error uploading CSV file');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-6 md:p-8 shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-8 text-center">Upload CSV File</h2>
        
        <div>
          <label className="block text-gray-700">CSV File</label>
          <input
            type="file"
            accept=".csv"
            {...register('csvFile', {
              required: 'This field is required',
              validate: {
                isCSV: (files) => files[0]?.type === 'text/csv' || 'Only .csv files are allowed',
              },
            })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.csvFile && (
            <span className="text-red-500 text-sm">{errors.csvFile.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="mt-8 w-full py-3 px-6 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Upload CSV
        </button>
      </form>
    </div>
  );
};

export default UploadCSVForm;
