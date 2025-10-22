import React from 'react';

const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
        <h2 className="text-2xl font-semibold text-[#00a99d] mb-4">Success</h2>
        <p className="text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-[#00a99d] text-white rounded hover:bg-green-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
