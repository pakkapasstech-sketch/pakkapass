import logo from "/PP_FavIcon.svg";
import './loader.css';

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-wrapper">
        <div className="spinner-ring">
          <img
            src={logo}
            alt="PakkaPass"
            className="loader-logo"
          />
        </div>

        <h3 className="loader-text">
          PakkaPass Loading...
        </h3>
      </div>
    </div>
  );
};

export default Loader;