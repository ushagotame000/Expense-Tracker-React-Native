import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function stock() {
  return (
    <View style={styles.container}>
      <Text>stock</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        },
})