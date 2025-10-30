import React from "react";

interface RemoteCursorProps {
  userName: string;
  color: string;
  position: { top: number; left: number };
}

export const RemoteCursor: React.FC<RemoteCursorProps> = ({
  userName,
  color,
  position,
}) => {
  return (
    <div
      className="remote-cursor"
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        pointerEvents: "none",
        zIndex: 1000,
        transition: "all 0.1s ease-out",
      }}
    >
      <div
        style={{
          width: "2px",
          height: "20px",
          backgroundColor: color,
          position: "relative",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "-22px",
          left: "0",
          backgroundColor: color,
          color: "white",
          padding: "2px 6px",
          borderRadius: "3px",
          fontSize: "11px",
          fontWeight: "500",
          whiteSpace: "nowrap",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        {userName}
      </div>
    </div>
  );
};

export default RemoteCursor;
