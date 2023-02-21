import fs from 'fs';
import matter from 'gray-matter';
import { PostMetadata } from '@/components/PostMetadata';

const getPostMetadata = (): PostMetadata[] => {
    const folder = 'src/posts';
    const files = fs.readdirSync(folder);
    const markdownPosts = files.filter((file) => file.endsWith('.md'));

    // Get gray-matter data from each post
    const posts = markdownPosts.map((fileName) => {
        const fileContents = fs.readFileSync(`src/posts/${fileName}`, 'utf8');
        const matterResult = matter(fileContents);        
        let eyecatch = matterResult.data.eyecatch;
        if (eyecatch === undefined) {
            eyecatch = '/images/lab-automation.png';
        }

        return {
            title: matterResult.data.title,
            date: matterResult.data.date,
            subtitle: matterResult.data.subtitle,
            slug: fileName.replace('.md', ''),
            backgroundImg: matterResult.data.backgroundImg,
            eyecatch: eyecatch,
        };
    });

    return posts;
};

export default getPostMetadata;