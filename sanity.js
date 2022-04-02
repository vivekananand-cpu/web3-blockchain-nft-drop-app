
import { createCurrentUserHook,createClient } from "next-sanity";
import createImageUrlBuilder from '@sanity/image-url'

export const config={
  dataset:process.env.NEXT_PUBLIC_SANITY_PROJECT_DATASET || "production",
  projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  appVersion:"2022-4-1",
  useCdn:process.env.NODE_ENV === "production"
};

export const sanityClient =createClient(config);


export const urlFor=(source)=> createImageUrlBuilder(config).image(source)
//https://nft-app.sanity.studio/