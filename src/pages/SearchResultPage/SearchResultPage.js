import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import PackageList from '../../components/PackageList/PackageList';
import ErrorBoundary from '../../ErrorBoundary';
import { getPackages } from '../../redux/SearchResultsSlice';
// import styles from './example.css';

function SearchResultPage() {
  const dispatch = useDispatch();
  const location = useLocation();

  const parsed = queryString.parse(location.search);

  const searchResults = useSelector((state) => state.searchResults);

  useEffect(() => {
    dispatch(getPackages({ searchTerm: parsed.q }));
  }, [searchResults.searchTerm]);

  const loadMore = () => {
    if (searchResults.packs.length && searchResults.loading === 'idle') {
      dispatch(
        getPackages({
          searchTerm: parsed.q,
          offset: searchResults.packs.length,
        })
      );
    }
  };

  return (
    <ErrorBoundary>
      <div className="searchContainer">
        <h2 className="pageTitle">Search Results</h2>
        <p className="pageInstructions">
          Click a package's name to view details.
        </p>
        <section>
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={!searchResults.noMoreResults}
            threshold={1000}
          >
            {searchResults.packs.length > 0 && (
              <PackageList packs={searchResults.packs} />
            )}
          </InfiniteScroll>
          {searchResults.loading === 'pending' && <p>Loading...</p>}
        </section>
      </div>
    </ErrorBoundary>
  );
}

export default SearchResultPage;
