import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'

const login = () => {
  return (
    <SafeAreaView>
    <View>
      <Text style={{fontSize: 24, textAlign: 'center'}}>login</Text>
    </View>
    </SafeAreaView>
  )
}

export default login

const styles = StyleSheet.create({})