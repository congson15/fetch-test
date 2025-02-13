import { useEffect, useState } from "react";
import { TPosition } from "../types";

type TPinProps = {
  position: TPosition;
  size: number;
  isHit: boolean;
  resetState: () => void;
};

export default function Pin({ position, size, isHit, resetState }: TPinProps) {
  const [isGlow, setIsGlow] = useState(false);

  useEffect(() => {
    if (!isHit) return;

    setIsGlow(true);
    const timeoutHandle = setTimeout(() => {
      setIsGlow(false);
      resetState();
    }, 125);

    return () => clearTimeout(timeoutHandle);
  }, [isHit, resetState]);

  return (
    <div
      className={`pin ${isGlow ? "pin--hit" : ""}`}
      style={{ width: size, height: size, top: position.y, left: position.x }}
    />
  );
}
