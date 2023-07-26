import React, {useState} from 'react';
import "../css/hashtag-input.css";

const HashtagInput: React.FC<{ hashtags: string[], setHashtags: (hashtags: string[]) => void }> = ({
                                                                                                       hashtags,
                                                                                                       setHashtags
                                                                                                   }) => {
    const [inputValue, setInputValue] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        const regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm; // Regular expression to match hashtags
        const matchedHashtags = value.match(regex);
        if (matchedHashtags) {
            const uniqueHashtags = Array.from(new Set(matchedHashtags.map((tag) => tag.trim())));
            setHashtags(uniqueHashtags);
        } else {
            setHashtags([]);
        }
    };

    return (
        <div className="hashtag-input-container">
            <label htmlFor="hashtagInput">Enter Hashtags: </label>
            <input
                id="hashtagInput"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type your hashtags here..."
                className="hashtag-input"
            />
            <div className="extracted-hashtags">
                <ul>
                    {hashtags.map((hashtag, index) => (
                        <li key={index}>{hashtag}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default HashtagInput;
