import debounce from 'lodash.debounce';
import styled, { css } from 'styled-components';
import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { appConfig } from '../config';
// @ts-expect-error
import { stringify } from 'query-string';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Size = 'SMALL' | 'LARGE'

const SearchWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  margin-left: 33vw;
  align-items: center;
  width: 67vw;
`;

const SearchInput = styled.input<{ fontSize: Size }>`
  max-width: 650px;
  width: 34vw;
  ${({ fontSize }) => fontSize === 'SMALL'
  ? css`
    font-size: 20px;
  `
  : css`
    font-size: 30px;
  `}
  border-radius: 5px;
`;

const SuggestionsWrapper = styled.div`
  position: absolute;
  text-align: left;
  left: 0px;
  margin-left: 33vw;
  padding: 5px;
  border: 2px solid;
  border-radius: 5px;
  max-width: 650px;
  width: 33vw;
`;

const SearchIcon = styled(FontAwesomeIcon)`
  margin-left: 10px;
  padding: 5px;
  border: 3px solid;
  border-radius: 5px;
  &:hover {
    cursor:pointer;
  }
`;

const SearchLinkWrapper = styled.div`
  &:hover {
    background-color: #CCCCCC;
  }
`;

const SearchLink = styled.div`
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    cursor:pointer;
  }
`

const LoadingWrapper = styled.div`
  margin-left: 10px;
`;

type Props = {
  size: Size;
}

export const CompanySearch = ({ size }: Props) => {
  const [
    searchInput,
    setSearchInput
  ] = useState('');
  const [
    isLoading,
    setLoading
  ] = useState(false);
  const [
    suggestions,
    setSuggestions,
  ] = useState<null | Array<{ id: string; suggestion: string}>>(null)
  const history = useHistory();
  const callSaytApi = useCallback(debounce((text: string) => {
    if (!text || text === '') {
      setSuggestions(null);
    }
    fetch(
      `${appConfig.apiUrl}/sayt/${encodeURIComponent(text)}`, 
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then((res) => res.json())
    .then((data) => {
      setSuggestions(data['found_companies'])
      setTimeout(() => setSuggestions(null), 4000)
    })
    .finally(() => setLoading(false))
  }, appConfig.debounceTime), [])
  return (
    <div>
      <SearchWrapper>
        <SearchInput
          type={'text'}
          fontSize={size}
          onChange={(e) => {
            setSearchInput(e.target.value)
            if (e.target.value.length > 0) {
              setLoading(true)
            }
            callSaytApi(e.target.value)
          }}
        />
        <SearchIcon size={size === 'LARGE' ? '2x' : '1x'} icon={faSearch} onClick={() => history.push(`/results?${stringify({ search: searchInput })}`)} />
        { isLoading === true && <LoadingWrapper>Loading</LoadingWrapper>}
      </SearchWrapper>
      { suggestions && (
        <SuggestionsWrapper>
          { suggestions.length > 0 && suggestions.map(({ id, suggestion }) => (
                <SearchLinkWrapper key={id} onClick={() => history.push(`/results?${stringify({ id })}`)} >
                  <SearchLink>{suggestion}</SearchLink>
                </SearchLinkWrapper>
              ))
          }
          { suggestions && suggestions.length === 0 && !isLoading && <div>No results found</div> }
        </SuggestionsWrapper>
      )}
    </div>
  )
};
