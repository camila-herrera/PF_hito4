import React from 'react';

const Footer = () => {
  return (
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
      <div className="col-md-4 d-flex align-items-center">
        <a href="/" className="mb-3 me-2 mb-md-0 text-secondary text-decoration-none lh-1">
          {/* Reemplaza este SVG por el ícono correspondiente o una imagen de tu logo */}
          <svg className="bi" width="30" height="24" aria-label="Logo">
            <use xlinkHref="#bootstrap"></use>
          </svg>
        </a>
        <span className="mb-3 mb-md-0 text-secondary">© 2025 by Camila y Luis, Inc</span>
      </div>

      <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
        <li className="ms-3">
          <a className="text-secondary" href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            {/* Reemplaza con el ícono real o la ruta SVG para Twitter */}
            <svg className="bi" width="24" height="24">
              <use xlinkHref="#twitter"></use>
            </svg>
          </a>
        </li>
        <li className="ms-3">
          <a className="text-secondary" href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            {/* Reemplaza con el ícono real o la ruta SVG para Instagram */}
            <svg className="bi" width="24" height="24">
              <use xlinkHref="#instagram"></use>
            </svg>
          </a>
        </li>
        <li className="ms-3">
          <a className="text-secondary" href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            {/* Reemplaza con el ícono real o la ruta SVG para Facebook */}
            <svg className="bi" width="24" height="24">
              <use xlinkHref="#facebook"></use>
            </svg>
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
