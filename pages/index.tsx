import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import { sanityClient, urlFor } from '../sanity';
import { Collection } from '../typings';

interface Props {
  collections: Collection[],
}

const Home = ({ collections }: Props) => {
  console.log(collections);



  return (
    <div className="max-w-6xl mx-auto min-h-screen flex flex-col">
      <Head>
        <title>NFT drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className='flex items-center justify-between'>
        <h1 className=" text-4xl mb-10 font-extralight sm:w-80 cursor-pointer">  The {" "}<span className="font-extrabold underline decoration-pink-500/50 "> Vivek's </span> {" "} NFT Marketplace</h1>
      </header>


      <main className="bg-slate-100 p-10 shadow-xl shadow-rose-400/20"> 
        <div className="grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {
            collections.map((collection) => {
              return (
                <Link href={`/nft/${collection.slug.current}`}>
                
                <div className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105">
                  <img className="h-96 w-60 rounded-2xl object-cover" src={urlFor(collection.mainImage).url()} alt="" />
                  <div className="p-5 flex flex-col items-center justify-center">
                    <h2 className="text-3xl">{collection.title}</h2>
                    <p className="mt-2 text-gray-400 text-sm">{collection.description}</p>
                  </div>
                </div>
                </Link>
              )
            })
          }
        </div>
      </main>



    </div>
  )
}

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type=="collection"]{
    _id,
    title,
    address,
    nftCollectionName,
    description,
    mainImage{
    asset
     }, 
    previewImage{
      asset
    },
    slug{
      current
    },
    creator->{
      _id,
      name,
      address,
      slug{
      current
       }
    }
  }`

  const collections = await sanityClient.fetch(query);
  return {
    props: {
      collections
    }
  }

}




