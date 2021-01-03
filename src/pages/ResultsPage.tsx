import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
// @ts-expect-error
import { parse } from 'query-string';
import { appConfig } from '../config';
// @ts-expect-error
import { stringify } from 'query-string'
import { Prediction } from '../components/Prediction';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useInView } from 'react-intersection-observer';
import { CompanySearch } from '../components/CompanySearch';

type Mode = 'DAY' | 'WEEK'

const getEndpointByMode = (mode: Mode) => {
  switch (mode) {
    case 'DAY':
      return 'results_day'
    case 'WEEK':
      return 'results_week'
  }
}

type SearchResultResponse = {
  class: 1 | 0;
  logits: [number, number];
  softmax: [number, number];
  entity: string;
  foundBy: string;
  stockLabel: string;
  text: string;
  title: string;
};

const EntryTop = styled.div`
  font-size: 30px;
  font-family: 'Nunito Sans', sans-serif;
  i {
    font-size: 20px;
  }
`;

const CollapseDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  i {
    font-family: 'Nunito Sans', sans-serif;
  }
`;

const TextDiv = styled.div`
  width: 70vw;
  font-family: 'Raleway', sans-serif;
`

const Entry = ({ stockLabel, entity, foundBy, title, text, class: class_, softmax, isLast, onLoad }: SearchResultResponse & { isLast: boolean; onLoad: () => void }) => {
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0.1,
  });
  const [
    isTextOpen,
    setTextOpen
  ] = useState(false);
  useEffect(() => {
    if (entry?.isIntersecting) {
      onLoad();
    }
  }, [entry?.isIntersecting]);
  return (
    <div ref={isLast ? ref : null}>
      <EntryTop>
        <strong>{`[${stockLabel}] `}</strong>
        <span>{entity}</span>
        <i>{` (Found by phrase: '${foundBy}')`}</i>
      </EntryTop>
      <Prediction justifyItems={'space-between'} size={'SMALL'} title={title} predictedClass={class_} softmax={softmax} />
      { !isTextOpen && (
        <CollapseDiv onClick={() => setTextOpen(true)}>
          <i>{`Click here to display text  `}</i>
          <FontAwesomeIcon icon={faArrowDown} size={'2x'} />
        </CollapseDiv>
      )}
      { isTextOpen && (
        <>
          <FontAwesomeIcon icon={faArrowUp} size={'3x'} onClick={() => setTextOpen(false)} />
          <TextDiv>
            {text}
          </TextDiv>
        </>
      )}
      <hr />
    </div>
  )
};

type ResponsePool = Record<
  Mode,
  {
    pageCount: number;
    data: Array<Array<SearchResultResponse>>;
  }
>
const RadioForm = styled.div`
  margin-top: 30px;
  margin-bottom: 60px;
`;

const RadioBox = styled.input`
  width: 20px;
`;

const Title = styled.div`
  font-family: 'Nunito Sans', sans-serif;
  font-size: 30px;
`;

const Label = styled.label`
  font-family: 'Nunito Sans', sans-serif;
  font-size: 20px;
`;

const PageWrapper = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ResultsPage = () => {
  const location = useLocation();
  const [
    mode,
    setMode
  ] = useState<Mode>('DAY');
  const [
    entries,
    setEntries
  ] = useState<ResponsePool>({
        'DAY': {
          data: [],
          pageCount: 1
        },
        'WEEK': {
          data: [],
          pageCount: 1
        },
      })
  // TODO type inference with query-string doesn't work, issues with installing @types/query-string
  const callSearchResults = useCallback((text: string) =>
    fetch(
      `${appConfig.apiUrl}/search/${encodeURIComponent(text)}`, 
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then((res) => res.json())
    .then((data) => setIds(data['found_ids']))
    .finally(() => setLoading(false)),
    []
  )
    const callArticles = useCallback((ids: string[], mode: Mode, page: number, pageLimit: number) => {
      if (page > pageLimit) {
        return
      }
      return fetch(
          `${appConfig.apiUrl}/${getEndpointByMode(mode)}?${stringify({ id: ids, page })}`, 
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        ).then((res) => res.json())
        .then(({ pageCount, data }: { pageCount: number, data: Array<SearchResultResponse>}) => setEntries((prevEntries) => ({
          ...prevEntries,
          [mode]: {
            pageCount,
            data: [...prevEntries[mode].data, data ]
          }
        })))
        .finally(() => setLoading(false))
      },
      []
    )
  const { id, search }: { id: string; search: string} = parse(location.search);
  const [
    isLoading,
    setLoading
  ] = useState(false)
  const [
    ids,
    setIds
  ] = useState<null | string[]>(null)
  const [
    error,
    setError
  ] = useState<null | string>(null)
  useEffect(() => {
    if (id && id.length > 0) {
      setIds([id])
    }
    else if (search && search.length > 0) {
      setLoading(true);
      callSearchResults(search)
    } else {
      setError('No input received');
    }
  }, [id, search])
  useEffect(() => {
    if (ids) {
      callArticles(ids, mode, 1, 1)
    }
  }, [ids, mode])
  if (error) {
    return <div>{error}</div>
  }
  if (isLoading) {
    return <div>Loading</div>
  }
  return (
    <PageWrapper>
      <CompanySearch size={'SMALL'}/>
      <RadioForm>
        <Title>
          Predicting stock change after
        </Title>
        <Label>
          <RadioBox
            type={'radio'}
            value={'DAY'}
            checked={mode === 'DAY'}
            onChange={(e) => setMode(e.target.value as Mode)}
          />
          1 day
        </Label>
        <Label>
          <RadioBox
            type={'radio'}
            value={'WEEK'}
            checked={mode === 'WEEK'}
            onChange={(e) => setMode(e.target.value as Mode)}
          />
          1 week
        </Label>
      </RadioForm>
      <div>
        {
          ids && entries && entries[mode].data.map((entryPage, pageIndex) => (
            <div key={pageIndex}>
              {
                entryPage.map((entry, index) => (
                  <Entry
                    {...entry}
                    isLast={pageIndex === entries[mode].data.length - 1 && index === entryPage.length - 1}
                    onLoad={() => callArticles(ids, mode, entries[mode].data.length, entries[mode].pageCount)}
                  />
                ))
              }
            </div>
          ))
        }
      </div>
    </PageWrapper>
  )
};
