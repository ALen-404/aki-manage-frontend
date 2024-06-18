// src/queries.js

import { gql } from '@apollo/client';

export const GET_DATA = gql`
  query GetData(
    $page: Int!
    $pageSize: Int!
    $is_active: String
    $start_date: String
    $end_date: String
    $name: String
    $id: ID
  ) {
    Airdrops(
      page: $page
      pageSize: $pageSize
      is_active: $is_active
      id: $id
      start_date: $start_date
      name: $name
      end_date: $end_date
    ) {
      referralInfo {
        wallet
        twitter
        converted
        referralCode
        referralWallet
        referralNumber
        convertedNumber
        convertedRate
      }
      airdrop_id
      title
      start_date
      end_date
      visitors
      conversions
      microInfluencers
      visitorsGrowth
      referredConversions
      conversionIncrease
      conversionRate
      updateTime
      isOfficial
      listed
      total
      conversionRateGrowthRate
      referredVisitors
    }
  }
`;

export const LOGIN_TOKEN = gql`
  mutation VerifySignature($address: String!, $signature: String!) {
    verifySignature(address: $address, signature: $signature)
  }
`;
export const GET_LEVEL = gql`
  query {
    getAddressLevel
  }
`;
