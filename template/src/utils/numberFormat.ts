export const thousandSeparators = (num: number) => {
  if (num < 1000) {
    return num
  }
  let arr = `${num}`.split('')
  let res = []
  let count = 0
  for (let i = arr.length - 1; i >= 0; i--) {
    res.push(arr[i])
    count++
    if (count % 3 === 0 && i !== 0) {
      res.push(',')
    }
  }
  return res.reverse().join('')
}
