import { Carousel } from "./carousel/Carousel"

export const Home=()=>{
    return(<>
        <Carousel filterType={'New'} />
        <Carousel filterType={'All'} /> 
        </>
    )
}