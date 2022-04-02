import React from 'react'
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import { GetServerSideProps } from 'next';
import { sanityClient, urlFor } from '../../sanity';
import { id } from 'ethers/lib/utils';
import { Collection } from '../../typings';
import Link from 'next/link';

interface Props {
    collection: Collection
}//gdfgds

function NftDropPage({collection}:Props) {
    //auth part
    const connectWithMetamask =useMetamask();
    const adress=useAddress();
    const disconnect =useDisconnect();
    console.log(adress);
    
    return (
        <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
            {/* left */}
            <div className="lg:col-span-4 bg-gradient-to-br from-cyan-800 to-rose-500">
                <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
                    <div className="bg-gradient-to-br from-yellow-400 to purple-600 p-2 rounded-xl">
                    <img className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"  src={urlFor(collection.previewImage).url()} alt="" />

                    </div>
                    <div className="text-center p-5 space-2">

                <h1 className="text-4xl text-white font-bold">{collection.nftCollectionName}</h1>
                <h2 className="text-xl text-gray-300">{collection.description}</h2>
                    </div>
                </div>
            </div>

            {/* right */}
            <div className="flex flex-col flex-1 p-12 lg:col-span-6">
                {/* header */}
                <header className='flex items-center justify-between'>
                    <Link href='/'>
                  <h1 className="w-52 text-xl font-extralight sm:w-80 cursor-pointer">  The {" "}<span className="font-extrabold underline decoration-pink-500/50 "> Vivek's </span> {" "} NFT Marketplace</h1>
                  </Link>
                    <button onClick={()=>(adress ? disconnect() : connectWithMetamask())} className="rounded-full bg-rose-400 text-white px-2 py-2 text-xs font-bold lg:px-5 lg:py-3 lg:text-base">{adress?"Sign Out" : "Sign In"}</button>
                </header>
                <hr  className='my-2 border'/>
                {
                    adress &&(
                        <p className="text-center text-sm text-rose-400">You are logged in with wallet {adress.substring(0,5)}...{adress.substring(adress.length-5)}</p>
                    )
                }
                {/* content */}
                <div className="mt-10 flex flex-col flex-1 items-center space-y-6 lg:space-y-0 lg:justify-center text-center">
                    <img className="w-80 lg:h-40 pb-10 object-cover"  src={urlFor(collection.mainImage).url()} alt="" />
                    <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">{collection.title}</h1>
                    <p className="pt-2 text-xl text-green-500">13/21 NFT's claimed</p>
                </div>
                <button className="w-full h-12 font-bold bg-red-600 rounded-full text-white">Mint NFT (0.0 ETH)</button>
            </div>
        </div>
    )
}

export default NftDropPage


export const getServerSideProps: GetServerSideProps=async ({params})=>{
    const query = `*[_type=="collection" && slug.current==$id][0]{
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

      const collection= await sanityClient.fetch(query,{
           id : params?.id
      })

      if(!collection.description){
          return{
              notFound:true,
          }

      }

      return {
          props:{
              collection
          }
      }



}