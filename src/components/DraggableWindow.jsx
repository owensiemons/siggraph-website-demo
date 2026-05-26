import { useState, useRef, useCallback, useEffect } from "react";
import './DraggableWindow.css';

export default function DraggableWindow({ title = "Window", children, x_0 = 100, y_0 = 100, color=`#406895`}) {
  const [pos, setPos] = useState({ x: x_0, y: y_0 });
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const windowOnMouseDown = useCallback((e) => {
    isDragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  }, [pos]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    };
    const onMouseUp = () => {
      isDragging.current = false;
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div
      className="window"
      style={{ "--win-x": `${pos.x}px`, "--win-y": `${pos.y}px`, "--bg": `${color}`, pointerEvents: "all" }}
    >
      <div className="titleBar" onMouseDown={windowOnMouseDown}>
        {title}
        <svg height="20" width="20" >
            <circle cx="10" cy="10" r="7" fill="#406895" stroke="black"/>
        </svg>
      </div>
      <div className="body">
        {children}
      </div>
    </div>
  );
}