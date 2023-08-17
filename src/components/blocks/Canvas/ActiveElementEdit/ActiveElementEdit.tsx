import React, {
  JSX,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useState
} from "react";
import { Button } from "@/components/elements/Button/Button";
import usePrevious from "@/hooks/usePrevious";
import { edit } from "@/redux/slices/canvas/reducer";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import s from "./index.module.scss";

export const ActiveElementEdit = (): JSX.Element => {
  const { activeElement } = useSelector((state: RootState) => state.canvas);
  const { activeElementMeta } = useSelector(
    (state: RootState) => state.editActiveElement
  );
  const dispatch: AppDispatch = useDispatch();
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const previousLastPosition = usePrevious<typeof lastPosition>(lastPosition);
  const [firstTime, setFirstTime] = useState(0);

  const onMouseDownDrag = (e: ReactMouseEvent<HTMLButtonElement>) => {
    setLastPosition({ x: e.clientX, y: e.clientY });
    document.addEventListener("mousemove", onMouseMoveDrag);
    document.addEventListener("mouseup", onMouseUpDrag);
  };

  useEffect(() => {
    if (firstTime < 2) {
      setFirstTime(firstTime + 1);
      return;
    }
    if (activeElement && previousLastPosition && "x" in activeElement) {
      dispatch(
        edit({
          x: activeElement.x - previousLastPosition.x + lastPosition.x,
          y: activeElement.y - previousLastPosition.y + lastPosition.y
        })
      );
    }
  }, [lastPosition]);

  const onMouseMoveDrag = (e: MouseEvent) => {
    setLastPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  const onMouseUpDrag = () => {
    document.removeEventListener("mousemove", onMouseMoveDrag);
    document.removeEventListener("mouseup", onMouseUpDrag);
    setFirstTime(1);
  };

  if (activeElement && activeElementMeta)
    return (
      <div
        className={s.container}
        style={{
          width: activeElementMeta?.width || 0,
          left: activeElementMeta.x || 0,
          top: activeElementMeta.y - 5 || 0
        }}>
        <div className={s.buttons}>
          <Button className={s.buttons__drag} onMouseDown={onMouseDownDrag}>
            d
          </Button>
        </div>
      </div>
    );

  return <></>;
};
