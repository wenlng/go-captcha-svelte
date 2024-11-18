<script lang="ts">
  import type {ClickConfig, ClickEvent, ClickData} from  "../types/click";
  import {defaultConfig, defaultData} from "../types/click";
  import {useHandler} from "../handler/click";

  import LoadingIcon from "../assets/icons/LoadingIcon.svelte";
  import CloseIcon from "../assets/icons/CloseIcon.svelte";
  import RefreshIcon from "../assets/icons/RefreshIcon.svelte";
  import {mergeTo} from "../helper/helper";
  import {writable, get} from "svelte/store";
  import type {Writable} from 'svelte/store';

  export let config:ClickConfig = defaultConfig()
  export let data:ClickData = defaultData()
  export let events:ClickEvent = {}

  const localConfig: Writable<ClickConfig> = writable({...config})
  $: watchConfig(config)
  function watchConfig(c: ClickConfig) {
    mergeTo(defaultConfig(), c)
    localConfig.set(c)
  }

  const localData: Writable<ClickData> = writable({...data})
  $: watchData(data)
  function watchData(c: ClickData) {
    mergeTo(defaultData(), c)
    localData.set(c)
  }

  const localEvents: Writable<ClickEvent> = writable({...events})
  $: watchEvents(events)
  function watchEvents(c: ClickEvent) {
    localEvents.set(c)
  }

  const handler = useHandler(localData, localEvents, () => {
    localData.set({...defaultData()})
    data.thumb = ''
    data.image = ''
  })

  export const clear = handler.clearData
  export const reset = handler.resetData
  export const close = handler.close
  export const refresh = handler.refresh

  const dots = handler.dots

  $: width = (config.width || 0) + ( (config.horizontalPadding || 0) * 2) + (config.showTheme ? 2 : 0)
  $: hasDisplayWrapperState = (config.width || 0) > 0 || (config.height || 0) > 0
  $: hasDisplayImageState = data.image != '' || data.thumb != ''

  $: wrapperClass = config.showTheme ? 'gc-theme' : ''
  $: wrapperStyle = `width: ${width}px; padding: ${config.verticalPadding || 0}px ${config.horizontalPadding || 0}px; display: ${hasDisplayWrapperState ? 'block' : 'none'}`
  $: bodyStyle = `width: ${config.width}px; height: ${config.height}px;`
  $: imageStyle = `width: ${config.width}px; height: ${config.height}px; display: ${hasDisplayImageState ? 'block' : 'none'}`
  $: thumbStyle = `width: ${config.thumbWidth}px; height: ${config.thumbHeight}px;  display: ${hasDisplayImageState ? 'block' : 'none'}`
</script>

<div class={`go-captcha gc-wrapper ${wrapperClass}`} style={wrapperStyle} >
  <div class="gc-header">
    <span>{ config.title }</span>
    <img
      class={data.thumb === '' ? 'gc-hide' : ''}
      style={thumbStyle}
      src={data.thumb}
      alt=""
    />
  </div>
  <div class="gc-body" style={bodyStyle}>
    <div class="gc-loading">
      <LoadingIcon />
    </div>
    <img
      style={imageStyle}
      class={`gc-picture ${data.image === '' ? 'gc-hide' : ''}`}
      src={data.image}
      alt=""
      on:click={handler.clickEvent}
    />
    <div class:gc-dots={true}>
      {#each $dots as dot}
      <div
        class:gc-dot={true}
        style={`top: ${(dot.y - ((config.dotSize || 1)/2)-1)}px; left: ${(dot.x - ((config.dotSize || 1)/2)-1)}px`}
      >{dot.index}</div>
      {/each}
    </div>
  </div>
  <div class="gc-footer">
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
    <div class="gc-button-block">
      <button class={!hasDisplayImageState && "disabled"} on:click={handler.confirmEvent}>{ config.buttonText }</button>
    </div>
  </div>
</div>

<style lang="less">
  .go-captcha {
    .gc-icon-block2 {
      flex: 1;
    }

    .gc-dots{
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      .gc-dot {
        position: absolute;
        z-index: 2;
        width: 22px;
        height: 22px;
        color: #cedffe;
        background: #3e7cff;
        border: 3px solid #f7f9fb;
        display:-webkit-box;
        display:-webkit-flex;
        display:-ms-flexbox;
        display:flex;
        -webkit-box-align:center;
        -webkit-align-items:center;
        -ms-flex-align:center;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        cursor: default;
      }
    }
  }
</style>