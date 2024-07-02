import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Carousel, IconButton } from "@material-tailwind/react";

const ImageCarousel = ({children}: {children: JSX.Element[]}) => {
  return ( 
    <Carousel 
      className="w-[30em] h-[30em] bg-gray-800 lg:sticky lg:top-0 items-start rounded-lg lg:mt-4 overflow-hidden"
      prevArrow={({ handlePrev }) => (
        <IconButton
          variant="text"
          color="white"
          size="lg"
          onClick={handlePrev}
          className={`!absolute top-2/4 -translate-y-2/4 left-4 bg-opacity-70 bg-gray-700 hover:bg-gray-800 ${children.length <= 1 && "hidden"}`}
        >
          <ChevronLeftIcon strokeWidth={2} className="w-6 h-6" />
        </IconButton>
      )}
      nextArrow={({ handleNext }) => (
        <IconButton
          variant="text"
          color="white"
          size="lg"
          onClick={handleNext}
          className={`!absolute top-2/4 -translate-y-2/4 !right-4 bg-opacity-70 bg-gray-700 hover:bg-gray-800 ${children.length <= 1 && "hidden"}`}
        >
          <ChevronRightIcon strokeWidth={2} className="w-6 h-6" />
        </IconButton>
      )}
    >
      {children}
    </Carousel>
  );
}
 
export default ImageCarousel;