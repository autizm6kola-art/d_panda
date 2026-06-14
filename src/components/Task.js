import React from "react";
import {
  getSavedAnswer,
  saveAnswerText,
  saveCorrectAnswer,
  isTaskCorrect
} from "../utils/storage";

import "../styles/taskItem.css";

function Task({ task, onCorrect, resetSignal }) {
  const [answer, setAnswer] = React.useState("");
  const [isCorrect, setIsCorrect] = React.useState(false);
  const [isWrong, setIsWrong] = React.useState(false);

  React.useEffect(() => {
    const savedAnswer = getSavedAnswer(task.id);
    const correct = isTaskCorrect(task.id);

    setAnswer(savedAnswer || "");
    setIsCorrect(correct);
    setIsWrong(false);
  }, [task.id, resetSignal]);

  const normalize = (text) => {
  return text
    .toLowerCase()
    .replace(/[.,!?;:()«»"—–-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

  const speakText = () => {
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(task.text);

    utterance.lang = "ru-RU";
    utterance.rate = 0.9;

    speechSynthesis.speak(utterance);
  };

  const handleChange = (e) => {
    const value = e.target.value;

    setAnswer(value);
    saveAnswerText(task.id, value);

    setIsWrong(false);

    // Если задание уже выполнено, зелёный цвет остаётся.
    if (!isTaskCorrect(task.id)) {
      setIsCorrect(false);
    }
  };

  const checkAnswer = () => {
    const correct =
      normalize(answer) === normalize(task.text);

    if (correct) {
      saveCorrectAnswer(task.id);

      setIsCorrect(true);
      setIsWrong(false);

      if (typeof onCorrect === "function") {
        onCorrect(task.id);
      }
    } else {
      setIsWrong(true);
      setIsCorrect(false);
    }
  };

  const inputStyle = {
    width: "100%",
    minHeight: "120px",
    padding: "10px",
    fontSize: "18px",
    boxSizing: "border-box",
    backgroundColor: isCorrect
      ? "#c8f7c5"
      : isWrong
      ? "#ffd6d6"
      : "white"
  };

  return (
    <div>
      <p>
        <strong>{task.id}</strong>
      </p>

      <button
        onClick={speakText}
        style={{
          marginBottom: "15px",
          fontSize: "18px",
          padding: "10px 20px"
        }}
      >
        🔊 Слушать
      </button>

      <textarea
        value={answer}
        onChange={handleChange}
        style={inputStyle}
        placeholder="Напишите то, что услышали"
      />

      <div style={{ marginTop: "10px" }}>
        <button
          onClick={checkAnswer}
          className="save-button"
        >
          ✓ Проверить
        </button>
      </div>
    </div>
  );
}

export default Task;