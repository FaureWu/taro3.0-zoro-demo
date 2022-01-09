import { useMemo } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'

import styles from './spin.scss'

export default function Spin({ loading }) {
  console.log(loading)
  return useMemo(() => {
    return (
      <View className={classNames(styles.spin, { [styles.hide]: !loading })}>
        <View className={styles.overlay}>
          <View className={styles.list}>
            <View className={styles.rect} />
            <View className={styles.rect} />
            <View className={styles.rect} />
            <View className={styles.rect} />
            <View className={styles.rect} />
          </View>
        </View>
      </View>
    )
  }, [loading])
}
