'use client'
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type BonusFormInputs = {
  bonusTypeId: number;
  bonusAmount: string;
  bonusWE: string;
  sticky: boolean;
  bonusText: string;
  bonusTerms: string;
};

const BonusForm: React.FC<{ onAddBonus: (bonus: BonusFormInputs) => void }> = ({ onAddBonus }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BonusFormInputs>();

  const onSubmit: SubmitHandler<BonusFormInputs> = (data) => {
    onAddBonus(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-100 p-4 mt-4 rounded-lg shadow-inner">
      <h3 className="text-xl font-bold mb-4">Add New Bonus</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700">Bonus Type ID</label>
          <input
            type="number"
            {...register('bonusTypeId', { required: true })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.bonusTypeId && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        <div>
          <label className="block text-gray-700">Bonus Amount</label>
          <input
            {...register('bonusAmount', { required: true })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.bonusAmount && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        <div>
          <label className="block text-gray-700">Bonus WE</label>
          <input
            {...register('bonusWE', { required: true })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.bonusWE && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        <div>
          <label className="block text-gray-700">Sticky</label>
          <input
            type="checkbox"
            {...register('sticky')}
            className="mt-1"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700">Bonus Text</label>
          <textarea
            {...register('bonusText', { required: true })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.bonusText && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700">Bonus Terms</label>
          <textarea
            {...register('bonusTerms', { required: true })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.bonusTerms && <span className="text-red-500 text-sm">This field is required</span>}
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        Add Bonus
      </button>
    </form>
  );
};

export default BonusForm;
