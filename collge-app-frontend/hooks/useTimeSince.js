import { useState, useEffect } from 'react';

const useTimeSince = (localDateTimeString) =>
{
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() =>
    {
        // Parse the server-provided time and add 5 hours
        const serverDate = new Date(localDateTimeString);
        if (isNaN(serverDate.getTime()))
        {
            setTimeAgo("Just now");
            return;
        }

        // Add 5 hours to align with Pakistan time
        const adjustedDate = new Date(serverDate.getTime() + 5 * 60 * 60 * 1000);

        const calculateTimeAgo = () =>
        {
            const now = new Date();
            const diffSeconds = Math.floor((now - adjustedDate) / 1000);

            const intervals = [
                { label: 'y', seconds: 31536000 },
                { label: 'mo', seconds: 2592000 },
                { label: 'w', seconds: 604800 },
                { label: 'd', seconds: 86400 },
                { label: 'h', seconds: 3600 },
                { label: 'm', seconds: 60 },
            ];

            for (const interval of intervals)
            {
                const count = Math.floor(diffSeconds / interval.seconds);
                if (count >= 1)
                {
                    return `${count}${interval.label}`;
                }
            }

            return 'Just now';
        };

        const updateTimeAgo = () =>
        {
            setTimeAgo(calculateTimeAgo());
        };

        updateTimeAgo();
        const intervalId = setInterval(updateTimeAgo, 60000);

        return () => clearInterval(intervalId);
    }, [localDateTimeString]);

    return timeAgo;
};

export default useTimeSince;
