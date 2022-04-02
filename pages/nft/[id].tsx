import React, { useEffect, useState } from 'react'
import { useAddress, useDisconnect, useMetamask, useNFTDrop } from "@thirdweb-dev/react";
import { GetServerSideProps } from 'next';
import { sanityClient, urlFor } from '../../sanity';
import { id } from 'ethers/lib/utils';
import { Collection } from '../../typings';
import Link from 'next/link';
import { BigNumber } from 'ethers';
import toast ,{Toaster} from 'react-hot-toast';

interface Props {
    collection: Collection
}//gdfgds

function NftDropPage({ collection }: Props) {
    const [claimedSupply, setClaimedSupply] = useState<number>(0);
    const [totalSupply, setTotalSupply] = useState<BigNumber>();
    const [loading, setLoading] = useState<boolean>(true);
    const [priceETH, setPriceETH] = useState<string>();


    //auth part
    const connectWithMetamask = useMetamask();
    const address = useAddress();
    const disconnect = useDisconnect();
    const nftDrop = useNFTDrop(collection.address);
    //to get prices

    useEffect(()=>{
        if(!nftDrop) return;
       const fetPrice = async()=>{
        const claimCondtions=await nftDrop.claimConditions.getAll();
         setPriceETH(claimCondtions?.[0].currencyMetadata.displayValue);
       }
       fetPrice();
    },[nftDrop])

    useEffect(() => {
        if (!nftDrop) return;
        const fetchNFTDropData = async () => {
            setLoading(true);
            const claimed = await nftDrop.getAllClaimed();
            const total = await nftDrop.totalSupply();
            setClaimedSupply(claimed.length);
            setTotalSupply(total);
            setLoading(false);
        }
        fetchNFTDropData();

    }, [nftDrop])

    const mintNFT=()=>{
      if(!nftDrop || !address) return;
      const quantity=1;
      setLoading(true);
      const notification=toast.loading("Minting...",{style:{
          background:"white",
          color:"green",
          fontWeight:"bolder",
          fontSize:"17px",
          padding:"20px"

      }})
      nftDrop.claimTo(address, quantity)
      .then(async(tx)=>{
          
          const receipt = tx[0].receipt//transaction recept
          const claimedToekenID=tx[0].id;//id of nft claimed
          const claimedNFT=await tx[0].data();//(optional) get nft netadata
          toast("You Successfully Minted!!",{
            duration:8000,
              style:{
                background:"white",
                color:"green",
                fontWeight:"bolder",
                fontSize:"17px",
                padding:"20px"


          }})
          console.log(receipt);
          console.log(claimedToekenID);
          console.log(claimedNFT);

          

      }).catch((err)=>{
          console.log(err);
          toast("Woops Something Went Wrong !!",{style:{
            background:"red",
            color:"green",
            fontWeight:"bolder",
            fontSize:"17px",
            padding:"20px"

          }})
          
      }).finally(()=>{
          setLoading(false);
          toast.dismiss(notification);
      })

    }

    return (
        <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
            <Toaster position="bottom-right" />
            {/* left */}
            <div className="lg:col-span-4 bg-gradient-to-br from-cyan-800 to-rose-500">
                <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
                    <div className="bg-gradient-to-br from-yellow-400 to purple-600 p-2 rounded-xl">
                        <img className="w-44 rounded-xl object-cover lg:h-96 lg:w-72" src={urlFor(collection.previewImage).url()} alt="" />

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
                    <button onClick={() => (address ? disconnect() : connectWithMetamask())} className="rounded-full bg-rose-400 text-white px-2 py-2 text-xs font-bold lg:px-5 lg:py-3 lg:text-base">{address ? "Sign Out" : "Sign In"}</button>
                </header>
                <hr className='my-2 border' />
                {
                    address && (
                        <p className="text-center text-sm text-rose-400">You are logged in with wallet {address.substring(0, 5)}...{address.substring(address.length - 5)}</p>
                    )
                }
                {/* content */}
                <div className="mt-10 flex flex-col flex-1 items-center space-y-6 lg:space-y-0 lg:justify-center text-center">
                    <img className="w-80 lg:h-40 pb-10 object-cover" src={urlFor(collection.mainImage).url()} alt="" />
                    <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">{collection.title}</h1>
                    {
                        loading ? (
                            <>
                                <p className="pt-2 text-xl animate-pulse text-violet-500">Loading Supply Count ...</p>
                                <img className="h-80 w-80 object-contain mt-10" src="https://i.pinimg.com/originals/ed/23/68/ed23685339ada1b6d88008cbe1a11e98.gif" alt="" />
                            </>

                        ) : (

                            <p className="pt-2 text-xl text-green-500">{claimedSupply}/{totalSupply?.toString()} NFT's claimed</p>
                        )
                    }
                </div>
                <button onClick={mintNFT} disabled={totalSupply?.toNumber() === claimedSupply || loading || !address} className="w-full h-12 font-bold bg-red-600 rounded-full text-white disabled:bg-gray-400">
                    {
                        loading?(
                            <>Loading...</>
                        ):claimedSupply===totalSupply?.toNumber()?(
                            <>SOLD OUT</>
                        ):!address ?(
                            <>Sign In to Mint</>
                        ):(

                          <span>  Mint NFT ({priceETH} ETH)</span>
                        )
                    }

                </button>
            </div>
        </div>
    )
}

export default NftDropPage


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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

    const collection = await sanityClient.fetch(query, {
        id: params?.id
    })

    if (!collection.description) {
        return {
            notFound: true,
        }

    }

    return {
        props: {
            collection
        }
    }



}