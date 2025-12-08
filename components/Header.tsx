import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import img from "@/assets/images/slide1.jpg"

interface HeaderProps {
    name: string
}

const Header = () => {
  return (
    <View>
      <Image source={img} style={styles.image} />   
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    image: {
        width: '10%',
        height: 200,
        borderRadius: 200,
    }
})