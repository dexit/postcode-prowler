import React from 'react';
import { PostcodeApiResponse } from '../types';
import MapComponent from './MapComponent';
import StatusCard from './StatusCard';
import GeographyCard from './GeographyCard';
import AdminCard from './AdminCard';
import CodesCard from './CodesCard';

interface PostcodeResultsProps {
  data: PostcodeApiResponse;
}

const PostcodeResults: React.FC<PostcodeResultsProps> = ({ data }) => {
  if (!data.asf) return null;

  // Helper to apply animation classes with a delay
  const animatedCardClass = (delay: string) => `animate-fade-in-up ${delay}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Map component - spans two columns */}
      {data.api_data?.latitude !== undefined && data.api_data?.longitude !== undefined && (
        <div className={`md:col-span-2 lg:col-span-2 ${animatedCardClass('delay-0')}`} style={{ animationDelay: '0ms' }}>
          <MapComponent
            latitude={data.api_data.latitude}
            longitude={data.api_data.longitude}
            districtBoundaryGeoJson={data.api_data.osm_admin_district_geojson}
            districtName={data.api_data.admin_district}
          />
        </div>
      )}

      {/* Status Card - spans two columns */}
      <div className={`md:col-span-2 lg:col-span-2 ${animatedCardClass('delay-100')}`} style={{ animationDelay: '100ms' }}>
        <StatusCard data={data} />
      </div>

      {/* Geography Card */}
      <div className={`md:col-span-2 lg:col-span-1 ${animatedCardClass('delay-200')}`} style={{ animationDelay: '200ms' }}>
        <GeographyCard data={data} />
      </div>

      {/* Administrative Card */}
      <div className={`md:col-span-2 lg:col-span-3 ${animatedCardClass('delay-300')}`} style={{ animationDelay: '300ms' }}>
        <AdminCard data={data} />
      </div>
      
      {/* Codes Card - spans full width */}
       {data.api_data?.codes && Object.keys(data.api_data.codes).length > 0 && (
        <div className={`col-span-full ${animatedCardClass('delay-400')}`} style={{ animationDelay: '400ms' }}>
          <CodesCard codes={data.api_data.codes} />
        </div>
      )}
    </div>
  );
};

export default PostcodeResults;
