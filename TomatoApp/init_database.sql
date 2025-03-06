CREATE TABLE users (
    user_id INTEGER PRIMARY KEY, 
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'operator')) NOT NULL
);

CREATE TABLE trucks (
    truck_id INTEGER PRIMARY KEY, 
    license_plate TEXT UNIQUE NOT NULL,
    arrival_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK(status IN ('pending', 'processing', 'completed')) DEFAULT 'pending'
);

CREATE TABLE tomato_samples (
    sample_id INTEGER PRIMARY KEY, 
    truck_id INTEGER,
    avg_size REAL,  -- Average tomato size in mm
    total_tomatoes INTEGER,
    suitable_percentage REAL,
    FOREIGN KEY (truck_id) REFERENCES trucks(truck_id) ON DELETE CASCADE
);

CREATE TABLE processing_recommendations (
    recommendation_id INTEGER PRIMARY KEY, 
    truck_id INTEGER,
    recommendation TEXT,  -- e.g., 'Send to Valley Sun' or 'Reject Load'
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (truck_id) REFERENCES trucks(truck_id) ON DELETE CASCADE
);
