/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import type {RotateData, RotateEvent} from "../types/rotate";
import {checkTargetFather} from "../helper/helper";
import {writable, get} from 'svelte/store';
import type {Writable} from 'svelte/store';

export function useHandler(
  data: RotateData,
  event: RotateEvent,
) {
  let dragBlockRef: HTMLElement
  let dragBarRef: HTMLElement

  let state: Writable<{ dragLeft: number; thumbAngle: any }> = writable({dragLeft: 0, thumbAngle: data.angle || 0})

  const clear = () => {
    state.set({dragLeft: 0, thumbAngle: data.angle || 0})
  }

  const dragEvent = (e: Event|any) => {
    const touch = e.touches && e.touches[0];

    const offsetLeft = dragBlockRef.offsetLeft
    const width = dragBarRef.offsetWidth
    const blockWidth = dragBlockRef.offsetWidth
    const maxWidth = width - blockWidth
    const p = 360 / maxWidth

    let angle = 0
    let isMoving = false
    let startX = 0;
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
      if (left >= maxWidth) {
        state.set({...curState, dragLeft: maxWidth})
        return
      }

      if (left <= 0) {
        state.set({...curState, dragLeft: 0})
        return
      }

      angle = (left * p)
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

      dragBarRef.removeEventListener("mousemove", moveEvent, false)
      // @ts-ignore
      dragBarRef.removeEventListener("touchmove", moveEvent, { passive: false })

      dragBarRef.removeEventListener( "mouseup", upEvent, false)
      dragBarRef.removeEventListener( "mouseout", upEvent, false)
      dragBarRef.removeEventListener("touchend", upEvent, false)

      isMoving = false
      event.confirm && event.confirm(parseInt(angle.toString()), () => {
        clear()
      })

      e.cancelBubble = true
      e.preventDefault()
    }

    dragBarRef.addEventListener("mousemove", moveEvent, false)
    dragBarRef.addEventListener("touchmove", moveEvent, { passive: false })
    dragBarRef.addEventListener( "mouseup", upEvent, false)
    dragBarRef.addEventListener( "mouseout", upEvent, false)
    dragBarRef.addEventListener("touchend", upEvent, false)
  }

  const closeEvent = (e: Event|any) => {
    event && event.close && event.close()
    clear()
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const refreshEvent = (e: Event|any) => {
    event && event.refresh && event.refresh()
    clear()
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const initRefs = (dragBlock: HTMLElement, dragBar: HTMLElement) => {
    dragBlockRef = dragBlock
    dragBarRef = dragBar
  }

  return {
    state,
    initRefs,
    dragEvent,
    closeEvent,
    refreshEvent,
  }
}
