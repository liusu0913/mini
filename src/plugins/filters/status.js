const orderList = [
  '未支付',
  '已支付',
  '未发货',
  '已发货',
  '已签收',
  '已完成'
]

export default {
  order_format: (status) => {
    return orderList[status] || ''
  }
}
