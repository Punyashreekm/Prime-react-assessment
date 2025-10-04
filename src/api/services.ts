// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export interface ArtWork {
    id: number;
    title: string;
    artist_display: string;
    date_display: string;
    image_id: string;
    medium_display: string;
    dimensions: string;
    credit_line: string;
    [key: string]: unknown; // Accepts any additional attributes
}

// Define a service using a base URL and expected endpoints
export const artWorkApi = createApi({
    reducerPath: 'artWorkApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.artic.edu/api/v1/' }),
    endpoints: (builder) => ({
        getArtWorks: builder.query<ArtWork, string>({
            query: (page) => `artworks?page=${page || 1}`,
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetArtWorksQuery } = artWorkApi