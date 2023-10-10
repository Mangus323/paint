import { JSX } from "react";
import { Button } from "@/components/elements/Button/Button";
import { setIsDownloading } from "@/redux/slices/canvas/reducer";
import { setImageScale } from "@/redux/slices/canvasMeta/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Box, Modal, Typography } from "@mui/material";

interface SaveFileModalProps {
  open: boolean;
  onClose?: () => void;
}

export const SaveFileModal = (props: SaveFileModalProps): JSX.Element => {
  const { open, onClose } = props;
  const { dataURLPreview, imageScale } = useAppSelector(
    state => state.canvasMeta
  );
  const { layerHeight, layerWidth } = useAppSelector(state => state.browser);
  const dispatch = useAppDispatch();

  const onSaveFileClick = () => {
    dispatch(setIsDownloading(true));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          maxWidth: "calc(100vw - 80px)",
          bgcolor: "background.paper",
          boxShadow: 12,
          borderRadius: 1,
          px: 4,
          py: 2,
          color: "var(--black)"
        }}>
        <Typography variant="h4" component="h2">
          Save Image
        </Typography>
        <Typography variant="subtitle1">
          Resolution: {~~(layerWidth * imageScale)} x{" "}
          {~~(layerHeight * imageScale)} px
        </Typography>
        <Box
          sx={{
            height: "fit-content",
            maxHeight: 404,
            border: "2px solid var(--teal-300)"
          }}>
          {dataURLPreview && (
            <img
              alt={""}
              src={dataURLPreview}
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          )}
        </Box>
        <Box
          sx={{
            paddingTop: 1
          }}>
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 0.5 }}>
            <Typography>Aspect ratio: </Typography>
            {[0.25, 0.5, 1, 1.25, 1.5, 2, 4].map(value => (
              <Button
                key={value}
                styleType={"default"}
                sx={{ width: "30px" }}
                selected={imageScale === value}
                onClick={() => {
                  dispatch(setImageScale(value));
                }}>
                {value}
              </Button>
            ))}
          </Box>
          <Box>
            <Button styleType={"default"} onClick={onSaveFileClick}>
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
