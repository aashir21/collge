import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import LinkUpProfile from '../../../../components/LinkUp/LinkUpProfile'

const LinkUpProfileStack = () =>
{

	const localParams = useLocalSearchParams()

	return (
		<LinkUpProfile userId={localParams.userId} />
	)
}

export default LinkUpProfileStack