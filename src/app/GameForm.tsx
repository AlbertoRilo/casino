// src/app/components/GameForm/GameForm.tsx
'use client'
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';

type GameFormInputs = {
  gameName: string;
  gameDescription: string;
  gameCasinoId: number;
  gameProviderId: number;
};

const GameForm: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<GameFormInputs>();

  const onSubmit: SubmitHandler<GameFormInputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('gameName', data.gameName);
      formData.append('gameDescription', data.gameDescription);
      formData.append('gameCasinoId', String(data.gameCasinoId)); // Convert to string if necessary
      formData.append('gameProviderId', String(data.gameProviderId)); // Convert to string if necessary

      await axios.post('/api/game', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      reset();
      alert('Game added successfully');
    } catch (error) {
      console.error(error);
      alert('Error adding game');
    }
  };

  // Custom function to handle input change in gameName
  const handleGameNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Prevent input if value contains any numbers
    if (/\d/.test(value)) {
      event.target.value = value.replace(/\d/g, '');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gray-50 p-6 md:p-8 shadow-lg rounded-lg max-w-7xl mx-auto mt-8"
    >
      <h2 className="text-2xl font-bold mb-8 text-center">Add New Game</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700">Game Name (no numbers)</label>
          <input
            {...register('gameName', {
              required: 'This field is required',
              pattern: {
                value: /^[a-zA-Z\s]*$/,
                message: 'Game name should not contain numbers',
              },
            })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            onChange={handleGameNameChange} // Call custom function on change
          />
          {errors.gameName && (
            <span className="text-red-500 text-sm">{errors.gameName.message}</span>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-gray-700">Game Description</label>
          <textarea
            {...register('gameDescription', {
              required: 'This field is required',
            })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.gameDescription && (
            <span className="text-red-500 text-sm">{errors.gameDescription.message}</span>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Game Casino ID</label>
          <input
            type="number"
            {...register('gameCasinoId', {
              required: 'This field is required',
              min: { value: 1, message: 'Casino ID must be greater than 0' },
            })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.gameCasinoId && (
            <span className="text-red-500 text-sm">{errors.gameCasinoId.message}</span>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Game Provider ID</label>
          <input
            type="number"
            {...register('gameProviderId', {
              required: 'This field is required',
              min: { value: 1, message: 'Provider ID must be greater than 0' },
            })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.gameProviderId && (
            <span className="text-red-500 text-sm">{errors.gameProviderId.message}</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="mt-8 w-full py-3 px-6 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        Add Game
      </button>
    </form>
  );
};

export default GameForm;
