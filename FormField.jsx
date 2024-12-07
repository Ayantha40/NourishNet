import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react'

import { icons } from '../constants'

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
    const [showPassword, setsetshowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-white font-ksemibold">{title}</Text>

      <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary itmes-center flex-row">

        <TextInput 
            className="flex-1 text-white font-ksemibold text-base" 
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
        />

        {title === 'Password' && (
            <TouchableOpacity onPress={() =>
                setsetshowPassword(!showPassword)}>
                    <Image source={!showPassword ? icons.eye : icons.eyeHide} className="w-6 h " resizeMode='contain' />
                </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField