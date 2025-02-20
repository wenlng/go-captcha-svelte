<div align="center">
<img width="120" style="padding-top: 50px; margin: 0;" src="https://github.com/wenlng/git-assets/blob/master/go-captcha/gocaptcha_logo.svg?raw=true"/>
<h1 style="margin: 0; padding: 0">Go Captcha</h1>
<p>Behavior Captcha Of Svelte</p>

<a href="https://github.com/wenlng/go-captcha-svelte/releases"><img src="https://img.shields.io/github/v/release/wenlng/go-captcha-svelte.svg"/></a>
<a href="https://www.npmjs.com/package/go-captcha-svelte"><img src="https://img.shields.io/npm/v/go-captcha-svelte"/></a>
<a href="https://github.com/wenlng/go-captcha-svelte/blob/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg"/></a>
<a href="https://github.com/wenlng/go-captcha-svelte"><img src="https://img.shields.io/github/stars/wenlng/go-captcha-svelte.svg"/></a>
<a href="https://github.com/wenlng/go-captcha-svelte"><img src="https://img.shields.io/github/last-commit/wenlng/go-captcha-svelte.svg"/></a>

</div>

<br/>

> English | [中文](README_zh.md)

<br/>

<p> ⭐️ If it helps you, please give a star.</p>

<img src="https://github.com/wenlng/git-assets/blob/master/go-captcha/go-captcha-v2.jpg?raw=true" alt="Poster">


## Install
```shell
yarn add go-captcha-svelte
# or
npm install go-captcha-svelte
# or
pnpm install go-captcha-svelte
```

```ts
 import {Click, Rotate, Slide, SlideRegion, Button} from "go-captcha-svelte";
```

## Click Mode
```jsx
<Click
  config={{}}
  data={{}}
  events={{}}
  bind:this={domRef}
/>

<script>
  // call methods
  const domRef
  domRef.clear()
  domRef.refresh()
</script>
```


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
  iconSize?: number;
  dotSize?: number;
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
  confirm?: (dots: Array<ClickDot>, reset:() => void) => boolean;
}

// export component method
interface ExportMethods {
  reset: () => void,
  clear: () => void,
  refresh: () => void,
  close: () => void,
}
```

## Slide Mode
```jsx
<Slide
  config={{}}
  data={{}}
  events={{}}
  bind:this={domRef}
/>

<script>
  // call methods
  const domRef
  domRef.clear()
  domRef.refresh()
</script>
```

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
  iconSize?: number;
  scope ?: boolean;
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
  confirm?: (point: SlidePoint, reset:() => void) => boolean;
}

// export component method
interface ExportMethods {
  reset: () => void,
  clear: () => void,
  refresh: () => void,
  close: () => void,
}
```

## Drag-And-Drop Mode
```jsx
<SlideRegion
  config={{}}
  data={{}}
  events={{}}
  bind:this={domRef}
/>

<script>
  // call methods
  const domRef
  domRef.clear()
  domRef.refresh()
</script>
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
  iconSize?: number;
  scope ?: boolean;
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
  confirm?: (point: SlideRegionPoint, reset:() => void) => boolean;
}

// export component method
interface ExportMethods {
  reset: () => void,
  clear: () => void,
  refresh: () => void,
  close: () => void,
}
```

## Rotation Mode
```jsx
<Rotate
  config={{}}
  data={{}}
  events={{}}
  bind:this={domRef}
/>

<script>
  // call methods
  const domRef
  domRef.clear()
  domRef.refresh()
</script>
```


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
  iconSize?: number;
  scope ?: boolean;
}

// data = {}
interface RotateData {
  angle?: number;
  image: string;
  thumb: string;
  thumbSize: number;
}

// events = {}
interface RotateEvents {
  rotate?: (angle: number) => void;
  refresh?: () => void;
  close?: () => void;
  confirm?: (angle: number, reset:() => void) => boolean;
}

// export component method
interface ExportMethods {
  reset: () => void,
  clear: () => void,
  refresh: () => void,
  close: () => void,
}
```


## Button
```jsx
<Button />
```


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