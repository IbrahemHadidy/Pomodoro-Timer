const { useState, useEffect, useRef } = React;

const Clock = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const audioRef = useRef(null);

  const handleBreakDecrement = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const handleBreakIncrement = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft((sessionLength - 1) * 60);
    }
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setTimeLeft((sessionLength + 1) * 60);
    }
  };

  const handleReset = () => {
    clearInterval(intervalId);
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel("Session");
    setTimeLeft(25 * 60);
    setTimerRunning(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const handleStartStop = () => {
    if (timerRunning) {
      clearInterval(intervalId);
      setTimerRunning(false);
    } else {
      const newIntervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          return prevTimeLeft - 1;
        });
      }, 1000);
      setIntervalId(newIntervalId);
      setTimerRunning(true);
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      audioRef.current.play();
      if (timerLabel === "Session") {
        setTimerLabel("Break");
        setTimeLeft(breakLength * 60);
      } else {
        setTimerLabel("Session");
        setTimeLeft(sessionLength * 60);
      }
    }
  }, [timeLeft]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  return (
    <div className="app dark-mode">
      <h1>Pomodoro Timer</h1>
      <div className="settings">
        <div className="break-settings">
          <h2 id="break-label">Break Length</h2>
          <div className="button-container">
            <button id="break-decrement" onClick={handleBreakDecrement}>
              -
            </button>
            <span id="break-length">{breakLength}</span>
            <button id="break-increment" onClick={handleBreakIncrement}>
              +
            </button>
          </div>
        </div>
        <div className="session-settings">
          <h2 id="session-label">Session Length</h2>
          <div className="button-container">
            <button id="session-decrement" onClick={handleSessionDecrement}>
              -
            </button>
            <span id="session-length">{sessionLength}</span>
            <button id="session-increment" onClick={handleSessionIncrement}>
              +
            </button>
          </div>
        </div>
      </div>
      <div className="timer-container">
        <div className="timer">
          <h2 id="timer-label">{timerLabel}</h2>
          <span id="time-left">{formatTime(timeLeft)}</span>
        </div>
        <div className="button-container">
          <button id="start_stop" onClick={handleStartStop}>
            {timerRunning ? "Pause" : "Start"}
          </button>
          <button id="reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
      <audio id="beep" ref={audioRef}>
        <source
          src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
          type="audio/wav"
        />
      </audio>
    </div>
  );
};

ReactDOM.render(<Clock />, document.getElementById("root"));
