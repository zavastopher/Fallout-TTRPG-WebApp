import CSS from "csstype";
import { ThemeConfig, StylesConfig } from "react-select";
import { User, UserOption, ItemOption } from "./types";

export const ddVars = {
  blackTransColor: "rgba(0, 0, 0, .75)",
  greenTransColor: "rgba(0, 128, 0, .75)",
  dropdownFontSize: "16px",
};

export const ddTheme: ThemeConfig = (theme) => ({
  ...theme,
  fontSize: "16px",
  colors: {
    ...theme.colors,
    primary25: ddVars.greenTransColor, // change Background color of options on hover
    primary: ddVars.greenTransColor, // change the Background color of the selected option
    neutral0: ddVars.blackTransColor,
    neutral5: "black",
    neutral10: "black",
    neutral20: "black",
    neutral30: ddVars.greenTransColor, // Border Hover Color
    neutral40: "green", // Arrow Hover Color
    neutral50: "green", // Select text
    neutral60: ddVars.greenTransColor, //
    neutral70: ddVars.greenTransColor, //
    neutral80: ddVars.greenTransColor, //
    neutral90: ddVars.greenTransColor, //
  },
});

export const ddStyles: StylesConfig<ItemOption> = {
  control: (provided) => ({
    ...provided,
    fontSize: ddVars.dropdownFontSize,
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "rgb(192, 247, 168)" : "white",
  }),
  menu: (base) => ({
    ...base,
    fontSize: ddVars.dropdownFontSize,
    position: "absolute",
    right: "0",
    overflow: "visible",
  }),
  menuList: (base) => ({
    ...base,
    position: "absolute",
    bottom: "46px",
    backgroundColor: ddVars.blackTransColor,
    width: "inherit",
  }),
};

export const ddUserStyles: StylesConfig<UserOption | UserOption[]> = {
  control: (provided) => ({
    ...provided,
    fontSize: ddVars.dropdownFontSize,
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "rgb(192, 247, 168)" : "white",
  }),
  menu: (base) => ({
    ...base,
    fontSize: ddVars.dropdownFontSize,
    position: "absolute",
    right: "0",
    overflow: "visible",
  }),
  menuList: (base) => ({
    ...base,
    position: "absolute",
    bottom: "46px",
    backgroundColor: ddVars.blackTransColor,
    width: "inherit",
  }),
};

export const userDDStyles: StylesConfig<UserOption> = {
  control: (provided) => ({
    ...provided,
    fontSize: ddVars.dropdownFontSize,
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "rgb(192, 247, 168)" : "white",
  }),
  menu: (base) => ({
    ...base,
    fontSize: ddVars.dropdownFontSize,
  }),
};

export type DropdownStyles = {
  ddCSS: CSS.Properties;
  ddTheme: ThemeConfig;
  ddStyles: StylesConfig;
};
