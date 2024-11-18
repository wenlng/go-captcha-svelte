<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import type {RotateConfig, RotateData, RotateEvent} from "../types/rotate";
  import {defaultConfig, defaultRotateData} from "../types/rotate";
  import {useHandler} from "../handler/rotate";

  import LoadingIcon from "../assets/icons/LoadingIcon.svelte";
  import CloseIcon from "../assets/icons/CloseIcon.svelte";
  import RefreshIcon from "../assets/icons/RefreshIcon.svelte";
  import ArrowsIcon from "../assets/icons/ArrowsIcon.svelte";
  import {mergeTo} from "../helper/helper";
  import {writable} from "svelte/store";
  import type {Writable} from 'svelte/store';

  export let config:RotateConfig = defaultConfig()
  export let data:RotateData = defaultRotateData()
  export let events:RotateEvent = {}

  const localConfig: Writable<RotateConfig> = writable({...config})
  $: watchConfig(config)
  function watchConfig(c: RotateConfig) {
    mergeTo(defaultConfig(), c)
    localConfig.set(c)
  }

  const localData: Writable<RotateData> = writable({...data})
  $: watchData(data)
  function watchData(c: RotateData) {
    mergeTo(defaultRotateData(), c)
    localData.set(c)
  }

  const localEvents: Writable<RotateEvent> = writable({...events})
  $: watchEvents(events)
  function watchEvents(c: RotateEvent) {
    localEvents.set(c)
  }

  let rootRef: HTMLElement
  let dragBarRef: HTMLElement
  let dragBlockRef: HTMLElement

  const handler = useHandler(localData, localEvents, localConfig, () => {
    localData.set({...defaultRotateData()})
    data.angle = 0
    data.image = ""
    data.thumb = ""
  })

  export const clear = handler.clearData
  export const reset = handler.resetData
  export const close = handler.close
  export const refresh = handler.refresh

  const state = handler.state

  const fn = (event: any) => event.preventDefault()
  onMount(() => {
    handler.initRefs(rootRef, dragBlockRef, dragBarRef)
    dragBlockRef && dragBlockRef.addEventListener('dragstart', fn);
  })

  onDestroy(() => {
    handler.unsubscribe && handler.unsubscribe()
    dragBlockRef && dragBlockRef.removeEventListener('dragstart', fn);
  })

  $: width = (config.width || 0) + ( (config.horizontalPadding || 0) * 2) + (config.showTheme ? 2 : 0)
  $: size = (config.size || 0) > 0 ? config.size : defaultConfig().size
  $: hasDisplayWrapperState = (config.width || 0) > 0 || (config.height || 0) > 0
  $: hasDisplayImageState = data.image != '' || data.thumb != ''

  $: wrapperClass = config.showTheme ? 'gc-theme' : ''
  $: wrapperStyle = `width: ${width}px; padding: ${config.verticalPadding || 0}px ${config.horizontalPadding || 0}px; display: ${hasDisplayWrapperState ? 'block' : 'none'}`
  $: bodyStyle = `width: ${config.width}px; height: ${config.height}px;`
  $: bodyBlockStyle = `width: ${size}px, height: ${size}px`
  $: imageStyle = `width: ${config.size}px; height: ${config.size}px`
  $: displayStyle = `display: ${hasDisplayImageState ? 'block' : 'none'}`
  $: thumbStyle = `transform: rotate(${$state.thumbAngle}deg); visibility: ${hasDisplayImageState ? 'visible' : 'hidden'}`
  $: dragStyle = `left: ${$state.dragLeft}px`

</script>

<div
  class={`go-captcha gc-wrapper ${wrapperClass}`}
  style={wrapperStyle}
  bind:this={rootRef}
>
  <div class="gc-header">
    <span>{ config.title }</span>
    <div class="gc-icon-block" class:gc-icon-block2={true}>
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
  <div
    class="gc-body"
    class:gc-rotate-body={true}
    style={bodyStyle}
  >
    <div class="gc-body-inner" style={bodyBlockStyle}>
      <div class="gc-loading">
        <LoadingIcon />
      </div>
      <div
        class="gc-picture"
        class:gc-rotate-picture={true}
        style={imageStyle}
      >
        <img
          class={`${data.image === '' ? 'gc-hide' : ''}`}
          style="{displayStyle}"
          src={data.image}
          alt=""
        />
        <div class="gc-round"></div>
      </div>
      <div class="gc-thumb" class:gc-rotate-thumb={true}>
        <div
          class:gc-rotate-thumb-block={true}
          style={thumbStyle}
        >
          <img
            class={`${data.thumb === '' ? 'gc-hide' : ''}`}
            src={data.thumb}
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
  <div class="gc-footer">
    <div class="gc-drag-slide-bar" bind:this={dragBarRef}>
      <div class="gc-drag-line"></div>
      <div
        class={`gc-drag-block ${!hasDisplayImageState && "disabled"}`}
        bind:this={dragBlockRef}
        on:mousedown={handler.dragEvent}
        style={dragStyle}
      >
        <div class="drag-block-inline" on:touchstart={handler.dragEvent}>
          <ArrowsIcon />
        </div>
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

    .gc-body-inner {
      border-radius: 100%;
    }
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