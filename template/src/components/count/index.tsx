import React from 'react'
import {
  ExclamationCircleOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  MinusOutlined,
} from '@ant-design/icons'
import {
  Popover,
  Col,
  Row,
} from 'antd'
import { thousandSeparators } from '@utils'
import styles from './index.module.less'

type Number = {
  number: number,
  prefix?: any,
  suffix?: any,
  icon?: 'up' | 'down' | string,
  size?: 'large' | 'mid' | 'small' | string
}

type Footer = {
  label: string,
  number: Number,
}

interface IProps {
  header: {
    title: string,
    tips: string,
    number: Number[],
  },
  footer?: Footer[],
}

const fontSize = (size: string) => {
  switch (size) {
    case 'large': return styles.numberSizeLarge
    case 'mid': return styles.numberSizeMid
    case 'small': return styles.numberSizeSmall
    default: return styles.numberSizeLarge
  }
}

export const PercentUpDown: React.FC<{number: number, size?: string, type?: string}> = (props) => {
  const {
    number,
    size = 'large',
    type = 'invariant',
  } = props

  return (
    <React.Fragment>
      <span className={fontSize(size)}>{number}%</span>
      {(() => {
        switch (type) {
          case 'up': return <CaretUpOutlined style={{ color: 'red' }} />
          case 'down': return <CaretDownOutlined style={{ color: 'green' }} />
          default: return <MinusOutlined />
        }
      })()}
    </React.Fragment>
  )
}

const Count:React.FC<IProps> = (props) => {
  const {
    header,
    footer = [],
    children,
  } = props
  const {
    title,
    tips,
    number,
  } = header

  const renderNumber = (num: Number, size: string = 'large') => {
    const s: string = num.size ? num.size : size

    return (
      <div>
        <span className={fontSize(s)}>
          {`${num.prefix ? num.prefix : ''}${thousandSeparators(num.number)}${num.suffix ? num.suffix : ''}`}
        </span>
        {num.icon ? (() => num.icon === 'up' ? <CaretUpOutlined style={{ color: 'red' }} /> : <CaretDownOutlined style={{ color: 'green' }} />)() : ''}
      </div>
    )
  }

  return (
    <div className={styles.count}>
      <div className={styles.header}>
        <Row className={styles.title}>
          <Col span={12}>
            <label>{title}</label>
          </Col>
          <Col span={12} className={styles.titleIcon}>
            <Popover content={tips}>
              <ExclamationCircleOutlined />
            </Popover>
          </Col>
        </Row>
        <div className={styles.horizontal}>
          {number.map((num, index) => (
            <div key={index}>
              {renderNumber(num)}
            </div>
          ))}
        </div>
      </div>
      <div>{children}</div>
      <div className={styles.footer}>
        {footer.map((item, index) => (
          <div className={styles.horizontal} key={index}>
            <label>{item.label}</label>
            {renderNumber(item.number, 'small')}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Count
