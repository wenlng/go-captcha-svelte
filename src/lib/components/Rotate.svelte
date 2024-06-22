<script lang="ts">
  import { onMount } from 'svelte';

  import type {RotateConfig, RotateData, RotateEvent} from "../types/rotate";
  import {defaultConfig} from "../types/rotate";
  import {useHandler} from "../handler/rotate";

  import LoadingIcon from "../assets/icons/LoadingIcon.svelte";
  import CloseIcon from "../assets/icons/CloseIcon.svelte";
  import RefreshIcon from "../assets/icons/RefreshIcon.svelte";
  import ArrowsIcon from "../assets/icons/ArrowsIcon.svelte";

  export let config:RotateConfig = defaultConfig()
  export let data:RotateData = { angle: 0, image: "", thumb: "" }
  export let events:RotateEvent = {}

  let dragBarRef: HTMLElement
  let dragBlockRef: HTMLElement

  config = {...defaultConfig(), ...config}

  const handler = useHandler(data, events)
  const state = handler.state

  const hPadding = config.horizontalPadding || 0
  const vPadding = config.verticalPadding || 0
  const width = (config.width || 0) + ( hPadding * 2) + (config.showTheme ? 2 : 0)

  onMount(() => {
    handler.initRefs(dragBlockRef, dragBarRef)
    if (dragBlockRef) {
      dragBlockRef.addEventListener('dragstart', (event: any) => event.preventDefault());
    }
  })

  $: wrapperClass = config.showTheme ? 'gc-theme' : ''
  $: wrapperStyle = `width: ${width}px; padding: ${vPadding}px ${hPadding}px;`
  $: imageStyle = `width: ${config.size}px; height: ${config.size}px`
  $: thumbStyle = `transform: rotate(${$state.thumbAngle}deg)`
  $: dragStyle = `left: ${$state.dragLeft}px`

</script>

<div class={`go-captcha gc-wrapper ${wrapperClass}`} style={wrapperStyle}>
  <div class="gc-header">
    <span>{ config.title }</span>
    <div class="gc-icon-block" class:gc-icon-block2={true}>
      <CloseIcon width={22} height={22} clickEvent={handler.closeEvent}/>
      <RefreshIcon width={22} height={22} clickEvent={handler.refreshEvent}/>
    </div>
  </div>
  <div class="gc-body" class:gc-rotate-body={true} style={imageStyle}>
    <div class="gc-loading">
      <LoadingIcon />
    </div>
    <div class="gc-picture" class:gc-rotate-picture={true} style={imageStyle}>
      <img class={`${data.image === '' ? 'gc-hide' : ''}`} src={data.image} alt="..." />
      <div class="gc-round"></div>
    </div>
    <div class="gc-thumb" class:gc-rotate-thumb={true}>
      <div class:gc-rotate-thumb-block={true} style={thumbStyle}>
        <img class={`${data.thumb === '' ? 'gc-hide' : ''}`} src={data.thumb} alt="..." />
      </div>
    </div>
  </div>
  <div class="gc-footer">
    <div class="gc-drag-slide-bar" bind:this={dragBarRef} on:mousedown={handler.dragEvent}>
      <div class="gc-drag-line"></div>
      <div class="gc-drag-block" bind:this={dragBlockRef} on:touchstart={handler.dragEvent} style={dragStyle}>
        <ArrowsIcon />
      </div>
    </div>
  </div>
</div>

<style lang="less">
.go-captcha {
  .gc-rotate-body {
    background: transparent !important;
    display: flex;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    justify-content: center;
    align-items: center;
    margin: 10px auto 0;
  }

  .gc-rotate-picture {
    position: relative;
    max-width: 100%;
    max-height: 100%;
    z-index: 2;
    border-radius: 100%;
    overflow: hidden;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-width: 100%;
      max-height: 100%;
    }

    .gc-round {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 100%;
      z-index: 2;
      border: 6px solid #e0e0e0;
      border-color: var(--go-captcha-theme-round-color);
    }
  }

  .gc-rotate-thumb {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  .gc-rotate-thumb-block {
    width: 100%;
    height: 100%;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>