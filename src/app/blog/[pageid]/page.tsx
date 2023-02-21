import getPostMetadata from '@/components/getPostMetadata';
import PostPreview from '@/components/PostPreview';
import Link from 'next/link';

type BlogPageProps = {
    params: {
        pageid: number;
    };
};

type BlogPageLinksProps = {
    maxPage: number;
    currentPage: number;
};

const BlogPageLinks = ({ maxPage, currentPage }: BlogPageLinksProps) => {

    const links = [];
    // currentPage = parseInt(currentPage);

    links.push(<Link className="text-xl p-4" href={`/blog/1`}> &lt;&lt; </Link>);
    links.push(<Link className="text-xl p-4" href={`/blog/${Math.max(1, currentPage - 1)}`}> &lt; </Link>);

    for (let i = 1; i <= maxPage; i++) {
        if (i == currentPage) {
            links.push(<span className="text-2xl font-bold p-4">{i}</span>);
        } else {
            links.push(<Link className="text-xl p-4" href={`/blog/${i}`}>{i}</Link>);
        }
    }

    links.push(<Link className="text-xl p-4" href={`/blog/${Math.min(currentPage + 1, maxPage)}`}> &gt; </Link>);
    links.push(<Link className="text-xl p-4" href={`/blog/${maxPage}`}> &gt;&gt; </Link>);

    return (
        <div className="w-full text-center">
            {links}
        </div>
    );
}

export const generateStaticParams = () => {
    let postMetadata = getPostMetadata();
    const maxPage = Math.ceil(postMetadata.length / 10);
    const params = [];
    for (let i = 1; i <= maxPage; i++) {
        params.push({ pageid: i.toString() });
    }
    return params;
}

const BlogPage = (props: BlogPageProps) => {
    let postMetadata = getPostMetadata();
    const pageid = props.params.pageid;
    // sort postMetadta by date
    postMetadata = postMetadata.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else if (a.date > b.date) {
            return -1;
        } else {
            return 0;
        }
    });

    // extract the first 10 posts
    const maxPage = Math.ceil(postMetadata.length / 10);

    if (postMetadata.length > 10 * pageid) {
        postMetadata = postMetadata.slice(10 * (pageid - 1), 10 * pageid);
    } else {
        postMetadata = postMetadata.slice(postMetadata.length - 10, postMetadata.length);
    }

    const postPreviews = postMetadata.map((post) => (
        <PostPreview
            key={post.slug}
            // backgroundImg={`/images/lab-automation.png`}
            {...post}
        />
    ));

    return (
        <div className="w-full text-left">
            <div className="w-full p-10">
                <div className="max-w-[1240px] mx-auto">
                    <p className="text-xl tracking widget uppercase text-[#5651e5] py-4">
                        Blog
                    </p>
                    <h2 className="py-2">新着順</h2>
                    <div className="pb-10">
                        <BlogPageLinks maxPage={maxPage} currentPage={pageid} />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {postPreviews}
                    </div>
                    <div className='py-10'>
                        <BlogPageLinks maxPage={maxPage} currentPage={pageid} />
                    </div>

                </div>
            </div>

        </div>

    );
};

export default BlogPage;