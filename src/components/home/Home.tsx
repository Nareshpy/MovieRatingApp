import { useSelector } from "react-redux"
import { Carousel } from "../carousel/Carousel"
import { RootState } from "../../app/Store"
import { Shimmer } from "../shimmer/Shimmer";

export const Home = () => {
    const isMoviesLoading = useSelector((state: RootState) => state.movies.isLoading);
    return (
        <>
        {/* <Shimmer></Shimmer> */}
            {isMoviesLoading ? <Shimmer></Shimmer> : <>
                <Carousel filterType={'New'} showLabel={true} />
                <Carousel filterType={'All'} showLabel={true} />
            </>}
        </>
    )
}