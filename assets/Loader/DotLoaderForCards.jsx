import { useState, useEffect } from "react";
import { View } from "react-native";

const DotLoaderForCards = () => {


    const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleRestart = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
      <View className="flex flex-row  items-center justify-center gap-2 ">
            <View className="w-3 h-3 bg-[#19CF99] rounded-full animate-bounce"></View>
            <View className="w-3 h-3 bg-[#19CF99] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></View>
            <View className="w-3 h-3 bg-[#19CF99] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></View>
          </View>
  )
}

export default DotLoaderForCards