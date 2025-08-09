// @Authored by : Muhammad Aashir Siddiqui

import React, { useState, useRef, useEffect } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, View, Modal, Pressable, Text, useWindowDimensions, ScrollView, FlatList, TouchableOpacity, Linking } from 'react-native';
import { COLORS, FONT, SIZES } from '../../constants/theme';
import * as SecureStore from "expo-secure-store"
import { AntDesign, MaterialCommunityIcons, Fontisto, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import SpanText from '../General Component/SpanText';

const EulaModal = ({ isVisible, onClose }) =>
{
    const windowHeight = Dimensions.get('window').height;
    const { width } = useWindowDimensions()
    const translateY = useRef(new Animated.Value(windowHeight)).current;
    const [active, setActive] = useState(false);
    const [storageUserId, setStorageUserId] = useState()

    const PRIVACY_POLICY_URL = "https://www.privacypolicies.com/live/c5971636-92da-43e0-b44c-5d7d6b688fac"

    useEffect(() =>
    {
        if (isVisible)
        {
            setActive(true);
        }
    }, [isVisible]);

    const handleFetchUserIdFromStorage = async () =>
    {
        const fetchedId = await SecureStore.getItem("__userId")

        setStorageUserId(fetchedId)
    }

    useEffect(() =>
    {

        handleFetchUserIdFromStorage()

        Animated.timing(translateY, {
            toValue: active ? 0 : windowHeight,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [active]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 0, // Allow vertical swipes
            onPanResponderMove: (_, gestureState) =>
            {
                // Update translateY based on the gesture movement
                translateY.setValue(Math.max(0, gestureState.dy)); // Only positive dy for downward drag
            },
            onPanResponderRelease: (_, gestureState) =>
            {
                if (gestureState.dy > windowHeight / 3 || gestureState.vy > 0.5)
                {
                    // Close modal if dragged down sufficiently or released with velocity
                    onClose();
                } else if (gestureState.dy < -windowHeight / 3 || gestureState.vy < -0.5)
                {
                    // Close modal if swiped up sufficiently or released with velocity upwards
                    onClose();
                } else
                {
                    // Return to initial position
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const handleOverlayPress = () =>
    {
        onClose(); // Call the onClose function when the overlay is pressed
    };

    return (
        <Modal transparent visible={active} animationType='slide' onRequestClose={onClose} >
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        { transform: [{ translateY }] },
                    ]}
                // {...panResponder.panHandlers}
                >

                    <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: SIZES.large }}
                        style={{ flexGrow: 1 }}>
                        <Text style={styles.modalTitle}>End User License Agreement</Text>
                        <Text style={styles.title}>Last Updated: 1st January 2025</Text>

                        <Text style={styles.description}>
                            This EULA is a legal agreement between you (“End-User” or “you”) and Muhammad Aashir Siddiqui (“we,” “us,” or “our”), an individual with a principal address at 4 Wykeham Terrace, Bar End Road, SO23 9NE, United Kingdom regarding your use of our mobile application (the “Licensed Application” or the “Application”). By downloading, installing, or using the Licensed Application, you agree to be bound by the terms of this EULA.

                            This EULA incorporates Apple’s Required App Store EULA Terms (“Apple EULA Terms”). To the extent any terms in this EULA conflict with the Apple EULA Terms, the Apple EULA Terms shall govern for users who downloaded the Licensed Application via the Apple App Store.
                        </Text>

                        <Text style={styles.subTitle}>1. ACKNOWLEDGEMENT</Text>
                        <Text style={styles.description}>You and we acknowledge that this EULA is concluded solely between you and us, and not with Apple. We, not Apple, are solely responsible for the Licensed Application and its content. Your use of the Licensed Application must comply with the Apple Media Services Terms and Conditions (the “Usage Rules”), which you confirm you have had the opportunity to review.</Text>

                        <Text style={styles.subTitle}>2. SCOPE OF LICENSE</Text>
                        <Text style={styles.description}>We grant you a personal, non-exclusive, non-transferable, limited license to use the Licensed Application for your personal, non-commercial purposes on any Apple-branded products that you own or control, and as permitted by the Usage Rules. This license does not allow you to use the Licensed Application on any device that you do not own or control. However, the Licensed Application may be accessed and used by other accounts associated with you via Family Sharing or volume purchasing, as permitted by the Usage Rules.

                            Prohibited Actions:

                            (1) You may not sell, transmit, host, or otherwise commercially exploit the Licensed Application.
                            (2) You may not copy or use the Licensed Application for any purposes except for personal, non-commercial use.
                            (3) You may not modify, decrypt, reverse compile, or reverse engineer the Licensed Application, or attempt to derive its source code.
                        </Text>

                        <Text style={styles.subTitle}>3. MAINTENANCE AND SUPPORT</Text>
                        <Text style={styles.description}>You acknowledge that we are solely responsible for providing any maintenance and support services with respect to the Licensed Application. Apple has no obligation to furnish any maintenance and support services for the Licensed Application. Any questions, complaints, or claims about the Licensed Application should be directed to us at:</Text>
                        <Text style={styles.description}>   - Name: Muhammad Aashir Siddiqui</Text>
                        <Text style={styles.description}>   - Address: 4 Wykeham Terrace, Bar End Road, SO23 9NE, United Kingdom</Text>
                        <Text style={styles.description}>   - Email: support@collge.io</Text>

                        <Text style={styles.subTitle}>4. WARRANTY</Text>
                        <Text style={styles.description}>4.1 Your Responsibility</Text>
                        <Text style={styles.description}>
                            We are solely responsible for any warranties, whether express or implied by law, to the extent not effectively disclaimed.
                        </Text>

                        <Text style={styles.description}>4.2 Apple’s Limited Warranty Obligation</Text>
                        <Text style={styles.description}>
                            In the event of any failure of the Licensed Application to conform to any applicable warranty, you may notify Apple, and Apple will refund the purchase price (if any) for the Licensed Application. To the maximum extent permitted by applicable law, Apple will have no other warranty obligation whatsoever with respect to the Licensed Application, and any other claims, losses, liabilities, damages, costs, or expenses attributable to any failure to conform to any warranty is our sole responsibility.
                        </Text>

                        <Text style={styles.description}>4.3 Disclaimer of Warranties</Text>
                        <Text style={styles.description}>
                            Except where prohibited by law, the Licensed Application is provided on an “AS IS” and “AS AVAILABLE” basis, without warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
                        </Text>

                        <Text style={styles.subTitle}>5. PRODUCT CLAIMS</Text>
                        <Text style={styles.description}>You and we acknowledge that we, not Apple, are responsible for addressing any claims of the End-User or any third party relating to the Licensed Application or the End-User’s possession and/or use of the Licensed Application. This includes, but is not limited to:</Text>
                        <Text style={styles.description}>(i) product liability claims;</Text>
                        <Text style={styles.description}>(ii) any claim that the Licensed Application fails to conform to any applicable legal or regulatory requirement; and</Text>
                        <Text style={styles.description}>(iii) claims arising under consumer protection, privacy, or similar legislation.</Text>

                        <Text style={styles.subTitle}>6. INTELLECTUAL PROPERTY RIGHTS</Text>
                        <Text style={styles.description}>6.1 Third-Party Claims</Text>
                        <Text style={styles.description}>You and we acknowledge that, in the event of any third-party claim that the Licensed Application or your possession and use of the Licensed Application infringes that third party’s intellectual property rights, we, not Apple, will be solely responsible for the investigation, defense, settlement, and discharge of any such claim.</Text>

                        <Text style={styles.description}>6.2 Ownership</Text>
                        <Text style={styles.description}>All right, title, and interest in and to the Licensed Application (including all trademarks, service marks, and logos) is our exclusive intellectual property. Nothing in this EULA grants you any right or license to use any of our trademarks, service marks, logos, or other proprietary materials except as expressly permitted in this EULA.</Text>

                        <Text style={styles.subTitle}>7. LEGAL COMPLIANCE</Text>
                        <Text style={styles.description}>By using the Licensed Application, you represent and warrant that:</Text>
                        <Text style={styles.description}>(i) you are not located in a country that is subject to a U.S. Government embargo, or that has been designated by the U.S. Government as a “terrorist supporting” country; and</Text>
                        <Text style={styles.description}>(ii) you are not listed on any U.S. Government list of prohibited or restricted parties.</Text>

                        <Text style={styles.subTitle}>8. DEVELOPER NAME AND ADDRESS</Text>
                        <Text style={styles.description}>- Name: Muhammad Aashir Siddiqui</Text>
                        <Text style={styles.description}>- Address: 4 Wykeham Terrace, Bar End Road, SO23 9NE, United Kingdom</Text>
                        <Text style={styles.description}>- Email: support@collge.io</Text>
                        <Text style={styles.description}>Please direct any questions, complaints, or claims concerning the Licensed Application to the contact information above.</Text>

                        <Text style={styles.subTitle}>9. THIRD-PARTY TERMS OF AGREEMENT</Text>
                        <Text style={styles.description}>You must comply with applicable third-party terms of agreement when using the Licensed Application. For instance, if your use of the Licensed Application is subject to a VoIP or data plan, you must not violate your wireless data service agreement when using the Licensed Application.</Text>

                        <Text style={styles.subTitle}>10. THIRD-PARTY BENEFICIARY</Text>
                        <Text style={styles.description}>You and we acknowledge and agree that Apple and Apple’s subsidiaries are third-party beneficiaries of this EULA. Upon your acceptance of this EULA, Apple will have the right (and will be deemed to have accepted the right) to enforce this EULA against you as a third-party beneficiary thereof.</Text>

                        <Text style={styles.subTitle}>11. USER-GENERATED CONTENT</Text>
                        <Text style={styles.description}>If the Licensed Application allows you to upload media or other content (“User-Generated Content”), you are solely responsible for that content, including its legality and appropriateness. We reserve the right to remove any content at our sole discretion. By uploading content, you affirm that you own or have the necessary rights to distribute such content, and that it does not violate any applicable law or rights of any third party.</Text>

                        <Text style={styles.subTitle}>12. UPDATES AND MODIFICATIONS</Text>
                        <Text style={styles.description}>We may, at our sole discretion, release updates, enhancements, or modifications to the Licensed Application from time to time, including but not limited to improvements and bug fixes based on user feedback. Such updates may be automatically installed. You agree that we have no obligation to continue to provide or enable any particular features or functionality.</Text>

                        <Text style={styles.subTitle}>13. PRIVACY POLICY AND DATA COLLECTION</Text>
                        <Text style={styles.description}>By using the Licensed Application, you agree to our collection, use, and disclosure of your personal information (such as your email) as described in our Privacy Policy. Please review our Privacy Policy here:
                            <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
                                <Text style={{ color: COLORS.secondary }}>{PRIVACY_POLICY_URL}</Text>
                            </TouchableOpacity>
                        </Text>

                        <Text style={styles.subTitle}>14. TERMINATION</Text>
                        <Text style={styles.description}>This EULA is effective until terminated by you or us. If you fail to comply with any term of this EULA, your right to use the Licensed Application will immediately terminate. In addition, we may terminate this EULA at any time for any or no reason, with or without notice. Upon termination, you must cease all use of the Licensed Application and destroy any copies of the Licensed Application in your possession or control.</Text>

                        <Text style={styles.subTitle}>15. LIMITATION OF LIABILITY</Text>
                        <Text style={styles.description}>To the maximum extent permitted by applicable law, in no event shall we (or our affiliates, agents, or licensors) be liable for any direct, indirect, punitive, incidental, special, or consequential damages arising out of or related to this EULA or your use (or inability to use) the Licensed Application, even if advised of the possibility of such damages.</Text>

                        <Text style={styles.subTitle}>16. GOVERNING LAW</Text>
                        <Text style={styles.description}>This EULA shall be governed by and construed in accordance with the laws of England and Wales, without regard to its conflict-of-law provisions. Any dispute arising out of or relating to this EULA shall be subject to the exclusive jurisdiction of the courts located in England and Wales.</Text>

                        <Text style={styles.subTitle}>17. ENTIRE AGREEMENT</Text>
                        <Text style={styles.description}>This EULA, together with the Apple Media Services Terms and Conditions and any other agreements expressly incorporated by reference, constitutes the entire agreement between you and us regarding your use of the Licensed Application and supersedes all prior or contemporaneous understandings.</Text>

                        <Text style={styles.subTitle}>18. Prohibited Conduct / No Tolerance Policy</Text>
                        <Text style={styles.description}>1. Objectionable Content and Abusive Behavior:</Text>
                        <Text style={styles.description}>- You agree not to upload, post, transmit, or otherwise make available any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, hateful, or otherwise objectionable.</Text>
                        <Text style={styles.description}>
                            - You agree not to engage in any behavior in or through the Application that is, or could be reasonably perceived as, abusive, harassing, threatening, hateful, or otherwise objectionable.</Text>

                        <Text style={[styles.description, { marginTop: 12 }]}>2. Zero-Tolerance Enforcement:</Text>
                        <Text style={styles.description}>- We maintain a strict, zero-tolerance policy regarding objectionable content and abusive users. Any violation of this policy will result in immediate suspension or termination of your right to use the Licensed Application without prior notice.</Text>
                        <Text style={styles.description}>We reserve the right to remove or disable access to any content that violates this policy and to report such violations to the appropriate authorities where necessary.</Text>

                        <Text style={[styles.description, { marginTop: 12 }]}>3. Reporting Violations:</Text>
                        <Text style={styles.description}>- If you encounter content or behavior that you believe violates these Terms, please contact us immediately at support@collge.io or use the in-app report feature. We will review and take any action we deem appropriate under the circumstances.</Text>

                        <Text style={styles.warning}>By agreeing to the terms, you acknowledge that you have read and understood this EULA, and agree to be bound by its terms. If you do not agree, uninstall the app and please contact support@collge.io in order to delete your personal information such as name, email etc.</Text>

                        <TouchableOpacity onPress={() => onClose()} style={styles.closeBtn}>
                            <Text style={styles.closeBtnTitle}>I Agree</Text>
                        </TouchableOpacity>
                    </ScrollView>

                </Animated.View>
            </View>
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
        borderTopLeftRadius: 20,
        flex: 0.8,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
    },
    statsContainer: {
        backgroundColor: COLORS.lightBlack,
        paddingVertical: SIZES.medium,
        paddingHorizontal: SIZES.medium,
        borderRadius: SIZES.large,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: SIZES.small,
    },
    statsDescTitle: {
        flexDirection: "column",
        width: "85%"
    },
    title: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small + 1,
        color: COLORS.tertiary,
        marginVertical: 16
    },
    subTitle: {
        fontFamily: FONT.bold,
        fontSize: SIZES.medium,
        color: COLORS.tertiary,
        marginVertical: 16,
        textTransform: "uppercase"
    },
    description: {
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize - 2,
        color: COLORS.whiteAccent
    },
    warning: {
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize - 2,
        color: COLORS.warning,
        marginVertical: SIZES.large
    },
    modalTitle: {
        textAlign: "center",
        color: COLORS.tertiary,
        fontFamily: FONT.bold,
        fontSize: SIZES.large
    },
    modalSubtitle: {
        textAlign: "center",
        marginBottom: SIZES.large,
        color: COLORS.whiteAccent,
        fontFamily: FONT.regular,
        fontSize: SIZES.small
    },
    closeBtn: {
        backgroundColor: COLORS.primary,
        width: "35%",
        alignSelf: "center",
        marginVertical: SIZES.medium,
        paddingVertical: SIZES.medium,
        borderRadius: SIZES.large
    },
    closeBtnTitle: {
        color: COLORS.tertiary,
        fontSize: SIZES.small,
        fontFamily: FONT.regular,
        textAlign: "center"
    }
});

export default EulaModal;
