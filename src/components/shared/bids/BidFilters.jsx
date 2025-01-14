//import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import PropTypes from 'prop-types';
import { BID_FILTERS, RICE_VARIETIES } from '../../../constants/bidConstants';

const BidFilters = ({ filters, onFilterChange, onReset }) => {
    return (
        <Card className="mb-6">
            <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                        value={filters.riceVariety}
                        onValueChange={(value) => onFilterChange('riceVariety', value)}
                    >
                        <option value="">All Rice Varieties</option>
                        {Object.entries(RICE_VARIETIES).map(([key, value]) => (
                            <option key={key} value={value}>
                                {value}
                            </option>
                        ))}
                    </Select>

                    <Select
                        value={filters.priceRange}
                        onValueChange={(value) => onFilterChange('priceRange', value)}
                    >
                        {BID_FILTERS.PRICE_RANGES.map((range) => (
                            <option key={range.value} value={range.value}>
                                {range.label}
                            </option>
                        ))}
                    </Select>

                    <Input
                        placeholder="Search by location"
                        value={filters.location}
                        onChange={(e) => onFilterChange('location', e.target.value)}
                    />
                </div>

                <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={onReset} className="mr-2">
                        Reset Filters
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

BidFilters.propTypes = {
    filters: PropTypes.shape({
        riceVariety: PropTypes.string,
        priceRange: PropTypes.string,
        location: PropTypes.string,
    }).isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
};

export default BidFilters;
