import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated, FlatList, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import slides from '../../assets/slides';
import OnboardingItem from './OnboardingItem';
import Paginator from './Paginator';
import NextButton from './NextButton';

const { width } = Dimensions.get('window');

function Onboarding()
{
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const router = useRouter();
    const slidesRef = useRef(null);

    const onViewableItemsChanged = useRef(({ viewableItems }) =>
    {
        if (viewableItems.length > 0)
        {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = () =>
    {
        if (currentIndex < slides.length - 1)
        {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else
        {
            router.replace('/auth/chooseop');
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={slides}
                renderItem={({ item }) => <OnboardingItem item={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewConfig}
                scrollEventThrottle={16}
                ref={slidesRef}
            />
            <Paginator data={slides} scrollX={scrollX} />
            <NextButton scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / slides.length)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#010101',
    },
});

export default Onboarding;
