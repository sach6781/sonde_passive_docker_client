import React, { useState, useEffect } from 'react';

function MyComponent() {
    const [names, setNames] = useState([]);
    const [chunksMap, setChunksMap] = useState({});

    useEffect(() => {
        // Fetch the list of names
        fetch('https://teams.dev.sondeservices.com/api/user-management/users-history')
            .then((response) => response.json())
            .then((data) => {
                setNames(Object.keys(data));
            })
            .catch((error) => console.error('API request error: ', error));
    }, []);

    useEffect(() => {
        const fetchData = () => {
            // Make an API call to fetch the "chunks" values for each name
            const promises = names.map((name) =>
                fetch('https://teams.dev.sondeservices.com/api/user-management/user/' + name + '/chunks')
                    .then((response) => response.json())
                    .then((data) => ({ name, chunks: data.chunks }))
            );

            Promise.all(promises)
                .then((results) => {
                    const newChunksMap = {};
                    results.forEach(({ name, chunks }) => {
                        newChunksMap[name] = chunks;
                    });
                    setChunksMap(newChunksMap);
                })
                .catch((error) => console.error('Promise.all error: ', error));
        };

        fetchData(); // Fetch "chunks" values immediately when the component mounts

        const intervalId = setInterval(fetchData, 3000); // Fetch data every 3 seconds

        return () => clearInterval(intervalId); // Clear the interval when the component unmounts
    }, [names]);

    return (
        <div>
            <h1>Data:</h1>
            <ul>
                {names.map((name, index) => (
                    <li key={index}>
                        {name} - {chunksMap[name]}
                    </li>
                ))}
            </ul>
        </div>
    );
}


export default MyComponent;
