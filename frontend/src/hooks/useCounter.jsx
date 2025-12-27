import { useEffect , useState } from "react";

const useCountdown = (endTime) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!endTime) return;

    const end = new Date(endTime).getTime();

    const update = () => {
      const diff = end - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    };

    update(); // 🔥 run immediately

    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return timeLeft;
};

export default useCountdown;

