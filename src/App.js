import { Outlet } from 'react-router-dom';
import './App.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import SideMenu from './components/side-menu/Side-menu';
import Header from './components/header/Header';

function App() {
  return (
    <Container fluid="xs">
      <Row className="mb-1">
        <Col xs={12}>
          <Header />
        </Col>
      </Row>
      <Row>
          <Col className="App-side-menu d-flex" xs={3}>
            <SideMenu />
          </Col>
          <Col  xs={9}>
            <Outlet />
          </Col>
      </Row>
    </Container>
  );
}

export default App;
