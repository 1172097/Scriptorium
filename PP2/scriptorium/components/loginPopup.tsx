import React from "react";

interface LoginPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ isVisible, onClose, onLogin }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Login Required
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          You need to log in to vote. Would you like to log in now?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onLogin}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
