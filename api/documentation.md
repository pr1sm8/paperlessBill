# api format

    {
    storeId : string,
    storeUpi : string,
    storeGSTRegistryNo : string,
    orderNumber : number,
    orderDate : date
    products : [
        {
            productId : string,
            productName : string,
            productQuantity : number,
            productExpiry : date,
            productGST : float,
            productPrice : float,
            recyclableElements : [
                {
                    elementName : string,
                    elementType : string,
                    elementQuantity : string
                }
            ]
        }
    ]
    }
