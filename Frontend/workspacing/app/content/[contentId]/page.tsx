"use client";
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const TextEditor = dynamic(() => import('@/components/TextEditor'), { ssr: false });

const ContentIdPage = () => {
    const params = useParams();
    const contentId = Array.isArray(params.contentId) ? params.contentId[0] : params.contentId;

    return (
        <div>
            {contentId ? <TextEditor contentId={contentId} /> : <div>Loading editor...</div>}
        </div>
    );
};

export default ContentIdPage;
