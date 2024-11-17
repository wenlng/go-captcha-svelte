<script lang="ts">
  import { onMount } from 'svelte';

  import type {SlideRegionConfig, SlideRegionData, SlideRegionEvent} from "../types/slide-region";
  import {defaultRegionConfig} from "../types/slide-region";
  import {useHandler} from "../handler/slide-region";

  import LoadingIcon from "../assets/icons/LoadingIcon.svelte";
  import CloseIcon from "../assets/icons/CloseIcon.svelte";
  import RefreshIcon from "../assets/icons/RefreshIcon.svelte";
  import {mergeTo} from "../helper/helper";

  export let config:SlideRegionConfig = defaultRegionConfig()
  export let data:SlideRegionData = { thumbX: 0, thumbY: 0, thumbWidth: 0, thumbHeight: 0, image: "", thumb: "" }
  export let events:SlideRegionEvent = {}

  $: watchConfig(config)
  function watchConfig(c: SlideRegionConfig) {
    mergeTo(defaultRegionConfig(), c)
  }

  $: watchData(data)
  function watchData(c: SlideRegionData) {
    mergeTo({ thumbX: 0, thumbY: 0, thumbWidth: 0, thumbHeight: 0, image: "", thumb: "" }, c)
    handler?.updateState()
  }

  const handler = useHandler(data, events, config, () => {
    data.thumbX = 0
    data.thumbY = 0
    data.thumbWidth = 0
    data.thumbHeight = 0
    data.image = ""
    data.thumb = ""
  })

  export const clear = handler.clearData
  export const reset = handler.resetData
  export const close = handler.close
  export const refresh = handler.refresh

  const state = handler.state

  let rootRef: HTMLElement
  let containerRef: HTMLElement
  let tileRef: HTMLElement

  onMount(() => {
    handler.initRefs(rootRef, containerRef, tileRef)
    if (tileRef) {
      tileRef.addEventListener('dragstart', (event: any) => event.preventDefault());
    }
  })

  $: width = (config.width || 0) + ( (config.horizontalPadding || 0) * 2) + (config.showTheme ? 2 : 0)
  $: hasDisplayWrapperState = (config.width || 0) > 0 || (config.height || 0) > 0
  $: hasDisplayImageState = data.image != '' || data.thumb != ''

  $: wrapperClass = config.showTheme ? 'gc-theme' : ''
  $: wrapperStyle = `width: ${width}px; padding: ${config.verticalPadding || 0}px ${config.horizontalPadding || 0}px; display: ${hasDisplayWrapperState ? 'block' : 'none'}`
  $: bodyStyle = `width: ${config.width}px; height: ${config.height}px;`
  $: imageStyle = `width: ${config.width}px; height: ${config.height}px; display: ${hasDisplayImageState ? 'block' : 'none'}`
  $: thumbStyle = `width: ${data.thumbWidth}px; height: ${data.thumbHeight}px; top: ${$state.y}px; left: ${$state.x}px; display: ${hasDisplayImageState ? 'block' : 'none'}`
</script>

<div
  class={`go-captcha gc-wrapper ${wrapperClass}`}
  style={wrapperStyle}
  bind:this={rootRef}
>
  <div class="gc-header" class:gc-header2={true}>
    <span>{ config.title }</span>
  </div>
  <div
    class="gc-body"
    bind:this={containerRef}
    style={bodyStyle}
  >
    <div class="gc-loading">
      <LoadingIcon />
    </div>
    <img class={`gc-picture ${data.image === '' ? 'gc-hide' : ''}`} style={imageStyle} src={data.image} alt="..."/>
    <div
      class:gc-tile={true}
      bind:this={tileRef}
      style={thumbStyle}
      on:mousedown={handler.dragEvent}
      on:touchstart={handler.dragEvent}
    >
      <img
        class={`${data.thumb === '' ? 'gc-hide' : ''}`}
        src={data.thumb}
        alt=""
      />
    </div>
  </div>
  <div class="gc-footer">
    <div class="gc-icon-block">
      <CloseIcon
        width={config.iconSize}
        height={config.iconSize}
        clickEvent={handler.closeEvent}
      />
      <RefreshIcon
        width={config.iconSize}
        height={config.iconSize}
        clickEvent={handler.refreshEvent}
      />
    </div>
  </div>
</div>

<style lang="less">
  .go-captcha {
    .gc-header2 {
      text-align: center;
    }

    .gc-tile {
      position: absolute;
      z-index: 2;
      cursor: pointer;

      img {
        display: block;
        cursor: pointer;
        width: 100%;
        height: 100%;
      }
    }
  }
</style>