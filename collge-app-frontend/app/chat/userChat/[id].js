import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ChatRoom from '../../../components/Chat/ChatRoom';

const DynamicChatRoom = () =>
{
    const localSearchParams = useLocalSearchParams();

    const parsedSenderId = isNaN(parseInt(localSearchParams.senderId)) ? null : parseInt(localSearchParams.senderId);

    const actorId = localSearchParams?.actorId || null;
    const recipientId = localSearchParams?.recipientId || null;

    let finalActorId = actorId;
    let finalRecipientId = recipientId;

    if (actorId && recipientId &&
        (localSearchParams?.notificationType === "CHAT_MESSAGE" || localSearchParams?.notificationType === "POST_SHARE"))
    {
        finalActorId = recipientId;
        finalRecipientId = actorId;
    }

    return (
        <ChatRoom senderId={finalActorId || parsedSenderId} recipientId={finalRecipientId} />
    );
};

export default DynamicChatRoom;
