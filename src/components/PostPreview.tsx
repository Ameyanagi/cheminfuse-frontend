import Link from "next/link";
import { PostMetadata } from "./PostMetadata";
import Image from "next/image";

const postPreview = (props: PostMetadata) => {
    return (
        <div className="relative flex items-center justify-center h-[300px] w-[300px] shadow-xl shadow-gray-400 rounded-xl group bg-gradient-to-r from-[#548DFF] to-[#548DFF99] mx-auto">
            <Link href={`/posts/${props.slug}`}>
            <Image
                src={props.eyecatch}
                width={300}
                height={300}
                className="rounded-xl opacity-20 group-hover:opacity-5 object-fill"
                alt={props.title}
            />
            
            <div className="absolute w-[80%] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <h3 className='text-2xl text-white traking-wider text-center'>{props.title}</h3>
                <p className='pb-2 pt-2 text-white text-center'>{props.subtitle}</p>
                <p className='pb-2 pt-2 text-white text-center'>{props.date}</p>
                    {/* <p className='text-center py-3 rounded-lg bg-white text-[#404040] font-bold text-xl'>記事を読む</p> */}
                
            </div>
            </Link>
        </div>
    )
};

export default postPreview;