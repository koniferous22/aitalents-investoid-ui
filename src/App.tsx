import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import styled from 'styled-components';
import { NewsHeadlinePage } from './pages/NewsHeadlinePage';
import { ResultsPage } from './pages/ResultsPage';
import { SearchPage } from './pages/SearchPage';
import svgLogo from './logo_khaos.svg';

const InvestoidLink = styled(Link)`
  font-size: 30px;
  margin: 40px;
  border: 4px solid;
  border-radius: 5px;
  text-decoration: none;
  padding: 2px 20px;
  display: block;
`;

const Nav = styled.nav`
  margin-top: 50px;
  display: flex;
  justify-content: center;
`;

const NavBar = () => (
  <Nav>
    <img src={svgLogo} />
    <div>
      <InvestoidLink to={'/headline'} >Classify news headlines</InvestoidLink>
    </div>
    <div>
      <InvestoidLink to={'/search'} >Search Company press releases</InvestoidLink>
    </div>
  </Nav>
)

const FooterWrapper = styled.div`
  bottom: 0;
  position: fixed;
`;

const Footer = () => <FooterWrapper>Made by team Khaos, as part of AITalents bootcamp 2019-2020</FooterWrapper>

const AppWrapper = styled.div`
  height: 100vh;
`

export const App = () => (
  <AppWrapper>
    <Router>
      <NavBar />
      <Switch>
        <Route path='/headline'>
          <NewsHeadlinePage />
        </Route>
        <Route path='/search'>
          <SearchPage />
        </Route>
        <Route path='/results'>
          <ResultsPage />
        </Route>
        <Route exact path=''>
          <Redirect to='/headline'/>
        </Route>
      </Switch>
      <Footer />
    </Router>
  </AppWrapper>
);
