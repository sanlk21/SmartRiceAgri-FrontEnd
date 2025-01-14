import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useState } from 'react';
import BidCard from '../../components/shared/BidCard';
import { bidService } from '../../services/bidService'; // Correctly import bidService

const BidSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    riceVariety: '',
    location: '',
    priceRange: '',
    status: '',
  });

  const handleSearch = async () => {
    try {
      // Implement API call for search
      const results = await bidService.searchBids(searchParams);
      setSearchResults(results);
    } catch (error) {
      console.error('Error during bid search:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Search Bids</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search filters */}
          <Input
            placeholder="Search by keywords"
            value={searchParams.keyword}
            onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
          />
          <Select
            value={searchParams.riceVariety}
            onValueChange={(value) =>
              setSearchParams({ ...searchParams, riceVariety: value })
            }
          >
            <option value="">All Rice Varieties</option>
            <option value="SAMBA">Samba</option>
            <option value="NADU">Nadu</option>
            <option value="BASMATI">Basmati</option>
          </Select>
          {/* Add additional filters if necessary */}
        </div>
        <button onClick={handleSearch} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>
      <div className="grid gap-4">
        {searchResults.map((bid) => (
          <BidCard key={bid.id} bid={bid} />
        ))}
      </div>
    </div>
  );
};

export default BidSearch;
