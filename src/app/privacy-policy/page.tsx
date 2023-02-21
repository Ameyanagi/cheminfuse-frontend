import Link from "next/link";

const PrivacyPage = () => {


    return (
        <div className="w-full p-10">
            <div className="max-w-[1240px] m-auto w-full">
                <p className="text-xl tracking widget uppercase text-[#5651e5] py-4">
                    Privacy Policy
                </p>


                <div className='bg-white rounded-xl p-5 border-b border-gray-200'>
                    <p>当サイトは、お客様の個人情報を適切に管理し、以下のプライバシーポリシーに従って収集、使用、保存しています。</p>
                    <h2 className='text-2xl py-4'>1. 収集される情報</h2>
                    <p>当サイトは、お客様の利用に際して、名前、メールアドレス、電話番号などの個人情報を収集する場合があります。また、当社のウェブサイトの利用履歴、IPアドレス、Cookie情報などの非個人情報も収集する場合があります。</p>
                    <h2 className='text-2xl py-4'>2. 収集目的</h2>
                    <p>当サイトは、収集した個人情報を以下の目的のために使用することがあります。</p>
                    <ul className='list-disc pl-10 py-4'>
                        <li>商サービスの提供</li>
                        <li>お問い合わせ対応</li>
                        <li>当社のサービス改善のための分析</li>
                    </ul>
                    <h2 className='text-2xl py-4'>3. 個人情報の管理</h2>
                    <p>当サイトは、収集した個人情報を適切に管理し、第三者に提供することはありません。ただし、以下の場合を除きます。</p>
                    <ul className='list-disc pl-10 py-4'>
                        <li>法律に基づく要請がある場合</li>
                        <li>お客様が同意した場合</li>
                    </ul>
                    <h2 className='text-2xl py-4'>4. Cookieについて</h2>
                    <p>当サイトは、お客様が当社のウェブサイトをより便利に利用できるように、Cookieを使用する場合があります。Cookieは、お客様のブラウザに保存される情報であり、お客様が当社のウェブサイトに再度アクセスした際に、よりスムーズに利用できるようになります。ただし、Cookie情報は匿名情報であり、個人情報を収集するものではありません。</p>
                    <h2 className='text-2xl py-4'>5. プライバシーポリシーの変更について</h2>
                    <p>当サイトは、プライバシーポリシーの内容を変更する場合があります。変更があった場合は、当社のウェブサイト上に掲載しますので、定期的に確認することをおすすめします。</p>
                    <h2 className='text-2xl py-4'>6. お問い合わせ先</h2>
                    <p>当社の個人情報保護に関するお問い合わせは、<Link href="/contact" className="underline">Contactページ</Link>よりお願いいたします。</p>
                    
                </div>



            </div>
        </div>
    );
};

export default PrivacyPage;