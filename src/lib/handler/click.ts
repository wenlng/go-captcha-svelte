/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import type {ClickData, ClickDot, ClickEvent} from "../types/click";
import {getDomXY} from "../helper/helper";
import {writable, get} from 'svelte/store';
import type {Writable} from 'svelte/store';

export const useHandler = (
  _data: Writable<ClickData> | any,
  event: Writable<ClickEvent> | any,
  clearCbs: () => void
) => {
  let dots: Writable<any[]> = writable([])

  const clickEvent = (e: Event|any) => {
    const dom = e.currentTarget
    const xy = getDomXY(dom)

    const mouseX = e.pageX || e.clientX
    const mouseY = e.pageY || e.clientY

    const domX = xy.domX
    const domY = xy.domY

    const xPos = mouseX - domX;
    const yPos = mouseY - domY;

    const xx = parseInt(xPos.toString())
    const yy = parseInt(yPos.toString())
    const date = new Date()
    const d = get(dots)
    const index = d.length
    dots.set([...d, {key: date.getTime(), index: index + 1, x: xx, y: yy}])

    const ec = get(event)
    ec.click && ec.click(xx, yy)
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const confirmEvent = (e: Event|any) => {
    let ds: Array<ClickDot> = get(dots)
    const ec = get(event)
    ec.confirm && ec.confirm(ds, () => {
      dots.set([])
    })
    e.cancelBubble = true
    e.preventDefault()
    return false
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
    dots.set([])
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

  return {
    dots,
    clickEvent,
    confirmEvent,
    closeEvent,
    refreshEvent,
    resetData,
    clearData,
    close,
    refresh,
  }
}