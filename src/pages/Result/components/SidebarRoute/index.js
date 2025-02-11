import PropTypes, { shape } from 'prop-types';
import { useEffect, useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import menu from '../../../../assets/images/icons/menu.svg';
import { Container, LogoContainer, OffcanvasStyle } from './styles';

import captaLogo from '../../../../assets/images/captaLogo.svg';
import Header from './components/Header';
import Route from './components/Route';

export default function SidebarRoute({
  setView,
  goingRoute,
  returningRoute,
  tickets,
  view,
  logo,
  isTicketsTabVisible,
}) {
  const [show, setShow] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const logoSrc = (logo === 'false' || !logo) ? captaLogo : logo;

  return (
    width > 800
      ? (
        <Container>
          <LogoContainer>
            <img src={logoSrc} alt="logo" />
          </LogoContainer>

          <Header setView={setView} view={view} isTicketsTabVisible={isTicketsTabVisible} />
          <Route
            goingRoute={goingRoute}
            returningRoute={returningRoute}
            tickets={tickets}
            view={view}
          />
        </Container>
      )
      : (
        <>
          <button className="menuButton" type="button" onClick={handleShow}>
            <img src={menu} alt="menu" />
          </button>
          <OffcanvasStyle>
            <Offcanvas show={show} onHide={handleClose} style={{ width: 250 }}>
              <LogoContainer>
                <img src={logoSrc} alt="logo" />
              </LogoContainer>

              <Header setView={setView} view={view} />
              <Route
                goingRoute={goingRoute}
                returningRoute={returningRoute}
                view={view}
                tickets={tickets}
              />
            </Offcanvas>
          </OffcanvasStyle>
        </>
      )

  );
}

SidebarRoute.propTypes = {
  setView: PropTypes.func.isRequired,
  goingRoute: PropTypes.arrayOf(shape()).isRequired,
  returningRoute: PropTypes.arrayOf(shape()).isRequired,
  tickets: PropTypes.arrayOf(shape()).isRequired,
  view: PropTypes.string.isRequired,
  logo: PropTypes.string,
  isTicketsTabVisible: PropTypes.bool,
};

SidebarRoute.defaultProps = {
  logo: false,
  isTicketsTabVisible: true,
};
