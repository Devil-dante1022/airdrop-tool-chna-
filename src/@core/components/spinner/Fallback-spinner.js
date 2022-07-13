// ** Logo
import logo from '@src/assets/images/logo/brewlabs-loading.gif';

const SpinnerComponent = () => {
  return (
    <div className='fallback-spinner vh-100'>
      <div className='loading'>
        <div className='effect-1 effects'></div>
        <div className='effect-2 effects'></div>
        <div className='effect-3 effects'></div>
      </div>
      {/* <img className='fallback-logo' src={logo} alt='Loading goodness' /> */}
    </div>
  );
};

export default SpinnerComponent;
