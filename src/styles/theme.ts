import { createTheme, responsiveFontSizes } from "@mui/material";

let theme = createTheme({
  palette: {
    primary: { main: "#758585", contrastText: "#070d14" },
    grey: {
      "600": "#757575"
    },
    text: {
      primary: "#070d14"
    }
  },
  components: {
    MuiSelect: {
      defaultProps: {
        size: "small"
      },
      styleOverrides: {
        select: {
          paddingBottom: "4px",
          paddingTop: "4px",
          paddingLeft: "8px"
        },
        root: {
          ":hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--teal-400)"
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "var(--teal-200)"
        },
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--teal-300)"
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition:
            "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0ms !important"
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: "2px 14px",
          "&.Mui-selected": {
            backgroundColor: "var(--yellow)"
          }
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        size: "small"
      }
    },
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
