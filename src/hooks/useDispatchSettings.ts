import { IToolsKeys, setSettings } from "@/redux/slices/settings/reducer";
import { useAppDispatch } from "@/redux/store";
import { ToolType } from "@/types/canvas";

export const useDispatchSettings = <T extends ToolType>(tool: T) => {
  const dispatch = useAppDispatch();

  return (key: keyof IToolsKeys[T], value: IToolsKeys[T][typeof key]) => {
    dispatch(
      setSettings({
        tool: tool,
        settings: {
          [key]: value
        }
      })
    );
  };
};
