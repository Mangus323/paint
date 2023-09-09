import { createTheme, responsiveFontSizes } from "@mui/material";

let theme = createTheme({
  palette: {
    primary: { main: "#758585", contrastText: "#070d14" },
    grey: {
      "600": "#757575"
    }
  },
  components: {
    MuiSwitch: {
      defaultProps: {
        size: "small"
      }
    },
    MuiSlider: {
      defaultProps: {
        size: "small"
      },
      styleOverrides: {
        thumb: {
          ":hover": {
            boxShadow: "0 0 0 6px rgba(117, 133, 133, 0.16)"
          },
          ":active": {
            boxShadow: "0 0 0 8px rgba(117, 133, 133, 0.16)"
          }
        }
      }
    }
  },
  typography: {
    fontSize: 11
  }
});
theme = responsiveFontSizes(theme);
export { theme };
