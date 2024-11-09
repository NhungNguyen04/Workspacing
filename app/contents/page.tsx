"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ContentPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContentId = async () => {
            try {
                // Fetch new contentId from the API route
                const response = await fetch('/api/generateId');
                const data = await response.json();
                const newContentId = data.contentId;

                // Redirect to the new content URL
                router.replace(`/contents/${newContentId}`);
            } catch (error) {
                console.error("Error generating content ID:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContentId();
    }, [router]);

    // Optionally, render a loading state while redirecting
    return <div>{loading ? "Loading..." : "Redirecting..."}</div>;
};

export default ContentPage;
