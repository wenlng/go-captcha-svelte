/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import type {SlideConfig, SlideData, SlideEvent} from "../types/slide";
import {checkTargetFather} from "../helper/helper";
import {writable, get} from 'svelte/store';
import type {Writable} from 'svelte/store';

export function useHandler(
  data: Writable<SlideData> | any,
  event: Writable<SlideEvent> | any,
  config: Writable<SlideConfig> | any,
  clearCbs: () => void
) {
  let state: Writable<{ thumbLeft: number; thumbTop?: number; dragLeft: number }> = writable({dragLeft: 0, thumbLeft: get(data).thumbX || 0, thumbTop: get(data).thumbY || 0})
  let isFreeze: boolean = false

  let rootRef: HTMLElement
  let containerRef: HTMLElement
  let tileRef: HTMLElement
  let dragBlockRef: HTMLElement
  let dragBarRef: HTMLElement

  const unsubscribe = data.subscribe(() => {
    if(!isFreeze){
      state.set({...get(state), thumbLeft: (get(data).thumbX || 0), thumbTop: (get(data).thumbY || 0)})
    }
  })

  const dragEvent = (e: Event|any) => {
    if (!checkTargetFather(dragBarRef, e)) {
      return
    }

    const touch = e.touches && e.touches[0];
    const offsetLeft = dragBlockRef.offsetLeft
    const width = containerRef.offsetWidth
    const blockWidth = dragBlockRef.offsetWidth
    const maxWidth =width - blockWidth

    const tileWith  = tileRef.offsetWidth
    const tileOffsetLeft = tileRef.offsetLeft
    const containerMaxWidth = width - tileWith
    const tileMaxWith = width - (tileWith + tileOffsetLeft)
    const ratio = tileMaxWith / maxWidth

    let isMoving = false
    let tmpLeaveDragEvent: Event|any = null
    let startX = 0
    let currentThumbX = 0
    if (touch) {
      startX = touch.pageX - offsetLeft
    } else {
      startX = e.clientX - offsetLeft
    }

    const moveEvent = (e: Event|any) => {
      isMoving = true
      const mTouche = e.touches && e.touches[0];
      const curState = get(state)

      let left = 0;
      if (mTouche) {
        left = mTouche.pageX - startX
      } else {
        left = e.clientX - startX
      }

      const ctX = tileOffsetLeft + (left * ratio)
      if (left >= maxWidth) {
        currentThumbX = containerMaxWidth
        state.set({...curState, dragLeft: maxWidth, thumbLeft: currentThumbX})
        return
      }

      if (left <= 0) {
        currentThumbX = tileOffsetLeft
        state.set({...curState, dragLeft: 0, thumbLeft: tileOffsetLeft})
        return
      }

      currentThumbX =  ctX
      state.set({...curState, thumbLeft: currentThumbX, dragLeft: left})

      const ec = get(event)
      ec.move && ec.move(currentThumbX, curState.thumbTop || 0)

      e.cancelBubble = true
      e.preventDefault()
    }

    const upEvent = (e: Event|any) => {
      if (!checkTargetFather(dragBarRef, e)) {
        return
      }

      clearEvent()
      if (!isMoving) {
        return
      }

      isMoving = false

      if (currentThumbX < 0) {
        return
      }

      const ec = get(event)
      ec.confirm && ec.confirm({x: parseInt(currentThumbX.toString()), y: get(state).thumbTop || 0}, () => {
        resetData()
      })

      e.cancelBubble = true
      e.preventDefault()
    }

    const leaveDragBlockEvent = (e: Event|any) => {
      tmpLeaveDragEvent = e
    }

    const enterDragBlockEvent = () => {
      tmpLeaveDragEvent = null
    }

    const leaveUpEvent = (_: Event|any) => {
      if(!tmpLeaveDragEvent) {
        return
      }

      upEvent(tmpLeaveDragEvent)
      clearEvent()
    }

    const scope = get(config).scope
    const dragDom = scope ? rootRef : dragBarRef
    const scopeDom = scope ? rootRef : document.body

    const clearEvent = () => {
      scopeDom.removeEventListener("mousemove", moveEvent, false)
      // @ts-ignore
      scopeDom.removeEventListener("touchmove", moveEvent, { passive: false })

      dragDom.removeEventListener( "mouseup", upEvent, false)
      dragDom.removeEventListener( "mouseenter", enterDragBlockEvent, false)
      dragDom.removeEventListener( "mouseleave", leaveDragBlockEvent, false)
      dragDom.removeEventListener("touchend", upEvent, false)

      scopeDom.removeEventListener("mouseleave", upEvent, false)
      scopeDom.removeEventListener("mouseup", leaveUpEvent, false)
      isFreeze = false
    }
    isFreeze = true

    scopeDom.addEventListener("mousemove", moveEvent, false)
    scopeDom.addEventListener("touchmove", moveEvent, { passive: false })

    dragDom.addEventListener( "mouseup", upEvent, false)
    dragDom.addEventListener( "mouseenter", enterDragBlockEvent, false)
    dragDom.addEventListener( "mouseleave", leaveDragBlockEvent, false)
    dragDom.addEventListener("touchend", upEvent, false)

    scopeDom.addEventListener("mouseleave", upEvent, false)
    scopeDom.addEventListener("mouseup", leaveUpEvent, false)
  }

  const closeEvent = (e: Event|any) => {
    close()
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const refreshEvent = (e: Event|any) => {
    refresh()
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const resetData = () => {
    state.set({dragLeft: 0, thumbLeft: get(data).thumbX || 0, thumbTop: (get(data).thumbY || 0)})
  }

  const clearData = () => {
    resetData()
    clearCbs && clearCbs()
  }

  const close = () => {
    const ec = get(event)
    ec.close && ec.close()
    resetData()
  }

  const refresh = () => {
    const ec = get(event)
    ec.refresh && ec.refresh()
    resetData()
  }

  const initRefs = (
    root: HTMLElement,
    container: HTMLElement,
    tile: HTMLElement,
    dragBlock: HTMLElement,
    dragBar: HTMLElement
  ) => {
    rootRef = root
    containerRef = container
    tileRef = tile
    dragBlockRef = dragBlock
    dragBarRef = dragBar
  }

  return {
    state,
    initRefs,
    unsubscribe,
    dragEvent,
    closeEvent,
    refreshEvent,
    resetData,
    clearData,
    close,
    refresh,
  }
}
