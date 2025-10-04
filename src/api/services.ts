// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const artWorkApi = createApi({
    reducerPath: "artWorkApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://api.artic.edu/api/v1/" }),
    endpoints: (builder) => ({
        getArtWorks: builder.query<any, {}>({
            query: (page) => `artworks?page=${page || 1}`,
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetArtWorksQuery } = artWorkApi;