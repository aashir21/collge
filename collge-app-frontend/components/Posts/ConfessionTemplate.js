import { StyleSheet, View, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import ButtonContainer from './ButtonContainer'
import ProfileHeader from './ProfileHeader'
import useTimeSince from "../../hooks/useTimeSince"
import PostSettingModal from '../Modals/PostSettingModal'
import AltCommentsModal from "../Modals/AltCommentsModal"
import CaptionBox from '../General Component/CaptionBox'

const ConfessionTemplate = ({ universityId, taggedUsers, caption, votes, createdAt, userId, postId, sourceScreen, location, handleShowCommentsModal, shouldFocusCommentSection, likeStatus }) =>
{

    const { width } = useWindowDimensions()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
    const timeAgo = useTimeSince(createdAt)
    const [isDeleted, setIsDeleted] = useState(false);

    const showModal = () => setIsModalVisible(true);
    const hideModal = () => setIsModalVisible(false);

    const showCommentsModal = () => setIsCommentsModalVisible(true)
    const hideCommentsModal = () => setIsCommentsModalVisible(false);

    const deletePost = () => setIsDeleted(true)

    const updatedPostData = useLocalSearchParams();

    return (
        <View>
            {
                !isDeleted ? <View style={[styles.container, { width: width - 32 }]}>
                    <View>

                        <ProfileHeader taggedUsers={taggedUsers} name={"Anonymous"} location={location} createdAt={timeAgo} value={"secret_user"} showModal={showModal} profilePicUri={"https://i.imgur.com/hmijVtQ.png"} />

                        <View style={styles.confessionTextCon}>
                            <CaptionBox caption={caption} updatedCaption={updatedPostData.updatedCaption} postId={postId} updatedPostId={updatedPostData.postId} />
                        </View>

                        <ButtonContainer likeStatus={likeStatus} universityId={universityId} shouldFocusCommentSection={shouldFocusCommentSection} handleShowCommentsModal={handleShowCommentsModal} votes={votes} userId={userId} postId={postId} showModal={showCommentsModal} />

                        {isModalVisible && (
                            <PostSettingModal postType={"CONFESSION"} sourceScreen={sourceScreen} postId={postId} isVisible={isModalVisible} onClose={hideModal} userId={userId} deletePost={deletePost}>                        </PostSettingModal>
                        )}
                        {/* {isCommentsModalVisible && (
                            <AltCommentsModal isVisible={isCommentsModalVisible} onClose={hideCommentsModal} userId={userId} postId={postId} />
                        )} */}

                    </View>
                </View> : null
            }
        </View>
    )
}

export default React.memo(ConfessionTemplate)

const styles = StyleSheet.create({

    container: {
        backgroundColor: COLORS.textAccent,
        borderRadius: SIZES.large,
        padding: SIZES.large,
        marginBottom: SIZES.medium,
        alignSelf: "center",
    },

    confessionTextCon: {
    },
    confessionText: {
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        fontSize: SIZES.fontBodySize,
    },
    btnContainer: {
        height: 35,
        justifyContent: "center",
        flexDirection: "row",
    },
    locationContainer: {
        flexDirection: "row",
        marginTop: SIZES.medium
    },
    locationName: {
        fontSize: SIZES.fontBodySize - 2,
        color: COLORS.whiteAccent,
        fontFamily: FONT.regular,
        marginHorizontal: 4
    },

})