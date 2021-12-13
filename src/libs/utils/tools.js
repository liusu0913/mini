/**
 * @name 节流函数
 * @param fn 回调函数
 * @param gapTime 每次触发时间间隔单位毫秒ms
 */
let _lastTime = null
const throttle = (fn, gapTime) => {
  return function () {
    const _nowTime = +new Date()
    console.log(_nowTime, _lastTime, gapTime)
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn()
      _lastTime = _nowTime
    }
  }
}

export { throttle }
