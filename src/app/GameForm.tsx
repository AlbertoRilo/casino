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

const GameForm: React.FC<{ onAddGame: (game: GameFormInputs) => void }> = ({ onAddGame }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<GameFormInputs>();

  const onSubmit: SubmitHandler<GameFormInputs> = (data) => {
    onAddGame(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-100 p-4 mt-4 rounded-lg shadow-inner">
      <h3 className="text-xl font-bold mb-4">Add New Game</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700">Game Name</label>
          <input
            {...register('gameName', { required: true })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.gameName && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        <div>
          <label className="block text-gray-700">Game Description</label>
          <input
            {...register('gameDescription', { required: true })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.gameDescription && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        <div>
          <label className="block text-gray-700">Casino ID</label>
          <input
            type="number"
            {...register('gameCasinoId', { required: true })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.gameCasinoId && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        <div>
          <label className="block text-gray-700">Provider ID</label>
          <input
            type="number"
            {...register('gameProviderId', { required: true })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {errors.gameProviderId && <span className="text-red-500 text-sm">This field is required</span>}
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        Add Game
      </button>
    </form>
  );
};

export default GameForm;
