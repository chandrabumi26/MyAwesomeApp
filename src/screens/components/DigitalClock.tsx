import { useEffect, useState } from "react";
import { Text, View } from "react-native";

interface Props {
    className?: string;
}

export default function DigitalClock({ className }: Props) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    },[])

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    };

    return (
        <View className={className}>
            <Text className="text-center text-5xl font-extrabold tracking-tighter text-white">
                {formatTime(time)}
            </Text>
        </View>
    );
}