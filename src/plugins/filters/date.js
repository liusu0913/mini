import dayjs from 'dayjs'

export default {
  date_format: (date, setting = 'YYYY-MM-DD HH:mm:ss') => {
    const weekMap = {
      Monday: '周一',
      Tuesday: '周二',
      Wednesday: '周三',
      Thursday: '周四',
      Friday: '周五',
      Saturday: '周六',
      Sunday: '周日'
    }
    let dateStr = '-'
    if (date) {
      dateStr = dayjs(date).format(setting)
      if (setting.indexOf('dddd') > -1) {
        const week = dayjs(date).format('dddd')
        dateStr = dateStr.replace(week, weekMap[week])
      }
    }
    return dateStr
  }
}
