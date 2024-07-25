import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type PaymentProviderFormInputs = {
  paymentProviderName: string;
};

const PaymentProviderForm: React.FC<{ onAddPaymentProvider: (paymentProvider: PaymentProviderFormInputs) => void }> = ({ onAddPaymentProvider }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PaymentProviderFormInputs>();

  const onSubmit: SubmitHandler<PaymentProviderFormInputs> = (data) => {
    onAddPaymentProvider(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-100 p-4 mt-4 rounded-lg shadow-inner">
      <h3 className="text-xl font-bold mb-4">Add New Payment Provider</h3>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-gray-700">Payment Provider Name</label>
          <input
            {...register('paymentProviderName', { required: true })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.paymentProviderName && <span className="text-red-500 text-sm">This field is required</span>}
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        Add Payment Provider
      </button>
    </form>
  );
};

export default PaymentProviderForm;
