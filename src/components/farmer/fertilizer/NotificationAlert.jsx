import PropTypes from 'prop-types';

const NotificationAlert = ({ message }) => {
  return (
    <div className="alert alert-info">
      <p>{message}</p>
    </div>
  );
};

// PropTypes validation
NotificationAlert.propTypes = {
  message: PropTypes.string.isRequired,
};

export default NotificationAlert;
