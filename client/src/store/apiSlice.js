import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TokenManager } from '../lib/auth'

const API_BASE_URL = 'http://localhost:5000/api'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState, endpoint }) => {
      // Add patient token for patient endpoints (except login)
      const patientEndpoints = ['getPatientProfile', 'getPatientDietCharts', 'getPatientDietChart', 'patientLogout']
      if (patientEndpoints.includes(endpoint)) {
        const authHeaders = TokenManager.getAuthHeader()
        Object.entries(authHeaders).forEach(([key, value]) => {
          headers.set(key.toLowerCase(), value)
        })
      }
      return headers
    },
  }),
  tagTypes: ['Patient', 'DietChart'],
  endpoints: (builder) => ({
    // Doctor endpoints
    addPatient: builder.mutation({
      query: (patientData) => ({
        url: '/doctor/add-patient',
        method: 'POST',
        body: patientData,
      }),
      invalidatesTags: ['Patient'],
    }),
    getPatients: builder.query({
      query: (addedBy) => ({
        url: `/doctor/patients${addedBy ? `?addedBy=${addedBy}` : ''}`,
      }),
      providesTags: ['Patient'],
    }),
    getPatient: builder.query({
      query: (id) => `/doctor/patient/${id}`,
      providesTags: (result, error, id) => [{ type: 'Patient', id }],
    }),
    updatePatient: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/doctor/patient/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Patient', id }],
    }),
    deletePatient: builder.mutation({
      query: (id) => ({
        url: `/doctor/patient/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Patient'],
    }),
    generateDietChart: builder.mutation({
      query: (id) => ({
        url: `/doctor/patient/${id}/generate-diet`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Patient', id }, 'DietChart'],
    }),
    updateDietChart: builder.mutation({
      query: ({ id, chartIndex, diet, notes }) => ({
        url: `/doctor/patient/${id}/diet-chart/${chartIndex}`,
        method: 'PUT',
        body: { diet, notes },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Patient', id }, 'DietChart'],
    }),
    deleteDietChart: builder.mutation({
      query: ({ id, chartIndex }) => ({
        url: `/doctor/patient/${id}/diet-chart/${chartIndex}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Patient', id }, 'DietChart'],
    }),
    getPatientCredentials: builder.mutation({
      query: (id) => ({
        url: `/doctor/patient/${id}/credentials`,
        method: 'GET',
      }),
    }),

    // Patient endpoints
    patientLogin: builder.mutation({
      query: (credentials) => ({
        url: '/patient/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    patientLogout: builder.mutation({
      query: () => ({
        url: '/patient/logout',
        method: 'POST',
      }),
      // Always clear local auth data regardless of server response
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        TokenManager.clearAll()
        try {
          await queryFulfilled
        } catch (error) {
          // Even if server logout fails, we've cleared local data
          console.warn('Server logout failed, but local data cleared:', error)
        }
      }
    }),
    getPatientProfile: builder.query({
      query: () => '/patient/profile',
      providesTags: ['Patient'],
    }),
    getPatientDietCharts: builder.query({
      query: () => '/patient/diet-charts',
      providesTags: ['DietChart'],
    }),
    getPatientDietChart: builder.query({
      query: (index) => `/patient/diet-chart/${index}`,
    }),
  }),
})

export const {
  // Doctor hooks
  useAddPatientMutation,
  useGetPatientsQuery,
  useGetPatientQuery,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useGenerateDietChartMutation,
  useUpdateDietChartMutation,
  useDeleteDietChartMutation,
  useGetPatientCredentialsMutation,
  
  // Patient hooks
  usePatientLoginMutation,
  usePatientLogoutMutation,
  useGetPatientProfileQuery,
  useGetPatientDietChartsQuery,
  useGetPatientDietChartQuery,
} = apiSlice