import React, { useCallback, useState } from 'react'
import styled from 'styled-components';
import debounce from 'lodash.debounce'
import { appConfig } from '../config';
import { Prediction } from '../components/Prediction';

type Mode = 'DAY' | 'WEEK'

const PageWrapper = styled.div`
  text-align: center;
`;

const RadioForm = styled.div`
  margin-top: 10%;
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

const EnterText = styled.div`
  margin-top: 40px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 35px;
`;

const Input = styled.input`
  max-width: 650px;
  width: 100%;
  font-size: 30px;
  border-radius: 5px;
`;

const getEndpointByMode = (mode: Mode) => {
  switch (mode) {
    case 'DAY':
      return 'predict_day'
    case 'WEEK':
      return 'predict_week'
  }
}

type ClassifierResponse = {
  class: 1 | 0;
  logits: [number, number];
  softmax: [number, number];
}

export const NewsHeadlinePage = () => {
  const [
    recommendation,
    setRecommendation
  ] = useState<ClassifierResponse | null>(null);
  const [
    isLoading,
    setLoading
  ] = useState(false);
  const [
    mode,
    setMode
  ] = useState<Mode>('DAY');
  const [
    headline,
    setHeadline
  ] = useState('');
  const callApi = useCallback(debounce((text: string, mode: Mode) => {
    if (!text || text === '') {
      setRecommendation(null)
    }
    fetch(
      `${appConfig.apiUrl}/${getEndpointByMode(mode)}/${encodeURIComponent(text)}`, 
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then((res) => res.json())
    .then((data) => setRecommendation(data))
    .finally(() => setLoading(false))
  }, appConfig.debounceTime), [])
  return (
    <PageWrapper>
      <RadioForm>
        <Title>
          Predicting stock change after
        </Title>
        <Label>
          <RadioBox
            type={'radio'}
            value={'DAY'}
            checked={mode === 'DAY'}
            onChange={(e) => {
              setMode(e.target.value as Mode)
              callApi(headline, e.target.value as Mode)
            }}
          />
          1 day
        </Label>
        <Label>
          <RadioBox
            type={'radio'}
            value={'WEEK'}
            checked={mode === 'WEEK'}
            onChange={(e) => {
              setMode(e.target.value as Mode)
              callApi(headline, e.target.value as Mode);
            }}
          />
          1 week
        </Label>
      </RadioForm>
      <div>
        <EnterText>
          Enter example news headline:
        </EnterText>
        <Input type={'text'} onChange={(e) => {
          setHeadline(e.target.value)
          if (e.target.value.length > 0) {
            setLoading(true)
          }
          callApi(e.target.value, mode)
        }}/>
        { isLoading && (
            <div>
              Predicting
            </div>
          )
        }
        { recommendation && <Prediction size={'LARGE'} justifyItems={'center'} title={headline} predictedClass={recommendation.class} softmax={recommendation.softmax} />}
      </div>
    </PageWrapper>
  )
}