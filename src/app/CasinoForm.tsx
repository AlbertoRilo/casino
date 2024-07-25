// src/app/components/CasinoForm/CasinoForm.tsx
'use client'
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import Select from 'react-select';


type CasinoFormInputs = {
  casinoName: string;
  casinoLogo: FileList;
  dateFounded: string;
  address: string;
  casinoOwner: string;
  dateLaunched: string;
  casinoUrl: string;
  phoneSupport: string;
  supportEmail: string;
  helpCentre: string;
  ageLimit: number;
  liveChat: boolean;
  eSportsBetting: boolean;
  cryptoCurrenciesSupported: boolean;
  country: { label: string; value: string } | null;

};

const countryOptions = [
  { value: 'AR', label: 'Argentina' },
  { value: 'BO', label: 'Bolivia' },
  { value: 'BR', label: 'Brazil' },
  { value: 'CL', label: 'Chile' },
  { value: 'CO', label: 'Colombia' },
  { value: 'CR', label: 'Costa Rica' },
  { value: 'CU', label: 'Cuba' },
  { value: 'DO', label: 'Dominican Republic' },
  { value: 'EC', label: 'Ecuador' },
  { value: 'SV', label: 'El Salvador' },
  { value: 'ES', label: 'Spain' },
  { value: 'GT', label: 'Guatemala' },
  { value: 'HN', label: 'Honduras' },
  { value: 'MX', label: 'Mexico' },
  { value: 'NI', label: 'Nicaragua' },
  { value: 'PA', label: 'Panama' },
  { value: 'PY', label: 'Paraguay' },
  { value: 'PE', label: 'Peru' },
  { value: 'PR', label: 'Puerto Rico' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'VE', label: 'Venezuela' },
];

const CasinoForm: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CasinoFormInputs>();
  const [selectedCountry, setSelectedCountry] = useState<{ value: string; label: string } | null>(null);

  const validateOnlyString = (value: string) => {
    // Check if value contains any digits
    if (/\d/.test(value)) {
      return 'Casino name cannot contain numbers';
    }
    return true;
  };


  const onSubmit: SubmitHandler<CasinoFormInputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('casinoName', data.casinoName);
      formData.append('casinoLogo', data.casinoLogo[0]);
      formData.append('dateFounded', data.dateFounded);
      formData.append('address', data.address);
      formData.append('casinoOwner', data.casinoOwner);
      formData.append('dateLaunched', data.dateLaunched);
      formData.append('casinoUrl', data.casinoUrl);
      formData.append('phoneSupport', data.phoneSupport);
      formData.append('supportEmail', data.supportEmail);
      formData.append('helpCentre', data.helpCentre);
      formData.append('ageLimit', data.ageLimit.toString());
      formData.append('liveChat', data.liveChat.toString());
      formData.append('eSportsBetting', data.eSportsBetting.toString());
      formData.append('cryptoCurrenciesSupported', data.cryptoCurrenciesSupported.toString());
      formData.append('country', data.country?.value || '');


      await axios.post('/api/casino', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      reset();
      alert('Casino added successfully');
    } catch (error) {
      console.error(error);
      alert('Error adding casino');
    }
  };

  const handleCountryChange = (selectedOption: { value: string; label: string } | null) => {
    setSelectedCountry(selectedOption); // Actualizar el estado local
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-6 md:p-8 shadow-lg rounded-lg max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-center">Add New Casino</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
          <label className="block text-gray-700">Casino Name</label>
          <input
            {...register('casinoName', {
              required: 'This field is required',
              validate: validateOnlyString
            })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.casinoName && <span className="text-red-500 text-sm">{errors.casinoName.message}</span>}
        </div>


        <div>
          <label className="block text-gray-700">Country</label>
          <Select
            options={countryOptions}
            className="mt-1"
            placeholder="Select a country"
            value={selectedCountry}
            onChange={handleCountryChange} // Manejar el cambio de país con la función personalizada
          />
        </div>

        <div>
          <label className="block text-gray-700">Casino Logo (.png only)</label>
          <input
            type="file"
            {...register('casinoLogo', {
              required: 'This field is required',
              validate: {
                validFileType: (value) =>
                  value[0]?.type === 'image/png' || 'Only .png files are allowed',
              },
            })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.casinoLogo && (
            <span className="text-red-500 text-sm">{errors.casinoLogo.message}</span>
          )}
        </div>
        <div>
          <label className="block text-gray-700">Date Founded</label>
          <input
            type="date"
            {...register('dateFounded', { required: true })}
            className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.dateFounded && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        <div>
          <label className="block text-gray-700">Address</label>
          <input
            {...register('address', { required: true })}
            className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Enter address"
          />
          {errors.address && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        <div>
          <label className="block text-gray-700">Owner</label>
          <input
            {...register('casinoOwner', { required: true,
              validate:validateOnlyString
             })}
            className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Enter casino owner"
          />
          {errors.casinoOwner && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        <div>
          <label className="block text-gray-700">Date Launched</label>
          <input
            type="date"
            {...register('dateLaunched', { required: true })}
            className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.dateLaunched && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        <div>
          <label className="block text-gray-700">Casino URL</label>
          <input
            type="url"
            {...register('casinoUrl', {
              required: 'This field is required',
              pattern: {
                value: /^(http:\/\/|https:\/\/|www\.)\S+/,
                message: 'Must start with http, https, or www',
              },
            })}            className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Enter casino URL"
          />
          {errors.casinoUrl && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        <div>
          <label className="block text-gray-700">Phone Support</label>
          <input
            {...register('phoneSupport')}
            className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Enter phone support"
          />
        </div>

        <div>
          <label className="block text-gray-700">Support Email</label>
          <input
            type="email"
            {...register('supportEmail')}
            className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Enter support email"
          />
        </div>

        <div>
          <label className="block text-gray-700">Help Centre URL</label>
          <input
            type="url"
            {...register('helpCentre')}
            className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Enter help centre URL"
          />
        </div>

        <div>
          <label className="block text-gray-700">Age Limit (minimum 18)</label>
          <input
            type="number"
            {...register('ageLimit', {
              required: 'This field is required',
              min: {
                value: 18,
                message: 'Minimum age limit is 18',
              },
            })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.ageLimit && <span className="text-red-500 text-sm">{errors.ageLimit.message}</span>}
        </div>


        <div className="flex items-center space-x-4 mt-4">
          <label className="inline-flex items-center">
            <input type="checkbox" {...register('liveChat')} className="form-checkbox h-5 w-5 text-blue-500" />
            <span className="ml-2 text-gray-700">LiveChat</span>
          </label>
          <label className="inline-flex items-center">
            <input type="checkbox" {...register('eSportsBetting')} className="form-checkbox h-5 w-5 text-blue-500" />
            <span className="ml-2 text-gray-700">eSports</span>
          </label>
          <label className="inline-flex items-center">
            <input type="checkbox" {...register('cryptoCurrenciesSupported')} className="form-checkbox h-5 w-5 text-blue-500" />
            <span className="ml-2 text-gray-700">Crypto </span>
          </label>
        </div>
      </div>

      <button type="submit" className="mt-8 w-full py-3 px-6 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
        Add Casino
      </button>
    </form>
  );
};

export default CasinoForm;
