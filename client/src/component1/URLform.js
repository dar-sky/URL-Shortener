import React, { useState } from 'react';
import './1.css';

const URLForm = () => {
    const [URL, setURL] = useState(null);
    const [time, setTime] = useState(null);
    const [shortUrl, setShortUrl] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestData = {
            url: URL,
            time: time,
        };

        try {
            const response = await fetch('http://localhost:5000/urlshort', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();
            console.log(data);
            setShortUrl(data.shortUrl);
            
            
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="bg">
  <div className="login-box">
    <p>URL Shortener</p>
    <form>
      <div className="user-box">
        <input
          name="URL"
          type="text"
          placeholder="Enter URL"
          value={URL}
          onChange={(e) => setURL(e.target.value)}
        />
        <label>URL</label>
      </div>
      
      
      {
        shortUrl === null && (
            <div className="user-box">
        <input
          name="time"
          type="text"
          placeholder="Enter Time in Hours (Optional)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <label>Time</label>
      </div>
        )
      }
      
      {shortUrl === null && (
        <a href="/" onClick={handleSubmit}>
          Submit
        </a>
      )}
      {shortUrl !== null && (
        <div className="user-box">
          <input
            name="shortUrl"
            type="text"
            required={false}
            value={shortUrl}
            readOnly
            onClick={(e) => e.target.select()}
          />
          <label>Your Short URL</label>
          
        </div>
      )}
      {
        shortUrl !== null && (
            <a href="/" > URL Shortener </a>
        )
      }
    </form>
  </div>
</div>

    );
};

export default URLForm;
