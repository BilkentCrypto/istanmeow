const MoralisError = require('@moralisweb3/common-core');

const makeMoralisErrorMessage = (error) => {
  let message = error.message || 'Unknown error';

  const errorResponse = error.details?.response;

  const errorResponseData =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof errorResponse === 'object' ? (error.details?.response).data : null;

  if (errorResponseData) {
    // Handle MoralisError
    if (errorResponseData && errorResponseData?.message) {
      message = `${errorResponseData?.name ? `${errorResponseData.name}: ` : ''}${errorResponseData.message}`;
    } else if (errorResponseData.error) {
      // Handle ParseError
      message = errorResponseData.error;
    }
  }

  return message;
};

const errorHandler = (error, req, res, _next) => {
  res.status(500).json({ error: error.message });
}

module.exports=errorHandler;