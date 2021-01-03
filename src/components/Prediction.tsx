import styled, { css } from 'styled-components';
import { faChartLine, faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { DonutChart } from './DonutChart';

type Size = 'SMALL' | 'LARGE'
type justifyItems = 'center' | 'space-between'

type Props = {
  softmax: [number, number];
  title: string;
  predictedClass: 0 | 1;
  size: Size;
  justifyItems: justifyItems;
}

const PredictionWrapper = styled.div<{ justifyFlexItems: justifyItems }>`
  display: flex;
  flex-direction: row;
  ${({ justifyFlexItems }) => css`
    justify-content: ${justifyFlexItems};
  `}
  ${({ justifyFlexItems }) => justifyFlexItems === 'space-between' &&  css`
    width: 70vw;

  `}
  align-items: center;
`;

const TitleWrapper = styled.div<{size: Size}>`
  font-family: 'Nunito Sans', sans-serif;
  margin: 40px;
  ${({ size }) => size === 'LARGE'
    ? css`
      font-size: 30px;
    `
    : css`
      font-size: 20px;
    `}
`;

export const Prediction = ({ softmax, predictedClass, title, size, justifyItems }: Props) => (
  <PredictionWrapper justifyFlexItems={justifyItems}>
    {
      predictedClass === 1 && (
        <FontAwesomeIcon color={'#009688'} size={size === 'LARGE' ? '10x' : '5x'} icon={faChartLine} />
      )
    }
    {
      predictedClass === 0 && (
        <FontAwesomeIcon color={'#662244'} size={size === 'LARGE' ? '10x' : '5x'}icon={faMinusSquare} />
      )
    }
    <TitleWrapper size={size}>
      {
        title.length > 0 && `'${title}'`
      }
    </TitleWrapper>
    <DonutChart
      size={size === 'LARGE' ? 120 : 90}
      strokewidth={size === 'LARGE' ? 26 : 15}
      value={softmax[predictedClass] * 100}
      valType={predictedClass === 1 ? 'POSITIVE' : 'NEGATIVE'}
    />
  </PredictionWrapper>
)