import React from 'react';
import styled, { css } from 'styled-components';

const DonutChartSVG = styled.svg`
  display: block;
`;

const DonutChartBackTrack = styled.circle<{ strokewidth: Props['strokewidth'] }>`
  fill: transparent;
  stroke: #DAE2E5;
  // TODO refactor from props
  stroke-width: 26;
`;

const DonutChartTrack = styled.circle<{ valType: Props['valType']; strokewidth: Props['strokewidth']; }>`
  fill: transparent;
  ${(props) => (
    props.valType === 'POSITIVE'
      ? css`
        stroke: #009688;
      `
      : css`
        stroke: #662244;
      `
  )}
  stroke-width: 26;
  stroke-dasharray: 0 10000;
  transition: stroke-dasharray .3s ease;
`;

const Text = styled.text`
  font-family: 'Roboto';
  fill: #607580;
`;

const TextVal = styled.tspan`
  font-size:22px;
`;

const TextPercent = styled.tspan`
  font-size:14px;
`;
const TextLabel = styled.tspan`
  font-size:9px;
`;

type Props = {
  size: number;
  strokewidth: number;
  value: number;
  valType: 'POSITIVE' | 'NEGATIVE';
};

export const DonutChart = ({ size, strokewidth, value, valType }: Props) => {
  const halfsize = (size * 0.5);
  const radius = halfsize - (strokewidth * 0.5);
  const circumference = 2 * Math.PI * radius;
  const strokeval = ((value * circumference) / 100);
  const dashval = (strokeval + ' ' + circumference);

  const trackstyle = {strokeWidth: strokewidth};
  const indicatorstyle = {strokeWidth: strokewidth, strokeDasharray: dashval}
  const rotateval = 'rotate(-90 '+halfsize+','+halfsize+')';

  return (
    <DonutChartSVG width={size} height={size} >
      <DonutChartBackTrack strokewidth={strokewidth} r={radius} cx={halfsize} cy={halfsize} transform={rotateval} style={trackstyle} className="donutchart-track"/>
      <DonutChartTrack
        valType={valType}
        strokewidth={strokewidth}
        r={radius}
        cx={halfsize}
        cy={halfsize}
        transform={rotateval}
        style={indicatorstyle}
      />
      <Text className="donutchart-text" x={halfsize} y={halfsize} style={{textAnchor:'middle'}} >
        <TextVal>{Math.floor(value)}</TextVal>
        <TextPercent>%</TextPercent>
        <TextLabel x={halfsize} y={halfsize+10}>{valType === 'POSITIVE' ? 'Positive' : 'Negative'}</TextLabel>
      </Text>
    </DonutChartSVG>
  );
}
