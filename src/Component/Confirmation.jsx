import React from 'react'

const Confirmation = ({
    message,
    onConfirm,
    onCancel,
}) => {
  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-black">
              <h3 className="text-lg font-semibold mb-4">Confirm {message}</h3>
              <p className="mb-6">Are you sure you want to {message.toLowerCase()}?</p>
              <div className="flex justify-around gap-4">
                  <div
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                      onClick={onCancel}
                      role="button"
                      tabIndex={0}
                  >
                      Cancel
                  </div>
                  <div
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                      onClick={() => {
                          onConfirm();
                      }}
                      role="button"
                      tabIndex={0}
                  >
                      {message}
                  </div>
              </div>
          </div>
      </div>
  )
}

export default Confirmation