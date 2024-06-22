/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

export interface ButtonConfig {
  width?: number;
  height?: number;
  verticalPadding?: number;
  horizontalPadding?: number;
}

export const defaultButtonConfig = ():ButtonConfig => ({
  width: 330,
  height: 44,
  verticalPadding: 12,
  horizontalPadding: 16,
})

export type ButtonType = "default" | "warn" | "error" | "success"