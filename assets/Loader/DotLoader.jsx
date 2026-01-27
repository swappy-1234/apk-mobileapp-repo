import { useState, useEffect } from "react";
import { View } from "react-native";

const DotLoader = () => {


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
     <View className="flex space-x-2  items-center justify-center gap-2">
            <View className="w-3 h-3 bg-[#19CF99] rounded-full animate-bounce"></View>
            <View className="w-3 h-3 bg-[#19CF99] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></View>
            <View className="w-3 h-3 bg-[#19CF99] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></View>
          </View>
  )
}

export default DotLoader