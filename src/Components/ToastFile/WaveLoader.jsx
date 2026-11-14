import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';

const WaveLoader = ({
    color = '#FFFFFF',
    size = 6,
    spacing = 5,
    waveHeight = 7,
    duration = 300,
}) => {
    const animations = useRef([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ]).current;

    console.log("kanmala",size)

    useEffect(() => {
        const loops = animations.map((anim, index) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(index * 150),
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 350,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 350,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.delay((2 - index) * 150),
                ])
            )
        );

        loops.forEach(loop => loop.start());

        return () => loops.forEach(loop => loop.stop());
    }, [animations]);

    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
        }}>
            {animations.map((anim, index) => (
                <Animated.View
                    key={index}
                    style={{
                        width: size,
                        height: size,
                        borderRadius: 10,
                        backgroundColor: "#ffffff",
                        transform: [{
                            translateY: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -7 ],
                            }),
                        }],
                    }}
                />
            ))}
        </View>
    );
};

export default WaveLoader;