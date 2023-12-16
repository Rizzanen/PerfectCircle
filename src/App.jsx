import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [lastX, setLastX] = useState(null);
  const [lastY, setLastY] = useState(null);
  const [distanceArray, setDistanceArray] = useState([]);
  const [consistency, setConsistency] = useState("Draw a circle to start");
  const [best, setBest] = useState(0);
  var bestText = best.toString() + "%";

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI, false);
    ctx.fillStyle = "rgb(231, 7, 7)";
    ctx.fill();
    ctx.closePath();

    function startDrawing(e) {
      setDrawing(true);
      const { offsetX, offsetY } = getMouseOrTouchPosition(e);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setLastX(offsetX);
      setLastY(offsetY);
    }

    const draw = (event) => {
      if (!drawing) return;
      const { offsetX, offsetY } = getMouseOrTouchPosition(event);

      if (lastX !== null && lastY !== null) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgb(231, 7, 7)";
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
      }

      const currentDistance = Math.sqrt(
        Math.pow(centerX - offsetX, 2) + Math.pow(centerY - offsetY, 2)
      );

      setDistanceArray((prevArray) => [...prevArray, currentDistance]);
      setLastX(offsetX);
      setLastY(offsetY);
    };

    const stopDrawing = () => {
      setDrawing(false);
      if (distanceArray.length < 50) {
        setConsistency("That's not a circle...");
      } else {
        if (distanceArray[0] < 15) {
          setConsistency("You need to start further from the dot!");
        } else {
          var counter = 0;
          distanceArray.forEach((value) => {
            if (value < distanceArray[0] + 5 && value > distanceArray[0] - 5) {
              counter++;
            }
          });
          var amount = (counter / distanceArray.length) * 100;
          if (amount > best) {
            setBest(amount.toFixed(2).toString());
          }
          if (!isNaN(amount)) {
            setConsistency(amount.toFixed(2).toString() + "%");
          } else {
            amount = " Draw again to get your ";
            setConsistency(amount);
          }
        }
      }

      setLastX(null);
      setLastY(null);
      setDistanceArray([]);
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    // Event listeners for touchscreen
    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);

      // Remove event listeners for touchscreen
      canvas.removeEventListener("touchstart", startDrawing);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stopDrawing);
    };
  }, [drawing, lastX, lastY, distanceArray]);

  const getMouseOrTouchPosition = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    if (event.type.startsWith("mouse")) {
      return {
        offsetX: (event.clientX - rect.left) * scaleX,
        offsetY: (event.clientY - rect.top) * scaleY,
      };
    } else if (event.type.startsWith("touch")) {
      const touch = event.touches[0];
      return {
        offsetX: (touch.pageX - rect.left) * scaleX,
        offsetY: (touch.pageY - rect.top) * scaleY,
      };
    }
  };

  return (
    <div className="page">
      <div className="header">
        <h1>Draw a perfect circle around the dot</h1>
        <div className="prosents">
          <h2>{consistency}</h2>
        </div>
        <div className="highscore">
          <h2>Personal best: {bestText}</h2>
        </div>
      </div>
      <div className="canvasContainer">
        <canvas className="canvas" ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default App;
