import React, { useState, useRef, useEffect } from 'react';
import { Animated, Dimensions, StyleSheet, View, Modal, Pressable, Text, Image, PanResponder } from 'react-native';
import { COLORS, FONT, SIZES } from '../../constants/theme';
import ActionButton from '../General Component/ActionButton';

const RequestCameraModal = ({ children, onClose }) =>
{
    const windowHeight = Dimensions.get('window').height;
    const translateY = useRef(new Animated.Value(windowHeight)).current;
    const [active, setActive] = useState(false);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 0, // Only allow vertical down
            onPanResponderMove: (_, gestureState) =>
            {
                translateY.setValue(Math.max(0, gestureState.dy)); // Don't allow dragging up
            },
            onPanResponderRelease: (_, gestureState) =>
            {
                if (gestureState.dy > windowHeight / 3 || gestureState.vy > 0.5)
                {
                    hideModal()
                } else
                {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const showModal = () =>
    {
        setActive(true);
    };

    const hideModal = () =>
    {
        setActive(false);
    };

    useEffect(() =>
    {
        Animated.timing(translateY, {
            toValue: active ? 0 : windowHeight,
            duration: 350,
            useNativeDriver: true,
        }).start();
    }, [active]);

    return (
        <Modal transparent visible={active} animationType="slide" onRequestClose={hideModal}>
            <Pressable onPress={hideModal} style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        { transform: [{ translateY }] },
                    ]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.innerContainer}>
                        <Text style={styles.title}>Find People With Nearby!</Text>
                        <Text style={styles.subTitle}>Making friends have never been easier!</Text>
                    </View>

                    <View style={{ width: "100%", alignItems: "center", justifyContent: "center", marginVertical: SIZES.medium, flex: 0.5 }}>
                        <Image style={styles.img} source={require("../../assets/images/search.png")}></Image>
                    </View>

                    <View style={styles.buttonContainer}>
                        <ActionButton title={"Echo"} />
                    </View>
                </Animated.View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        justifyContent: 'flex-end', // Align modal to the bottom
    },
    modalContainer: {
        backgroundColor: COLORS.textAccent,
        height: 450,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
    },
    innerContainer: {

        width: "100%",
        paddingHorizontal: SIZES.medium,
        paddingTop: SIZES.large,
        alignSelf: "flex-start",
        flex: 0.2,
    },
    title: {
        fontFamily: FONT.bold,
        fontSize: SIZES.xLarge,
        color: COLORS.tertiary,
        textAlign: "center"
    },
    subTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize,
        color: COLORS.whiteAccent,
        textAlign: "center",
        marginTop: SIZES.xSmall
    },
    img: {
        height: 148,
        width: 148,
        objectFit: "cover"
    },
    buttonContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "flex-end",
        flex: 0.3
    }
});

export default RequestCameraModal;
