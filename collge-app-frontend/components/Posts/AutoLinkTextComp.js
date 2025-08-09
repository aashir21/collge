import { StyleSheet, Text, Alert, View } from 'react-native'
import React from 'react'
import Autolink from 'react-native-autolink';
import { COLORS, FONT } from '../../constants/theme';


const AutoLinkTextComp = ({ caption, updatedCaption, updatedPostId, postId, propStyle }) =>
{
    return (
        <Autolink component={Text} style={[styles.captionText, propStyle]} text={(postId === updatedPostId && updatedCaption)
            ? updatedCaption
            : caption}

            truncate={15}
            truncateLocation="end"
            mention={"instagram"}
            hashtag={"facebook"}
            linkStyle={{ color: COLORS.secondary }}
            onPress={(url, match) =>
            {
                switch (match.getType())
                {
                    case 'mention':
                        return;
                    case 'hashtag':
                        return;
                    case 'url':
                        return;
                    case "phone":
                        return;
                    case "email":
                        return;
                    default:
                        Alert.alert('Something went wrong');
                }
            }}
        >
        </Autolink>
    )
}

export default AutoLinkTextComp

const styles = StyleSheet.create({
    captionText: {
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
    }
})