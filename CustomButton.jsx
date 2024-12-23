import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity 
    onPress={handlePress}
    activeOpacity={0.8}
    
    className={ `bg-secondary rounded-xl min-h-[60px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
    disabled={isLoading}
    >
        
      <Text className={`text-primary font-kbold text-lg ${textStyles}`}>
      {title}
    </Text>
    </TouchableOpacity>
  )
}

export default CustomButton