# Go Captcha Svelte Package

<p> ⭐️ If it helps you, please give a star.</p>
<img src="http://47.104.180.148/go-captcha/go-captcha-v2.jpg" alt="Poster">

<br/>

## Install
```shell
yarn add go-captcha-svelte
# or
npm install go-captcha-svelte
# or
pnpm install go-captcha-svelte
```


## 🖖 Click Mode Captcha
```jsx
import {Click} from 'go-captcha-svelte';

<Click
  config={{}}
  data={{}}
  events={{}}
/>
```

### Parameter Reference
```ts
// config = {}
interface ClickConfig {
  width?: number;
  height?: number;
  thumbWidth?: number;
  thumbHeight?: number;
  verticalPadding?: number;
  horizontalPadding?: number;
  showTheme?: boolean;
  title?: string;
  buttonText?: string;
}

// data = {}
interface ClickData {
  image: string;
  thumb: string;
}

// events = {}
interface ClickEvents {
  click?: (x: number, y: number) => void;
  refresh?: () => void;
  close?: () => void;
  confirm?: (dots: Array<ClickDot>) => boolean;
}
```

## 🖖 Slide Mode Captcha
```jsx
import {Slide, SlideRegion} from 'go-captcha-svelte';

<Slide
  config={{}}
  data={{}}
  events={{}}
/>

<SlideRegion
  config={{}}
  data={{}}
  events={{}}
/>
```
### Parameter Reference
```ts
// config = {}
interface SlideConfig {
  width?: number;
  height?: number;
  thumbWidth?: number;
  thumbHeight?: number;
  verticalPadding?: number;
  horizontalPadding?: number;
  showTheme?: boolean;
  title?: string;
}

// data = {}
interface SlideData {
  thumbX: number;
  thumbY: number;
  thumbWidth: number;
  thumbHeight: number;
  image: string;
  thumb: string;
}

// events = {}
interface SlideEvents {
  move?: (x: number, y: number) => void;
  refresh?: () => void;
  close?: () => void;
  confirm?: (point: SlidePoint) => boolean;
}
```

```ts
// config = {}
interface SlideRegionConfig {
  width?: number;
  height?: number;
  thumbWidth?: number;
  thumbHeight?: number;
  verticalPadding?: number;
  horizontalPadding?: number;
  showTheme?: boolean;
  title?: string;
}

// data = {}
interface SlideRegionData {
  thumbX: number;
  thumbY: number;
  thumbWidth: number;
  thumbHeight: number;
  image: string;
  thumb: string;
}

// events = {}
interface SlideRegionEvents {
  move?: (x: number, y: number) => void;
  refresh?: () => void;
  close?: () => void;
  confirm?: (point: SlideRegionPoint) => boolean;
}
```

## 🖖 Rotate Mode Captcha
```jsx
import {Rotate} from 'go-captcha-svelte';

<Rotate
  config={{}}
  data={{}}
  events={{}}
/>
```

### Parameter Reference
```ts
// config = {}
interface RotateConfig {
  width?: number;
  height?: number;
  thumbWidth?: number;
  thumbHeight?: number;
  verticalPadding?: number;
  horizontalPadding?: number;
  showTheme?: boolean;
  title?: string;
}

// data = {}
interface RotateData {
  angle: number;
  image: string;
  thumb: string;
}

// events = {}
interface RotateEvents {
  rotate?: (angle: number) => void;
  refresh?: () => void;
  close?: () => void;
  confirm?: (angle: number) => boolean;
}
```


## 🖖 Button
```jsx
import {Button} from 'go-captcha-svelte';

<Button />
```

### Parameter Reference
```ts
interface _ {
  config?: ButtonConfig;
  clickEvent?: () => void;
  disabled?: boolean;
  type?: "default" | "warn" | "error" | "success";
  title?: string;
}

export interface ButtonConfig {
  width?: number;
  height?: number;
  verticalPadding?: number;
  horizontalPadding?: number;
}
```

<br/>

## 🍹 Buy me a coffee
<div>
<a href="http://witkeycode.com/sponsor" target="_blank"><img src="http://47.104.180.148/payment-code/wxpay.png" alt="Buy Me A Coffee" style="width: 217px !important;" ></a>
<a href="http://witkeycode.com/sponsor" target="_blank"><img src="http://47.104.180.148/payment-code/alipay.png" alt="Buy Me A Coffee" style="width: 217px !important;" ></a>
</div>

<br/>
