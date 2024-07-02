import { ThemeConfig } from "react-select";

export const selectTheme: ThemeConfig = (theme) => ({
  ...theme,
  borderRadius:  0,
  colors: {
    ...theme.colors,
    primary: '#eb9d7a',
    primary25: '#f8ded3'
  }
})