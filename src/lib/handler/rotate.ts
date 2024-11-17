/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import type {RotateConfig, RotateData, RotateEvent} from "../types/rotate";
import {checkTargetFather} from "../helper/helper";
import {writable, get} from 'svelte/store';
import type {Writable} from 'svelte/store';

export function useHandler(
  data: RotateData,
  event: RotateEvent,
  config: RotateConfig,
  clearCbs: () => void
) {
  let state: Writable<{ dragLeft: number; thumbAngle: any }> = writable({dragLeft: 0, thumbAngle: data.angle || 0})
  let isFreeze: boolean = false

  let rootRef: HTMLElement
  let dragBlockRef: HTMLElement
  let dragBarRef: HTMLElement

  const updateState = () => {
    if(!isFreeze){
      state.set({dragLeft: 0, thumbAngle: data.angle || 0})
    }
  }

  const dragEvent = (e: Event|any) => {
    const touch = e.touches && e.touches[0];

    const offsetLeft = dragBlockRef.offsetLeft
    const width = dragBarRef.offsetWidth
    const blockWidth = dragBlockRef.offsetWidth
    const maxWidth = width - blockWidth
    const maxAngle = 360
    const p = (maxAngle - data.angle) / maxWidth

    let angle = 0
    let isMoving = false
    let tmpLeaveDragEvent: Event|any = null
    let startX = 0;
    let currentAngle = 0
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

      angle = data.angle + (left * p)
      if (left >= maxWidth) {
        currentAngle = maxAngle
        state.set({...curState, dragLeft: maxWidth, thumbAngle: currentAngle})
        return
      }

      if (left <= 0) {
        currentAngle = data.angle
        state.set({...curState, dragLeft: 0, thumbAngle: currentAngle})
        return
      }

      currentAngle = angle
      state.set({thumbAngle: angle, dragLeft: left})

      event.rotate && event.rotate(angle)

      e.cancelBubble = true
      e.preventDefault()
    }

    const upEvent = (e: Event|any) => {
      if (!checkTargetFather(dragBarRef, e)) {
        return
      }

      if (!isMoving) {
        return
      }

      isMoving = false
      clearEvent()

      if (currentAngle < 0) {
        return
      }

      event.confirm && event.confirm(parseInt(currentAngle.toString()), () => {
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

    const scope = config.scope
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
    state.set({dragLeft: 0, thumbAngle: data.angle || 0})
  }

  const clearData = () => {
    resetData()
    clearCbs && clearCbs()
  }

  const close = () => {
    event.close && event.close()
    resetData()
  }

  const refresh = () => {
    event.refresh && event.refresh()
    resetData()
  }


  const initRefs = (
    root: HTMLElement,
    dragBlock: HTMLElement,
    dragBar: HTMLElement
  ) => {
    rootRef = root
    dragBlockRef = dragBlock
    dragBarRef = dragBar
  }

  return {
    state,
    initRefs,
    updateState,
    dragEvent,
    closeEvent,
    refreshEvent,
    resetData,
    clearData,
    close,
    refresh,
  }
}
