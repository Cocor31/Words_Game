import React, { useEffect, useState } from 'react';

const UserCard = ({ socketID, username, users }) => {
    const [progress, setProgress] = useState(100);
    const total_points = 100

    const getColor = () => {
        if (progress < 40) {
            return "#ff0000"
        } else if (progress < 70) {
            return "#ffa500"
        } else {
            return "#2ecc71"
        }
    }

    useEffect(() => {
        const user = users.filter((user) => user.socketID === socketID)[0];
        setProgress(user.score / total_points * 100)
    }, [users, socketID, username]);

    return (
        <div className="chat__usercard">
            <p >{username}</p>
            <div className="chat__healthbar">
                <div className="progress-bar">
                    <div className='progress-bar-fill' style={{ width: `${progress}%`, backgroundColor: getColor() }}></div>
                </div>
                <div className='progress-label'>{progress}%</div>

            </div>
        </div>

    );
};

export default UserCard;