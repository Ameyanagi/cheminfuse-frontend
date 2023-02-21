import fs from 'fs';
import Markdown from 'markdown-to-jsx';
import matter from 'gray-matter';
import getPostMetadata from '@/components/getPostMetadata';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';

const getPostContent = (slug: string) => {
    const folder = 'src/posts';
    const file = `${folder}/${slug}.md`;
    const content = fs.readFileSync(file, 'utf8');
    const matterResult = matter(content);

    if (matterResult.data.eyecatch === undefined) {
        matterResult.data.eyecatch = '/images/lab-automation.png';
    }

    return matterResult;
};

// export const getStaticParams = async () => {
//     return [{slug: "aws-quickstart"}];
// };

export const generateStaticParams = async () => {
    const posts = getPostMetadata();
    return posts.map((post) => ({
        slug: post.slug,
    }));
};


const PostPage = (props: any) => {
    const slug = props.params.slug;
    const post = getPostContent(slug);


    return (
        <div className="max-w-[1240px] grid grid-cols-4 mx-auto">
            <div className='col-span-4 md:col-span-3'>
                <article className='prose max-w-none rounded-3xl shadow-xl bg-white mx-4 my-4'>
                    <div className='relative top-0 left-0 w-full h-[30vh] bg-black rounded-t-3xl z-0'>
                        <Image
                            src={post.data.eyecatch}
                            // width={1240}
                            // height={400}
                            fill

                            className="rounded-t-3xl object-cover m-auto opacity-50"
                            alt={post.data.title}
                        />
                        <h1 className='relative flex justify-center text-white opacity-100 items-center w-full h-[30vh] '>{post.data.title}</h1>
                    </div>

                    <div className='p-5'>
                        <Markdown>{post.content}</Markdown>
                    </div>

                </article>
            </div>
            <div className='my-4'>
                <Sidebar />
            </div>

        </div>


    );
};

export default PostPage;