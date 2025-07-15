"use client"
import { useState } from 'react';

export default function CountySearchForm() {
    const [disasterData, setDisasterData] = useState<{ features: any[] } | null>(null);
    const [error, setError] = useState(null);
    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            const response = await fetch('http://localhost:3001/api/county', {
                method: form.method,
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setDisasterData(result);
        } catch (error: any) {
            setError(error.message);
        }
    }
    
    return (
        <div>
            <form method="post" onSubmit={handleSubmit}>
                <input type="text" name="countyAndState" className="border-2 border-black m-3"></input>
                <input type="submit" name="submitButton" className="border-2 border-black m-3"></input>
            </form>
            {disasterData && !error && (
                <p className="text-lg font-semibold mt-4">
                    Total earthquakes reported: {disasterData.features.length}
                </p>
            )}
        </div>
    );
}