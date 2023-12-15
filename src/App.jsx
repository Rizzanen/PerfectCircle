import { useState, useRef, useEffect } from "react";

import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  var [lastX, setLastX] = useState(null);
  var [lastY, setLastY] = useState(null);
  const [distanceArray, setDistanceArray] = useState([]);
  const [consistency, setConsistency] = useState(0.0);
  const [best, setBest] = useState(0);

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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      [lastX, lastY] = [
        e.clientX - canvas.offsetLeft,
        e.clientY - canvas.offsetTop,
      ];
    }

    const draw = (event) => {
      if (!drawing) return;
      const rect = canvas.getBoundingClientRect();
      var scaleX = canvas.width / rect.width;
      var scaleY = canvas.height / rect.height;
      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;

      if (lastX !== null && lastY !== null) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgb(231, 7, 7)";
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      const currentDistance = Math.sqrt(
        Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2)
      );

      setDistanceArray((prevArray) => [...prevArray, currentDistance]);
      setLastX(x);
      setLastY(y);
    };

    const stopDrawing = () => {
      setDrawing(false);

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
        if (!isNaN(amount)) {
          setConsistency(amount.toFixed(2));
          if (amount > best) {
            setBest(amount.toFixed(2));
          }
        } else {
          amount = " Draw again to get your ";
          setConsistency(amount);
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

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
    };
  }, [drawing, lastX, lastY, distanceArray]);

  return (
    <div className="page">
      <div className="header">
        <h1>Draw a perfect circle around the dot</h1>
        <div className="prosents">
          <h2>{consistency} %</h2>
        </div>
        <div className="highscore">
          <h2>Personal best: {best} %</h2>
        </div>
      </div>
      <div className="canvasContainer">
        <canvas className="canvas" ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default App;
