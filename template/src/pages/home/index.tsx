import React from 'react'
import { Count, PercentUpDown } from '@components'
import BasicAreaEcharts from './BasicAreaEcharts'
import styles from './index.module.less'

const mockCount = {
  header: {
    title: '总销售额',
    tips: '指标说明',
    number: [
      {
        number: 126560,
        prefix: '￥',
        size: 'large',
      },
      {
        number: 17.1,
        suffix: '%',
        size: 'mid',
        icon: 'up',
      },
    ],
  },
  footer: [
    {
      label: '日销售额',
      number: {
        number: 12423,
        prefix: '￥',
        size: 'small'
      }
    },
    {
      label: '日同比',
      number: {
        number: 17.1,
        suffix: '%',
        size: 'small',
        icon: 'down',
      }
    }
  ]
}

const Home: React.FC = () => {
  return (
    <div>
      <div className={styles.card}>
        <Count {...mockCount}>
          <div>
            <span>周同比</span>
            <PercentUpDown number={12} type="up" size="small" />
          </div>
          <div>
            <span>日同比</span>
            <PercentUpDown number={11} type="down" size="small" />
          </div>
        </Count>
        <Count {...mockCount}>
          <BasicAreaEcharts />
        </Count>
        <Count {...mockCount}>

        </Count>
        <Count {...mockCount}>

        </Count>
      </div>
      <div></div>
      <div></div>
    </div>
  )
}

export default Home
