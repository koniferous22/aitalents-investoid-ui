import React from 'react';
import styled from 'styled-components'
import { CompanySearch } from '../components/CompanySearch';

const SearchWrapper = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const Title = styled.div`
  font-family: 'Nunito Sans', sans-serif;
  font-size: 30px;
`;

export const SearchPage = () => (
  <SearchWrapper>
    <Title>
      Enter company name
    </Title>
    <CompanySearch size={'LARGE'} />
  </SearchWrapper>
);
