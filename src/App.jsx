import { useState, useRef, useEffect } from "react";

import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  var [lastX, setLastX] = useState(null);
  var [lastY, setLastY] = useState(null);
  const [distanceArray, setDistanceArray] = useState([]);
  const [consistency, setConsistency] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = "yellow";
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
        ctx.strokeStyle = "green";
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

      // Calculate the standard deviation of distances
      const avgDistance =
        distanceArray.reduce((acc, val) => acc + val, 0) / distanceArray.length;
      const stdDev = Math.sqrt(
        distanceArray.reduce(
          (acc, val) => acc + Math.pow(val - avgDistance, 2),
          0
        ) / distanceArray.length
      );
      var counter = 0;
      distanceArray.forEach((value) => {
        if (value < distanceArray[0] + 5 && value > distanceArray[0] - 5) {
          counter++;
        }
      });
      var amount = (counter / distanceArray.length) * 100;
      if (amount.toString() != "NaN") {
        setConsistency(amount.toFixed(2));
      } else {
        amount = "Thats way off bro!";
        setConsistency(amount);
      }
      console.log(amount);

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
        <h1>Draw a perfect circle</h1>
        <h5>{consistency}</h5>
      </div>
      <div className="canvasContainer">
        <canvas className="canvas" ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default App;
