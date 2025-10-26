
import React, { useEffect } from 'react';
import { useBakery } from '../context/BakeryContext';
import { Notification as NotificationType } from '../types';

const Notification: React.FC<{ notification: NotificationType, onDismiss: (id: string) => void }> = ({ notification, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  const baseClasses = "flex items-center p-4 mb-4 text-sm rounded-lg shadow-lg transition-opacity duration-300";
  const typeClasses = {
    success: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[notification.type]}`} role="alert">
      <span className="font-medium mr-2">{notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}!</span> {notification.message}
       <button onClick={() => onDismiss(notification.id)} className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg focus:ring-2 inline-flex h-8 w-8" aria-label="Dismiss">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </button>
    </div>
  );
};


const NotificationContainer: React.FC = () => {
    const { state, dispatch } = useBakery();

    const handleDismiss = (id: string) => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    };

    return (
        <div className="fixed top-5 right-5 z-50 w-full max-w-sm">
            {state.notifications.map(notification => (
                <Notification key={notification.id} notification={notification} onDismiss={handleDismiss} />
            ))}
        </div>
    );
};

export default NotificationContainer;
