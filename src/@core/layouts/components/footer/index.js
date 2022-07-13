const Footer = () => {
  return (
    <p className='clearfix mb-0'>
      <span className='float-md-left d-block d-md-inline-block mt-25'>
        Copyright © {new Date().getFullYear()} AirDrop. All rights Reserved
      </span>
      <span className='float-md-right d-none d-md-block'>
        Powered by{' '}
        <a
          href='https://www.brewlabs.tools/'
          target='_blank'
          rel='noopener noreferrer'
        >
          Brewlabs
        </a>
      </span>
    </p>
  );
};

export default Footer;
