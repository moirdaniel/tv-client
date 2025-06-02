import React from "react";

interface AdSpaceProps {
  width?: string;
  height?: string;
  adText?: string;
}

const AdSpace: React.FC<AdSpaceProps> = ({ 
  width = "100%", 
  height = "90px",
  adText = "Publicidad"
}) => {
  return (
    <div 
      className="bg-gray-800 flex items-center justify-center overflow-hidden"
      style={{ width, height }}
    >
      <span className="text-gray-500 text-sm">{adText}</span>
    </div>
  );
};

export default AdSpace;