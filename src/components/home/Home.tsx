import { Carousel } from "../carousel/Carousel"

export const Home = () => {
    return (
        <>
            <Carousel filterType={'New'} showLabel={true} />
            <Carousel filterType={'All'} showLabel={true} />
        </>
    )
}