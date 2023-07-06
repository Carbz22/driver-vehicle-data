

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

import logo from '../../assets/images/logo.png';

export default function Header() {
    return (
        <Navbar expand={'xs'} className='bg-body-secondary'>
            <Container fluid="xs">
                <Navbar.Brand>
                    <img height={30} className="d-inline-block align-top" src={logo} alt="logo"/> 
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}