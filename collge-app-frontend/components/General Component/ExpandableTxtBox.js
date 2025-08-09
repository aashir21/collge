import { useState } from 'react';
import './App.css';

// Createa reusable Read More/Less component
const ExpandableText = ({ children, descriptionLength }) =>
{
    const fullText = children;

    // Set the initial state of the text to be collapsed
    const [isExpanded, setIsExpanded] = useState(false);

    // This function is called when the read more/less button is clicked
    const toggleText = () =>
    {
        setIsExpanded(!isExpanded);
    };

    return (

        <View>
            {isExpanded ? fullText : `${fullText.slice(0, descriptionLength)}...`}

            {isExpanded ? 'Show less' : 'Show more'}
        </View>


    )
}