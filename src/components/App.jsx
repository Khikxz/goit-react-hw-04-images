import {useState, useEffect} from 'react';
import {Button} from './Button/Button';
import {ImageGallery} from './ImageGallery/ImageGallery';
import {Loader} from './Loader/Loader';
import {Searchbar} from './Searchbar/Searchbar';
import { getAPI } from '../pixelbay-api';


export const App = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  // async componentDidUpdate(_prevProps, prevState){
  //   if(prevState.searchQuery !== searchQuery || prevState.currentPage !== currentPage){
  //     await fetchImages();
  //   }
  // }

  useEffect(()=> {
    const fetchImages = async () => {
      if (!searchQuery) return;
      
      setIsLoading(true);
      setIsError(false);
  
      try {
        const response = await getAPI(searchQuery, currentPage);
        const { totalHits, hits } = response;

        setImages(prev => (currentPage === 1 ? hits : [...prev, ...hits]));
        setIsLoading(false);
        setIsEnd(images.length + hits.length >= totalHits);
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
        alert(`An error occurred while fetching data: ${error}`);
      }
    }

    fetchImages();
  },[searchQuery, currentPage]);

  const handleSearchSubmit = query => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedCurrentQuery = searchQuery.toLocaleLowerCase();

    if (normalizedQuery === ''){
      alert('Empty string is not a valid search query. PLease type again.');
      return;
    }

    if (normalizedQuery === normalizedCurrentQuery){
      alert('Search query is the same as the previous one. Please provide a new search query.');
      return;
    }

    if (normalizedQuery !== normalizedCurrentQuery){
      setSearchQuery(normalizedQuery);
      setCurrentPage(1);
      setImages([]);
      setIsEnd(false);
    }
  };

  const handleLoadMore = () => {
    if (!isEnd) { 
      setCurrentPage(prevCurrentPage => prevCurrentPage + 1)

      
      } else {
      alert("You've reached the end of the search results.");
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 40,
        color: '#010101'
      }}
    >
      React Homework 03: Image Finder
      <Searchbar onSubmit={handleSearchSubmit}/>
      <ImageGallery images={images}/>
      {isLoading && <Loader />}
      {!isLoading && !isError && images.length > 0 && !isEnd && (
        <Button onClick={handleLoadMore} />
      )}
      {isError && <p>Something went wrong. Please try again later.</p>}
    </div>
  );
};
