import { StatusBar } from "expo-status-bar";
import { Text, View, ScrollView, Image } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from '../constants';
import CustomButton from "../components/CustomButton";
import { useGlobalContext } from "../context/GlobalProvider";

export default function App () {
    const {isLoading, isLoggedIn} = useGlobalContext();

    if(!isLoading && isLoggedIn) return <Redirect href="/home"/>

   return (
       <SafeAreaView className="bg-primary h-full">
        <ScrollView contentContainerStyle={{ height:'100%'}} >
            <View className="w-full justify-center items-center min-h-full px-4">
                <Image 
                source={images.logo}
                className="w-[380px] h-[150px]"
                // resizeMode="contain"
                />

                <Image
                source={images.cards}
                className="max-w[380px] w-full h-[300px]"
                // resizeMode="contain"
                />

                <View className="relative mt-4">
                    <Text className="text-2xl text-white font-ksemibold text-center">~ Connect Food Surplus to Sustenance with{' '}
                    <Text className="text-secondary-200">NourishNet ~</Text>
                    </Text>

                </View>

                <CustomButton
                title="Let's Get Started !"
                handlePress={() => router.push('/login')}
                containerStyles="w-full mt-12 "
                 />

            </View>
        </ScrollView>

        <StatusBar backgroundColor='#161622' style='light' />

       </SafeAreaView>
   );
}
 