import React, {useState} from 'react';
import "../css/hashtag-input.css";
import {localizedStrings} from "../res/LocalizedStrings.tsx";

const HashtagInput: React.FC<{ hashtags: string[], setHashtags: (hashtags: string[]) => void }> = ({
                                                                                                       hashtags,
                                                                                                       setHashtags
                                                                                                   }) => {
    const [inputValue, setInputValue] = useState<string>("");
    const regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm; // Regular expression to match hashtags

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setInputValue(inputValue);

        const matchedHashtags = inputValue.match(regex);

        if (matchedHashtags) {
            // Set the hashtags state variable to the unique hashtags in the matched hashtags array
            const uniqueHashtags = Array.from(new Set(matchedHashtags.map((tag) => tag.trim())));
            setHashtags(uniqueHashtags);
        } else {
            setHashtags([]);
        }
    };

    return (
        <div className="hashtag-input-container">
            <label htmlFor="hashtagInput">{localizedStrings.hashtags}</label>
            <input
                id="hashtagInput"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={localizedStrings.hashtagsPlaceholder}
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
