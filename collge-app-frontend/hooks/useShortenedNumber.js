import { useState, useEffect } from 'react';

function useShortenedNumber(number)
{
    const [shortenedNumber, setShortenedNumber] = useState(number);

    useEffect(() =>
    {
        const shortenNumber = (num) =>
        {
            const suffixes = ["", "K", "M", "B", "T"];
            let magnitude = 0;
            while (Math.abs(num) >= 1000 && magnitude < suffixes.length - 1)
            {
                magnitude += 1;
                num /= 1000;
            }
            return (num % 1 !== 0 ? num.toFixed(1) : num) + suffixes[magnitude];
        };

        setShortenedNumber(shortenNumber(number));
    }, [number]); // Re-run effect when the number changes

    return shortenedNumber;
}

export default useShortenedNumber;