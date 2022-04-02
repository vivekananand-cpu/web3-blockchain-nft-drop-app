interface Image{
    asset:{
        url:String
    }
}

export interface Creator{
    _id:String,
    name:String,
    adress:String,
    slug:{
        current:String,

    }
    image:Image
    bio:String
}

export interface Collection{
    _id:String,
    tilte:String,
    description:String,
    nftCollectionName:String,
    adress:String,
    slug:{
        current:String,

    }
    creator:Creator,
    mainImage:Image,
    previewImage:Image,
}