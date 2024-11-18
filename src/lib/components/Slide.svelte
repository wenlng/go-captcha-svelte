<script lang="ts">
  import {onDestroy, onMount} from 'svelte';

  import type {SlideConfig, SlideData, SlideEvent} from "../types/slide";
  import {defaultConfig, defaultSlideData} from "../types/slide";
  import {useHandler} from "../handler/slide";

  import LoadingIcon from "../assets/icons/LoadingIcon.svelte";
  import CloseIcon from "../assets/icons/CloseIcon.svelte";
  import RefreshIcon from "../assets/icons/RefreshIcon.svelte";
  import ArrowsIcon from "../assets/icons/ArrowsIcon.svelte";
  import {mergeTo} from "../helper/helper";
  import {writable} from "svelte/store";
  import type {Writable} from 'svelte/store';

  export let config:SlideConfig = defaultConfig()
  export let data:SlideData = defaultSlideData()
  export let events:SlideEvent = {}

  const localConfig: Writable<SlideConfig> = writable({...config})
  $: watchConfig(config)
  function watchConfig(c: SlideConfig) {
    mergeTo(defaultConfig(), c)
    localConfig.set(c)
  }

  const localData: Writable<SlideData> = writable({...data})
  $: watchData(data)
  function watchData(c: SlideData) {
    mergeTo(defaultSlideData(), c)
    localData.set(c)
  }

  const localEvents: Writable<SlideEvent> = writable({...events})
  $: watchEvents(events)
  function watchEvents(c: SlideEvent) {
    localEvents.set(c)
  }

  let rootRef: HTMLElement
  let dragBarRef: HTMLElement
  let dragBlockRef: HTMLElement
  let containerRef: HTMLElement
  let tileRef: HTMLElement

  const handler = useHandler(localData, localEvents, localConfig, () => {
    localData.set({...defaultSlideData()})
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

  const fn = (event: any) => event.preventDefault()
  onMount(() => {
    handler.initRefs(rootRef, containerRef, tileRef, dragBlockRef, dragBarRef)
    dragBlockRef && dragBlockRef.addEventListener('dragstart', fn);
  })

  onDestroy(() => {
    handler.unsubscribe && handler.unsubscribe()
    dragBlockRef && dragBlockRef.removeEventListener('dragstart', fn);
  })

  $: width = (config.width || 0) + ( (config.horizontalPadding || 0) * 2) + (config.showTheme ? 2 : 0)
  $: hasDisplayWrapperState = (config.width || 0) > 0 || (config.height || 0) > 0
  $: hasDisplayImageState = data.image != '' || data.thumb != ''

  $: wrapperClass = config.showTheme ? 'gc-theme' : ''
  $: wrapperStyle = `width: ${width}px; padding: ${config.verticalPadding || 0}px ${config.horizontalPadding || 0}px; display: ${hasDisplayWrapperState ? 'block' : 'none'}`
  $: bodyStyle = `width: ${config.width}px; height: ${config.height}px;`
  $: imageStyle = `width: ${config.width}px; height: ${config.height}px; display: ${hasDisplayImageState ? 'block' : 'none'}`
  $: thumbStyle = `width: ${data.thumbWidth}px; height: ${data.thumbHeight}px; top: ${data.thumbY}px; left: ${$state.thumbLeft}px; display: ${hasDisplayImageState ? 'block' : 'none'}`
  $: dragStyle = `left: ${$state.dragLeft}px`
</script>

<div
  class={`go-captcha gc-wrapper ${wrapperClass}`}
  style={wrapperStyle}
  bind:this={rootRef}
>
  <div class="gc-header">
    <span>{ config.title }</span>
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
  <div class="gc-body" bind:this={containerRef} style={bodyStyle}>
    <div class="gc-loading">
      <LoadingIcon />
    </div>
    <img
      class={`gc-picture ${data.image === '' ? 'gc-hide' : ''}`}
      style={imageStyle}
      src={data.image}
      alt=""
    />
    <div
      class:gc-tile={true}
      bind:this={tileRef}
      style={thumbStyle}
    >
      <img
        class={`${data.thumb === '' ? 'gc-hide' : ''}`}
        src={data.thumb}
        alt=""
      />
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