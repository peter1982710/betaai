
import React from 'react';

interface SupportButtonProps {
  label: string;
}

const SupportButton: React.FC<SupportButtonProps> = ({ label }) => {
  return (
    <a 
      href="https://t.me/king_service2" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105"
    >
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-bold">
        {label}
      </span>
      <svg 
        className="w-6 h-6" 
        fill="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11.944 0C5.352 0 0 5.352 0 11.944c0 6.592 5.352 11.944 11.944 11.944 6.592 0 11.944-5.352 11.944-11.944C23.888 5.352 18.536 0 11.944 0zM17.48 7.32c-.176.848-2.616 10.984-2.832 11.832-.088.352-.288.584-.52.64-.52.12-.968-.184-1.44-.504-.424-.28-.76-.528-1.2-.848-.4-.288-1.2-.872-.144-1.92l.024-.024c.08-.08.88-1.12 1.632-2.144l.872-1.176c.4-.552.792-1.096.392-1.448-.4-.352-1.104-.184-1.632.144l-2.768 1.832c-.4.264-.784.4-1.144.4-.4 0-.8-.144-1.2-.288l-1.936-.632c-.528-.176-.936-.264-.896-.64.04-.376.584-.576.992-.728l7.584-3.072c1.784-.712 2.16-.84 2.6-.84.44 0 .544.112.568.328z"/>
      </svg>
    </a>
  );
};

export default SupportButton;
