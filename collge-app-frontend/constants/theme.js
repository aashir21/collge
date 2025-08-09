import { Platform, StatusBar } from "react-native";
import Constants from "expo-constants"

const extra = Constants.expoConfig?.extra

const COLORS = {
    primary: "#010101",
    secondary: "#45EA69",
    tertiary: "#FAFAFA",
    textAccent: "#171717",
    whiteAccent: "#A2A2A2",
    sucess: "#5CB85C",
    error: "#ed4337",
    skeletonBG: "#30353d",
    lightBlack: "#2C2C2C",
    warning: "#FFBF00",
    brandYellow: "#EBFE7D"
};

const FONT = {
    regular: "Poppins-Regular",
    bold: "Poppins-Bold",
};

const ANIMATION = {
    style: Platform.OS === "ios" ? "simple_push" : "slide_from_right",
    duration: 200
}

const BLAZE = {
    pointsToUnlock: 300
}

const AVATAR = {
    DEFAULT: "https://collge-stag-bucket.ams3.cdn.digitaloceanspaces.com/default-avatar.jpg"
}

const SIZES = {
    xSmall: 10,
    small: 12,
    medium: 16,
    large: 20,
    xLarge: 24,
    xxLarge: 32,

    fontBodySize: 14
};

const STYLES = {
    vBadge: {
        height: 14,
        width: 14,
        resizeMode: "cover",
        objectFit: "contain",
        marginLeft: SIZES.xSmall,
    },
    cBadge: {
        height: 14,
        width: 14,
        resizeMode: "cover",
        objectFit: "contain",
        marginLeft: 4,
    },
    timeStamp: {
        fontSize: SIZES.small,
        color: COLORS.whiteAccent,
        fontFamily: FONT.regular,
        marginHorizontal: SIZES.xSmall
    },
    textShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.25)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 5,
    },

}

const SHADOWS = {
    small: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
    },
    medium: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5.84,
        elevation: 5,
    },
};

const ENDPOINT = {
    BASE_URL: "",
}

const LINKS = {
    UNIVERSITY_REGISTRATION: "https://tally.so/r/3x4yDo"
}

const REGEX = {
    USERNAME_REGEX: /^(?=.{3,15}$)_?[a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*_?$/,
    PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,32}$/,
    NAME_REGEX: /^[a-zA-Z\s]{3,15}$/
}

const UNDERLINE = {
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
    textDecorationColor: COLORS.secondary
}

const MARGIN_TOP_SAFE_AREA_VIEW_FOR_ANDROID = Platform.OS === "android" ? StatusBar.currentHeight + 32 : 0


const NOTIFICATION_TYPES = {

    //Common Types
    NEW_COMMENT: "NEW_COMMENT",  //new comment made on post
    NEW_REPLY: "NEW_REPLY", // new reply made on comment
    FRIEND_REQUEST: "FRIEND_REQUEST",
    ACCEPTED_FRIEND_REQUEST: "ACCEPTED_FRIEND_REQUEST",
    COMMENT_MENTION: "COMMENT_MENTION", //mentioned in a comment
    POST_MENTION: "POST_MENTION", //mentioned in a post caption
    REPLY_MENTION: "REPLY_MENTION", //mentioned in a reply
    TAGGED: "TAGGED", //tagged in a post
    STORY_MENTION: "STORY_MENTION",
    APP_JOIN: "APP_JOIN",
    NEW_LINK_UP: "NEW_LINK_UP",
    POST_SHARE: "POST_SHARE",

    //Collge Specific
    PROFILE_VISIT: "PROFILE_VISIT",
    WINK: "WINK",
    LINKUP_COLLAB_REQUEST: "LINKUP_COLLAB_REQUEST",
    LINKUP_INTEREST: "LINKUP_INTEREST",
    LINKUP_ACCEPTED: "LINKUP_ACCEPTED",
    LINKUP_COLLAB_REQ_ACCEPTED: "LINKUP_COLLAB_REQ_ACCEPTED",
    LINKUP_COLLAB_REQ_REJECTED: "LINKUP_COLLAB_REQ_REJECTED",
    UPVOTE: "UPVOTE",
    DOWNVOTE: "DOWNVOTE",
    NEARBY: "NEARBY"

}

const REPORT_TYPES = {
    BULLYING: "BULLYING",
    SELF_HARM: "SELF_HARM",
    VIOLENCE: "VIOLENCE",
    RESTRICTED_ITEMS: "RESTRICTED_ITEMS",
    NUDITY: "NUDITY",
    SCAM: "SCAM",
    FALSE_INFORMATION: "FALSE_INFORMATION",
    APP_REPORT: "APP_REPORT"
}

const REPORT_REQUEST_TYPES = {
    COMMENT: "COMMENT",
    REPLY: "REPLY",
    USER: "USER",
    LINKUP: "LINKUP",
    POST: "POST"
}

const AUTH_PROPS_TYPE = {
    SELFIE: "selfie",
    CARD_FRONT: "cardFront",
    CARD_REAR: "cardRear"
}

export { COLORS, FONT, SIZES, SHADOWS, ENDPOINT, UNDERLINE, STYLES, ANIMATION, NOTIFICATION_TYPES, MARGIN_TOP_SAFE_AREA_VIEW_FOR_ANDROID, AUTH_PROPS_TYPE, REGEX, BLAZE, AVATAR, REPORT_TYPES, REPORT_REQUEST_TYPES, LINKS };